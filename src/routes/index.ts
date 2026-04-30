import { type FastifyPluginAsync } from 'fastify';

import {
  type DatasetService,
  type ProvinceService,
  type DistrictService,
  type MunicipalityService,
  type NeighborhoodService,
  type VillageService,
} from '../services/index.js';
import datasets from './datasets.js';
import provinces from './provinces.js';
import districts from './districts.js';
import municipalities from './municipalities.js';
import neighborhoods from './neighborhoods.js';
import villages from './villages.js';
import { DATASET_META } from '../data/dataset-meta.js';
import { createOpenApiDocument } from '../openapi.js';
import { DataEnvelopeSchema, DatasetMetaSchema } from '../schemas/index.js';
import { createDataEnvelope } from '../utils/index.js';

export interface V2RouteOptions {
  readonly datasetService: DatasetService;
  readonly provinceService: ProvinceService;
  readonly districtService: DistrictService;
  readonly municipalityService: MunicipalityService;
  readonly neighborhoodService: NeighborhoodService;
  readonly villageService: VillageService;
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
      return createDataEnvelope(DATASET_META);
    },
  );
};

export default registerV2Routes;
