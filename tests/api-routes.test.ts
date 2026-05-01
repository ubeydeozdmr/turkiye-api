import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { type FastifyInstance } from 'fastify';

import build from '../src/app.js';
import { loadDatasets } from '../src/data/index.js';

let app: FastifyInstance;

const datasets = loadDatasets();
const datasetCounts = {
  provinces: datasets.provinces.length,
  districts: datasets.districts.length,
  municipalities: datasets.municipalities.length,
  neighborhoods: datasets.neighborhoods.length,
  villages: datasets.villages.length,
};

interface ErrorPayload {
  readonly error: {
    readonly code: string;
  };
}

function parseErrorPayload(response: Awaited<ReturnType<FastifyInstance['inject']>>): ErrorPayload {
  return response.json() as ErrorPayload;
}

before(async () => {
  app = build({ logger: false });
  await app.ready();
});

after(async () => {
  await app.close();
});

describe('API routes', () => {
  it('serves health and v2 metadata', async () => {
    const health = await app.inject('/health');
    assert.equal(health.statusCode, 200);
    assert.deepEqual(health.json(), { status: 'ok' });

    const meta = await app.inject('/v2/meta');
    assert.equal(meta.statusCode, 200);
    assert.deepEqual(meta.json().data.counts, datasetCounts);
    assert.equal(typeof meta.json().data.apiVersion, 'string');
    assert.equal(typeof meta.json().data.datasetVersion, 'string');
  });

  it('allows public browser access with CORS headers and preflight handling', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/v2/meta',
      headers: {
        origin: 'https://example.com',
      },
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.headers['access-control-allow-origin'], '*');
    assert.equal(
      response.headers['access-control-expose-headers'],
      'etag, last-modified, cache-control, x-ratelimit-limit, x-ratelimit-remaining, x-ratelimit-reset, retry-after',
    );

    const preflight = await app.inject({
      method: 'OPTIONS',
      url: '/v2/meta',
      headers: {
        origin: 'https://example.com',
        'access-control-request-method': 'GET',
        'access-control-request-headers': 'x-api-key,if-none-match',
      },
    });

    assert.equal(preflight.statusCode, 204);
    assert.equal(preflight.headers['access-control-allow-origin'], '*');
    assert.equal(preflight.headers['access-control-allow-methods'], 'GET, HEAD, OPTIONS');
    assert.equal(
      preflight.headers['access-control-allow-headers'],
      'content-type, authorization, x-api-key, if-none-match',
    );
    assert.equal(preflight.headers['access-control-max-age'], '86400');
  });

  it('documents metadata with a data envelope in OpenAPI', async () => {
    const response = await app.inject('/v2/openapi.json');

    assert.equal(response.statusCode, 200);
    const body = response.json();
    const metaSchema = body.paths['/v2/meta'].get.responses['200'].content['application/json'].schema;

    assert.equal(metaSchema.type, 'object');
    assert.deepEqual(metaSchema.required, ['data']);
    assert.equal(metaSchema.properties.data.type, 'object');
    assert.ok(metaSchema.properties.data.properties.apiVersion);
    assert.ok(metaSchema.properties.data.properties.counts);
  });

  it('returns list counts for top-level resources', async () => {
    const resources = [
      ['provinces', datasetCounts.provinces],
      ['districts', datasetCounts.districts],
      ['municipalities', datasetCounts.municipalities],
      ['neighborhoods', datasetCounts.neighborhoods],
      ['villages', datasetCounts.villages],
    ] as const;

    for (const [resource, expectedTotal] of resources) {
      const response = await app.inject(`/v2/${resource}?limit=1`);

      assert.equal(response.statusCode, 200);
      const body = response.json();
      assert.equal(body.meta.count, 1);
      assert.equal(body.meta.total, expectedTotal);
      assert.equal(body.meta.limit, 1);
      assert.equal(body.meta.offset, 0);
      assert.equal(body.data.length, 1);
    }
  });

  it('supports field projection and includes on detail routes', async () => {
    const response = await app.inject('/v2/provinces/34?fields=id,name&include=districts');

    assert.equal(response.statusCode, 200);
    const body = response.json();
    assert.deepEqual(Object.keys(body.data).sort(), ['districts', 'id', 'name']);
    assert.equal(body.data.id, 34);
    assert.equal(body.data.name, 'İstanbul');
    assert.equal(body.data.districts.length, 39);
  });

  it('exposes postal codes only on neighborhoods and villages', async () => {
    const province = await app.inject('/v2/provinces?limit=1');
    const district = await app.inject('/v2/districts?limit=1');
    const neighborhood = await app.inject('/v2/neighborhoods?fields=id,postalCode&limit=1');
    const village = await app.inject('/v2/villages?fields=id,postalCode&limit=1');

    assert.equal(province.statusCode, 200);
    assert.equal(district.statusCode, 200);
    assert.equal(neighborhood.statusCode, 200);
    assert.equal(village.statusCode, 200);
    assert.equal('postalCode' in province.json().data[0], false);
    assert.equal('postalCode' in district.json().data[0], false);
    assert.equal('postalCode' in neighborhood.json().data[0], true);
    assert.equal('postalCode' in village.json().data[0], true);

    const invalidProvinceField = await app.inject('/v2/provinces?fields=id,postalCode');
    const invalidDistrictField = await app.inject('/v2/districts?fields=id,postalCode');

    assert.equal(invalidProvinceField.statusCode, 400);
    assert.equal(invalidDistrictField.statusCode, 400);
    assert.equal(invalidProvinceField.json().error.code, 'INVALID_FIELDS');
    assert.equal(invalidDistrictField.json().error.code, 'INVALID_FIELDS');
  });

  it('returns relationship count checks', async () => {
    const districts = await app.inject('/v2/provinces/34/districts');
    assert.equal(districts.statusCode, 200);
    assert.equal(districts.json().meta.total, 39);

    const neighborhoods = await app.inject('/v2/districts/1103/neighborhoods');
    assert.equal(neighborhoods.statusCode, 200);
    assert.equal(neighborhoods.json().meta.total, 5);
  });

  it('serves dynamic v2 responses with conservative cache headers and ETags', async () => {
    const response = await app.inject('/v2/provinces?limit=1');

    assert.equal(response.statusCode, 200);
    assert.equal(response.headers['cache-control'], 'public, max-age=300');
    assert.ok(response.headers.etag);

    const cached = await app.inject({
      url: '/v2/provinces?limit=1',
      headers: { 'if-none-match': response.headers.etag },
    });

    assert.equal(cached.statusCode, 304);
    assert.equal(cached.headers.etag, response.headers.etag);
    assert.equal(cached.headers['cache-control'], 'public, max-age=300');
    assert.equal(cached.payload, '');
  });

  it('serves static dataset files with cache headers', async () => {
    const response = await app.inject('/v2/datasets/provinces.json');

    assert.equal(response.statusCode, 200);
    assert.equal(response.headers['content-type'], 'application/json; charset=utf-8');
    assert.equal(response.headers['cache-control'], 'public, max-age=3600, stale-while-revalidate=86400');
    assert.equal(JSON.parse(response.payload).length, datasetCounts.provinces);
    assert.ok(response.headers.etag);

    const cached = await app.inject({
      url: '/v2/datasets/provinces.json',
      headers: { 'if-none-match': response.headers.etag },
    });

    assert.equal(cached.statusCode, 304);
    assert.equal(cached.payload, '');
  });
});

