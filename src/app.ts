import fastify, { type FastifyInstance, type FastifyServerOptions } from 'fastify';
import fastifyCors from '@fastify/cors';

import { registerDynamicCache } from './cache.js';
import { loadDatasets } from './data/index.js';
import { buildIndexes } from './indexes/index.js';
import { registerRateLimit, type ApiRateLimitOptions } from './rate-limit.js';
import registerV2Routes from './routes/index.js';
import {
  createDatasetService,
  createDistrictService,
  createMunicipalityService,
  createNeighborhoodService,
  createProvinceService,
  createVillageService,
} from './services/index.js';
import { registerErrorHandlers } from './utils/index.js';

export interface AppBuildOptions extends FastifyServerOptions {
  readonly rateLimit?: ApiRateLimitOptions | false;
}

function build(opts: AppBuildOptions = {}): FastifyInstance {
  const { rateLimit, ...serverOptions } = opts;
  const app = fastify({
    ajv: {
      customOptions: {
        removeAdditional: false,
      },
    },
    ...serverOptions,
  });
  registerErrorHandlers(app);

  const datasets = loadDatasets();
  const indexes = buildIndexes(datasets);
  const datasetService = createDatasetService();
  const provinceService = createProvinceService({ datasets, indexes });
  const districtService = createDistrictService({ datasets, indexes });
  const municipalityService = createMunicipalityService({ datasets, indexes });
  const neighborhoodService = createNeighborhoodService({ datasets, indexes });
  const villageService = createVillageService({ datasets, indexes });

  app.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['content-type', 'authorization', 'x-api-key', 'if-none-match'],
    exposedHeaders: [
      'etag',
      'last-modified',
      'cache-control',
      'x-ratelimit-limit',
      'x-ratelimit-remaining',
      'x-ratelimit-reset',
      'retry-after',
    ],
    maxAge: 86400,
  });

  app.register(async (scopedApp) => {
    if (rateLimit !== false) {
      await registerRateLimit(scopedApp, rateLimit);
    }

    scopedApp.get('/health', async () => {
      return { status: 'ok' };
    });

    registerDynamicCache(scopedApp);

    scopedApp.register(registerV2Routes, {
      prefix: '/v2',
      datasetService,
      provinceService,
      districtService,
      municipalityService,
      neighborhoodService,
      villageService,
    });
  });

  return app;
}

export default build;
