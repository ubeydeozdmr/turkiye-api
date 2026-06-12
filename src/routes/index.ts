import type { FastifyPluginAsync } from 'fastify';

import datasets from './datasets.js';
import provinces from './provinces.js';
import districts from './districts.js';
import municipalities from './municipalities.js';
import neighborhoods from './neighborhoods.js';
import villages from './villages.js';
import { createOpenApiDocument } from '../openapi.js';
import { DataEnvelopeSchema, DatasetMetaSchema } from '../schemas/index.js';
import { createDataEnvelope } from '../utils/index.js';
import type { DatasetMeta } from '../data/index.js';
import type {
  DatasetService,
  ProvinceService,
  DistrictService,
  MunicipalityService,
  NeighborhoodService,
  VillageService,
} from '../services/index.js';

interface V2RouteOptions {
  readonly datasetService: DatasetService;
  readonly provinceService: ProvinceService;
  readonly districtService: DistrictService;
  readonly municipalityService: MunicipalityService;
  readonly neighborhoodService: NeighborhoodService;
  readonly villageService: VillageService;
  readonly datasetMeta: DatasetMeta;
}

const registerV2Routes: FastifyPluginAsync<V2RouteOptions> = async (fastify, options) => {
  const openApiDocument = createOpenApiDocument();

  fastify.register(datasets, {
    prefix: '/datasets',
    datasetService: options.datasetService,
  });
  fastify.register(provinces, {
    prefix: '/provinces',
    provinceService: options.provinceService,
  });
  fastify.register(districts, {
    prefix: '/districts',
    districtService: options.districtService,
  });
  fastify.register(municipalities, {
    prefix: '/municipalities',
    municipalityService: options.municipalityService,
  });
  fastify.register(neighborhoods, {
    prefix: '/neighborhoods',
    neighborhoodService: options.neighborhoodService,
  });
  fastify.register(villages, {
    prefix: '/villages',
    villageService: options.villageService,
  });
  fastify.get('/openapi.json', async () => {
    return openApiDocument;
  });
  fastify.get(
    '/meta',
    {
      schema: {
        response: {
          200: DataEnvelopeSchema(DatasetMetaSchema),
        },
      },
    },
    async () => {
      return createDataEnvelope(options.datasetMeta);
    },
  );
};

export default registerV2Routes;