describe('API error behavior', () => {
  it('returns a structured 404 for unknown routes', async () => {
    const response = await app.inject('/v2/does-not-exist');

    assert.equal(response.statusCode, 404);
    assert.deepEqual(response.json(), {
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: 'Route not found.',
        status: 404,
      },
    });
  });

  it('returns a structured 404 for missing resources', async () => {
    const response = await app.inject('/v2/provinces/999');

    assert.equal(response.statusCode, 404);
    assert.deepEqual(response.json(), {
      error: {
        code: 'PROVINCE_NOT_FOUND',
        message: 'Province not found.',
        status: 404,
      },
    });
  });

  it('returns 400 for validation errors', async () => {
    const response = await app.inject('/v2/provinces?limit=0');
    const body = response.json();

    assert.equal(response.statusCode, 400);
    assert.equal(body.error.code, 'BAD_REQUEST');
    assert.equal(body.error.status, 400);
    assert.equal(response.headers['cache-control'], undefined);
    assert.equal(response.headers.etag, undefined);
  });

  it('returns 400 for invalid field and include requests', async () => {
    const invalidFields = await app.inject('/v2/provinces?fields=id,unknown');
    assert.equal(invalidFields.statusCode, 400);
    assert.equal(invalidFields.json().error.code, 'INVALID_FIELDS');

    const invalidInclude = await app.inject('/v2/provinces/34?include=unknown');
    assert.equal(invalidInclude.statusCode, 400);
    assert.equal(invalidInclude.json().error.code, 'INVALID_INCLUDE');
  });

  it('returns 404 for missing static dataset files', async () => {
    const response = await app.inject('/v2/datasets/missing.json');

    assert.equal(response.statusCode, 404);
    assert.equal(parseErrorPayload(response).error.code, 'DATASET_NOT_FOUND');
  });
});

describe('API rate limiting', () => {
  it('limits requests per configured identity header', async () => {
    const limitedApp = build({
      logger: false,
      rateLimit: {
        policies: [{ max: 2, timeWindow: '1 minute' }],
      },
    });

    await limitedApp.ready();

    try {
      const headers = { 'x-api-key': 'test-user-1' };

      const first = await limitedApp.inject({ url: '/v2/meta', headers });
      assert.equal(first.statusCode, 200);
      assert.equal(first.headers['x-ratelimit-limit'], '2');
      assert.equal(first.headers['x-ratelimit-remaining'], '1');

      const second = await limitedApp.inject({ url: '/v2/meta', headers });
      assert.equal(second.statusCode, 200);
      assert.equal(second.headers['x-ratelimit-remaining'], '0');

      const exceeded = await limitedApp.inject({ url: '/v2/meta', headers });
      assert.equal(exceeded.statusCode, 429);
      assert.equal(exceeded.headers['x-ratelimit-limit'], '2');
      assert.equal(exceeded.headers['x-ratelimit-remaining'], '0');
      assert.equal(exceeded.json().error.code, 'RATE_LIMIT_EXCEEDED');

      const otherUser = await limitedApp.inject({
        url: '/v2/meta',
        headers: { 'x-api-key': 'test-user-2' },
      });
      assert.equal(otherUser.statusCode, 200);
    } finally {
      await limitedApp.close();
    }
  });
});
