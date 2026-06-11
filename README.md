# TurkiyeAPI

Fast REST API for Turkish administrative divisions: provinces, districts, municipalities, neighborhoods, and villages.

TurkiyeAPI v2 serves the 2025 dataset from in-memory JSON files with typed Fastify routes, TypeBox validation, OpenAPI documentation, static dataset downloads, pagination, filtering, field projection, explicit relationship includes, ETags, CORS, and rate limiting.

## Production

- API: `https://api.turkiyeapi.dev`
- OpenAPI JSON: `https://api.turkiyeapi.dev/v2/openapi.json`
- Local development: `http://localhost:3000`

## Data

The current dataset metadata is exposed at `GET /v2/meta`.

| Resource       |  Count |
| -------------- | -----: |
| Provinces      |     81 |
| Districts      |    973 |
| Municipalities |  1,377 |
| Neighborhoods  | 32,254 |
| Villages       | 18,183 |

Dataset version: `2025`

Last updated: `2026-05-21`

Sources:

- TÜİK MEDAS
- PTT Kargo postal code data
- T.C. MSB Harita Genel Müdürlüğü area data
- OpenStreetMap admin_centre coordinates

## Requirements

- Node.js `>=22 <23`
- npm

## Installation

```sh
npm install
```

## Development

```sh
npm run dev
```

The server listens on `0.0.0.0:3000` by default. You can override the port and host:

```sh
PORT=4000 HOST=127.0.0.1 npm run dev
```

## Build and Run

```sh
npm run build
npm start
```

## Tests

```sh
npm test
npm run typecheck
```

## Docker

```sh
docker build -t turkiye-api .
docker run --rm -p 3000:3000 turkiye-api
```

The image exposes port `3000` and includes a health check against `/health`.

## API Overview

### System

| Method | Path               | Description              |
| ------ | ------------------ | ------------------------ |
| `GET`  | `/health`          | Health check             |
| `GET`  | `/v2/meta`         | API and dataset metadata |
| `GET`  | `/v2/openapi.json` | OpenAPI 3.1 document     |

### Dynamic Resources

| Method | Path                                                | Description                          |
| ------ | --------------------------------------------------- | ------------------------------------ |
| `GET`  | `/v2/provinces`                                     | List provinces                       |
| `GET`  | `/v2/provinces/{provinceId}`                        | Get a province                       |
| `GET`  | `/v2/provinces/{provinceId}/districts`              | List districts in a province         |
| `GET`  | `/v2/provinces/{provinceId}/municipalities`         | List municipalities in a province    |
| `GET`  | `/v2/provinces/{provinceId}/neighborhoods`          | List neighborhoods in a province     |
| `GET`  | `/v2/provinces/{provinceId}/villages`               | List villages in a province          |
| `GET`  | `/v2/districts`                                     | List districts                       |
| `GET`  | `/v2/districts/{districtId}`                        | Get a district                       |
| `GET`  | `/v2/districts/{districtId}/municipalities`         | List municipalities in a district    |
| `GET`  | `/v2/districts/{districtId}/neighborhoods`          | List neighborhoods in a district     |
| `GET`  | `/v2/districts/{districtId}/villages`               | List villages in a district          |
| `GET`  | `/v2/municipalities`                                | List municipalities                  |
| `GET`  | `/v2/municipalities/{municipalityId}`               | Get a municipality                   |
| `GET`  | `/v2/municipalities/{municipalityId}/neighborhoods` | List neighborhoods in a municipality |
| `GET`  | `/v2/neighborhoods`                                 | List neighborhoods                   |
| `GET`  | `/v2/neighborhoods/{neighborhoodId}`                | Get a neighborhood                   |
| `GET`  | `/v2/villages`                                      | List villages                        |
| `GET`  | `/v2/villages/{villageId}`                          | Get a village                        |

### Static Dataset Downloads

Latest dataset files:

