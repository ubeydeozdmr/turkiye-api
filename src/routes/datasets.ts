import { type FastifyPluginAsync, type FastifyReply, type FastifyRequest } from 'fastify';
import Type from 'typebox';

import { ErrorResponseSchema } from '../schemas/index.js';
import { type DatasetService, type StaticDataset } from '../services/index.js';
import { sendNotFound } from '../utils/index.js';

export interface DatasetRouteOptions {
  readonly datasetService: DatasetService;
}

const LATEST_DATASET_CACHE_CONTROL = 'public, max-age=3600, stale-while-revalidate=86400';
const VERSIONED_DATASET_CACHE_CONTROL = 'public, max-age=31536000, immutable';

const LatestDatasetParamsSchema = Type.Object(
  {
    datasetFile: Type.String({ minLength: 1 }),
  },
  { additionalProperties: false },
);

const VersionedDatasetParamsSchema = Type.Object(
  {
    datasetVersion: Type.String({ minLength: 1 }),
    datasetFile: Type.String({ minLength: 1 }),
  },
  { additionalProperties: false },
);

interface LatestDatasetParams {
  readonly datasetFile: string;
}

interface VersionedDatasetParams extends LatestDatasetParams {
  readonly datasetVersion: string;
}

function clientHasFreshDataset(request: FastifyRequest, dataset: StaticDataset): boolean {
  const ifNoneMatch = request.headers['if-none-match'];

  if (typeof ifNoneMatch !== 'string') {
    return false;
  }

  return ifNoneMatch
    .split(',')
    .map((etag) => etag.trim())
    .includes(dataset.etag);
}

function sendDataset(
  request: FastifyRequest,
  reply: FastifyReply,
  dataset: StaticDataset,
  cacheControl: string,
): FastifyReply {
  reply
    .header('Cache-Control', cacheControl)
    .header('Content-Type', 'application/json; charset=utf-8')
    .header('ETag', dataset.etag)
    .header('Last-Modified', dataset.lastModified);

  if (clientHasFreshDataset(request, dataset)) {
    return reply.status(304).send();
  }

  return reply.header('Content-Length', dataset.contentLength).send(dataset.content);
}

const datasetRoutes: FastifyPluginAsync<DatasetRouteOptions> = async (fastify, options) => {
  const { datasetService } = options;

  fastify.get<{ Params: LatestDatasetParams }>(
    '/:datasetFile',
    {
      schema: {
        params: LatestDatasetParamsSchema,
        response: {
          404: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const dataset = datasetService.getLatestDataset(request.params.datasetFile);

      if (dataset === undefined) {
        return sendNotFound(reply, 'DATASET_NOT_FOUND', 'Dataset not found.');
      }

      return sendDataset(request, reply, dataset, LATEST_DATASET_CACHE_CONTROL);
    },
  );

  fastify.get<{ Params: VersionedDatasetParams }>(
    '/:datasetVersion/:datasetFile',
    {
      schema: {
        params: VersionedDatasetParamsSchema,
        response: {
          404: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const dataset = datasetService.getVersionedDataset(request.params.datasetVersion, request.params.datasetFile);

      if (dataset === undefined) {
        return sendNotFound(reply, 'DATASET_NOT_FOUND', 'Dataset not found.');
      }

      return sendDataset(request, reply, dataset, VERSIONED_DATASET_CACHE_CONTROL);
    },
  );
};

export default datasetRoutes;