```txt
GET /v2/datasets/provinces.json
GET /v2/datasets/districts.json
GET /v2/datasets/municipalities.json
GET /v2/datasets/neighborhoods.json
GET /v2/datasets/villages.json
```

Versioned dataset files:

```txt
GET /v2/datasets/2025/provinces.json
GET /v2/datasets/2025/districts.json
GET /v2/datasets/2025/municipalities.json
GET /v2/datasets/2025/neighborhoods.json
GET /v2/datasets/2025/villages.json
```

## Examples

List provinces:

```sh
curl "https://api.turkiyeapi.dev/v2/provinces"
```

Search and project fields:

```sh
curl "https://api.turkiyeapi.dev/v2/provinces?search=istanbul&fields=id,name,population"
```

Get a province with related districts:

```sh
curl "https://api.turkiyeapi.dev/v2/provinces/34?fields=id,name&include=districts"
```

List municipalities in a province:

```sh
curl "https://api.turkiyeapi.dev/v2/municipalities?provinceId=34&limit=25"
```

List town municipalities:

```sh
curl "https://api.turkiyeapi.dev/v2/municipalities?type=town"
```

Download a static dataset:

```sh
curl "https://api.turkiyeapi.dev/v2/datasets/2025/provinces.json"
```

## Response Shape

List endpoints return a `data` array and pagination metadata:

```json
{
  "data": [
    {
      "id": 34,
      "name": "İstanbul"
    }
  ],
  "meta": {
    "count": 1,
    "total": 81,
    "limit": 1,
    "offset": 0,
    "datasetVersion": "2025",
    "lastUpdated": "2026-05-21"
  }
}
```

Detail endpoints return a single `data` object:

```json
{
  "data": {
    "id": 34,
    "name": "İstanbul"
  },
  "meta": {
    "datasetVersion": "2025",
    "lastUpdated": "2026-05-21"
  }
}
```

Metadata uses a simple data envelope:

```json
{
  "data": {
    "apiVersion": "2.0.0",
    "datasetVersion": "2025",
    "lastUpdated": "2026-05-21"
  }
}
```

Errors are structured:

```json
{
  "error": {
    "code": "PROVINCE_NOT_FOUND",
    "message": "Province not found.",
    "status": 404
  }
}
```

## Query Parameters

Common list parameters:

| Parameter       | Description                                                  |
| --------------- | ------------------------------------------------------------ |
| `search`        | Case-insensitive normalized text search by name              |
| `fields`        | Comma-separated field projection                             |
| `sort`          | `id`, `-id`, `name`, `-name`, `population`, or `-population` |
| `limit`         | Page size, from `1` to `1000`; default `100`                 |
| `offset`        | Zero-based offset; default `0`                               |
| `minPopulation` | Minimum population                                           |
| `maxPopulation` | Maximum population                                           |

Resource-specific filters:

| Resource       | Filters                                                                           |
| -------------- | --------------------------------------------------------------------------------- |
| Provinces      | `minArea`, `maxArea`, `minAltitude`, `maxAltitude`, `isCoastal`, `isMetropolitan` |
| Districts      | `provinceId`, `minArea`, `maxArea`                                                |
| Municipalities | `provinceId`, `districtId`, `type`                                                |
| Neighborhoods  | `provinceId`, `districtId`, `municipalityId`, `postalCode`, `postalCodePrefix`    |
| Villages       | `provinceId`, `districtId`, `postalCode`, `postalCodePrefix`                      |

Boolean filters use `true` or `false`. Municipality `type` can be `province_center`, `district_center`, or `town`.

Contradictory range filters, such as `minPopulation` greater than `maxPopulation`, return `400 INVALID_RANGE_FILTER`.
Contradictory hierarchy filters, such as a `districtId` that does not belong to the supplied `provinceId`, return `400 INVALID_HIERARCHY_FILTER`.

## Field Projection

Use `fields` to reduce payload size:

```txt
GET /v2/provinces?fields=id,name,population
GET /v2/neighborhoods?fields=id,name,postalCode&limit=10
```

Unknown fields return `400 INVALID_FIELDS`.

## Includes

Detail endpoints stay shallow by default. Use `include` to explicitly expand relationships.

| Endpoint                              | Supported includes                                         |
| ------------------------------------- | ---------------------------------------------------------- |
| `/v2/provinces/{provinceId}`          | `districts`, `municipalities`, `neighborhoods`, `villages` |
| `/v2/districts/{districtId}`          | `province`, `municipalities`, `neighborhoods`, `villages`  |
| `/v2/municipalities/{municipalityId}` | `province`, `district`, `neighborhoods`                    |
| `/v2/neighborhoods/{neighborhoodId}`  | `province`, `district`, `municipality`                     |
| `/v2/villages/{villageId}`            | `province`, `district`                                     |

Unknown includes return `400 INVALID_INCLUDE`.

## Postal Code Status Logic

Postal codes are exposed with a `postalCodeStatus` field to clarify how each value was determined.

- `official`: The postal code is available in the official PTT postal code data and is used directly from that source.
- `derived`: The postal code is not available for the current neighborhood in the PTT data, but the neighborhood was previously a village or part of another settlement with a known postal code (and it exists in PTT data). In these cases, the previous settlement's postal code is used. This status is used only for neighborhoods.
- `estimated`: The postal code is not available in the PTT data and could not be derived from a previous settlement. The value is inferred from supplementary public sources, nearby settlements, district-level postal code patterns, or documented administrative changes. Estimated values are intended to improve searchability, but they should not be treated as official PTT records.

`postalCodeStatus` should be checked by clients that require strict official postal code data. For official-only usage, filter records where `postalCodeStatus` is `official`.

Neighborhoods: `32,142` official, `76` derived, `36` estimated, `32,254` total

Villages: `18,162` official, `21` estimated, `18,183` total

## Caching

Dynamic `/v2/*` API responses include:

```txt
Cache-Control: public, max-age=300
ETag: ...
```

Latest static dataset downloads include:

```txt
Cache-Control: public, max-age=3600, stale-while-revalidate=86400
ETag: ...
Last-Modified: ...
```

Versioned static dataset downloads include:

```txt
Cache-Control: public, max-age=31536000, immutable
ETag: ...
Last-Modified: ...
```

Requests with a matching `If-None-Match` header receive `304 Not Modified`.

## Rate Limiting

The default rate-limit policies are:

- 300 requests per minute
- 1,000 requests per 5 minutes

Identity is resolved from `x-api-key`, then `authorization`, then client IP. Rate-limit headers are exposed through CORS:

```txt
x-ratelimit-limit
x-ratelimit-remaining
x-ratelimit-reset
retry-after
```

## Project Structure

```txt
src/
  app.ts                  Fastify app builder
  server.ts               Runtime entrypoint
  data/                   Dataset loading and metadata
  indexes/                In-memory relationship indexes
  routes/                 HTTP route modules
  schemas/                TypeBox schemas
  services/               Query and lookup logic
  utils/                  Response, pagination, fields, includes, errors
datasets/                 Latest and versioned JSON datasets
tests/                    Node test runner suites
```

## Additional Documentation

- [v2 Documentation (Guide)](https://docs.turkiyeapi.dev/tr/v2/guide/) - usage guide and examples &mdash; migration guide from v1
- [v2 Documentation (API Reference)](https://docs.turkiyeapi.dev/tr/v2/api-reference/) - detailed API reference with request and response schemas
- [openapi.json](https://api.turkiyeapi.dev/v2/openapi.json) - OpenAPI 3.1 document
- [API Metadata](https://api.turkiyeapi.dev/v2/meta) - API and dataset metadata

## License

[MIT](./LICENSE)
