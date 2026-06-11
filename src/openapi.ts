import Type, { type TSchema } from 'typebox';

import { DATASET_FILENAMES, DATASET_META } from './data/index.js';
import {
  DataEnvelopeSchema,
  DataResponseSchema,
  DatasetMetaSchema,
  DistrictListQuerySchema,
  DistrictParamsSchema,
  DistrictSchema,
  ErrorResponseSchema,
  FieldQuerySchema,
  ListResponseSchema,
  MunicipalityListQuerySchema,
  MunicipalityParamsSchema,
  MunicipalitySchema,
  NeighborhoodListQuerySchema,
  NeighborhoodParamsSchema,
  NeighborhoodSchema,
  PaginationFieldQuerySchema,
  PostalCodeStatusPaginationFieldQuerySchema,
  ProvinceListQuerySchema,
  ProvinceParamsSchema,
  ProvinceSchema,
  VillageListQuerySchema,
  VillageParamsSchema,
  VillageSchema,
} from './schemas/index.js';

type JsonSchema = Record<string, unknown>;
type OpenApiDocument = Record<string, unknown>;

interface RouteSpec {
  readonly tags: readonly string[];
  readonly summary: string;
  readonly description?: string;
  readonly badRequestDescription?: string;
  readonly params?: TSchema;
  readonly query?: TSchema;
  readonly response?: TSchema;
  readonly notFound?: boolean;
}

interface OpenApiParameter {
  readonly name: string;
  readonly in: 'path' | 'query';
  readonly required: boolean;
  readonly schema: JsonSchema;
  readonly description?: string;
}

const DATASET_FILE_SCHEMA = Type.Union(Object.values(DATASET_FILENAMES).map((filename) => Type.Literal(filename)));

const DATASET_VERSION_SCHEMA = Type.Literal(DATASET_META.datasetVersion);

const StaticDatasetSchema = Type.Array(Type.Unknown());

const PARAMETER_DESCRIPTIONS: Readonly<Record<string, string>> = {
  fields: 'Comma-separated field names to include in each response item.',
  include: 'Comma-separated related resources to embed in a detail response.',
  search: 'Case-insensitive normalized text search by name.',
  sort: 'Sort order for list responses.',
  limit: 'Maximum number of items to return.',
  offset: 'Zero-based item offset.',
  minPopulation: 'Minimum population. Must be less than or equal to maxPopulation when both are provided.',
  maxPopulation: 'Maximum population. Must be greater than or equal to minPopulation when both are provided.',
  minArea: 'Minimum area in km2. Must be less than or equal to maxArea when both are provided.',
  maxArea: 'Maximum area in km2. Must be greater than or equal to minArea when both are provided.',
  minAltitude: 'Minimum altitude in meters. Must be less than or equal to maxAltitude when both are provided.',
  maxAltitude: 'Maximum altitude in meters. Must be greater than or equal to minAltitude when both are provided.',
  isCoastal: 'Filter provinces by coastal status.',
  isMetropolitan: 'Filter provinces by metropolitan municipality status.',
  provinceId: 'Filter by province id. Must match districtId and municipalityId hierarchy filters when provided.',
  districtId: 'Filter by district id. Must match provinceId and municipalityId hierarchy filters when provided.',
  municipalityId: 'Filter by municipality id. Must match provinceId and districtId hierarchy filters when provided.',
  type: 'Filter municipalities by municipality type.',
  postalCode: 'Filter by exact five-digit postal code.',
  postalCodePrefix: 'Filter by one-to-five digit postal code prefix.',
  postalCodeStatus: 'Comma-separated postal code status filter.',
};

function asJsonSchema(schema: TSchema): JsonSchema {
  return schema as JsonSchema;
}

function schemaProperties(schema: TSchema): Record<string, JsonSchema> {
  const objectSchema = schema as unknown as {
    readonly properties?: Record<string, JsonSchema>;
  };

  return objectSchema.properties ?? {};
}

function schemaRequired(schema: TSchema): readonly string[] {
  const objectSchema = schema as unknown as {
    readonly required?: readonly string[];
  };

  return objectSchema.required ?? [];
}

function parametersFromSchema(schema: TSchema, location: 'path' | 'query'): OpenApiParameter[] {
  const required = new Set(schemaRequired(schema));

  return Object.entries(schemaProperties(schema)).map(([name, property]) => {
    const description = PARAMETER_DESCRIPTIONS[name];

    return {
      name,
      in: location,
      required: location === 'path' || required.has(name),
      schema: property,
      ...(description === undefined ? {} : { description }),
    };
  });
}

function parameters(spec: RouteSpec): OpenApiParameter[] {
  return [
    ...(spec.params === undefined ? [] : parametersFromSchema(spec.params, 'path')),
    ...(spec.query === undefined ? [] : parametersFromSchema(spec.query, 'query')),
  ];
}

function jsonResponse(description: string, schema: TSchema): JsonSchema {
  return {
    description,
    content: {
      'application/json': {
        schema: asJsonSchema(schema),
      },
    },
  };
}

function operation(spec: RouteSpec): JsonSchema {
  return {
    tags: spec.tags,
    summary: spec.summary,
    ...(spec.description === undefined ? {} : { description: spec.description }),
    parameters: parameters(spec),
    responses: {
      200:
        spec.response === undefined
          ? { description: 'Successful response.' }
          : jsonResponse('Successful response.', spec.response),
      ...(spec.notFound === true ? { 404: jsonResponse('Not found.', ErrorResponseSchema) } : {}),
      400: jsonResponse(spec.badRequestDescription ?? 'Invalid request.', ErrorResponseSchema),
      429: jsonResponse('Rate limit exceeded.', ErrorResponseSchema),
      500: jsonResponse('Internal server error.', ErrorResponseSchema),
    },
  };
}

function pathItem(spec: RouteSpec): JsonSchema {
  return {
    get: operation(spec),
  };
}

function datasetPathItem(spec: RouteSpec): JsonSchema {
  return {
    get: {
      ...operation(spec),
      responses: {
        200: jsonResponse('Static dataset JSON file.', StaticDatasetSchema),
        304: { description: 'The cached dataset is still fresh.' },
        404: jsonResponse('Dataset not found.', ErrorResponseSchema),
        400: jsonResponse('Invalid request.', ErrorResponseSchema),
        429: jsonResponse('Rate limit exceeded.', ErrorResponseSchema),
        500: jsonResponse('Internal server error.', ErrorResponseSchema),
      },
    },
  };
}

function latestDatasetParams(): TSchema {
  return Type.Object(
    {
      datasetFile: DATASET_FILE_SCHEMA,
    },
    { additionalProperties: false },
  );
}

function versionedDatasetParams(): TSchema {
  return Type.Object(
    {
      datasetVersion: DATASET_VERSION_SCHEMA,
      datasetFile: DATASET_FILE_SCHEMA,
    },
    { additionalProperties: false },
  );
}

export function createOpenApiDocument(): OpenApiDocument {
  return {
    openapi: '3.1.0',
    info: {
      title: 'TurkiyeAPI',
      version: DATASET_META.apiVersion,
      description:
        'REST API for Turkish administrative divisions: provinces, districts, municipalities, neighborhoods, and villages.',
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'https://api.turkiyeapi.dev',
        description: 'Production',
      },
      {
        url: 'http://localhost:3000',
        description: 'Local development',
      },
    ],
    tags: [
      { name: 'System', description: 'Health and metadata endpoints.' },
      { name: 'Datasets', description: 'Static dataset downloads with cache headers.' },
      { name: 'Provinces', description: 'Province resources and province-scoped collections.' },
      { name: 'Districts', description: 'District resources and district-scoped collections.' },
      { name: 'Municipalities', description: 'Municipality resources and municipality-scoped collections.' },
      { name: 'Neighborhoods', description: 'Neighborhood resources.' },
      { name: 'Villages', description: 'Village resources.' },
    ],
    paths: {
      '/health': pathItem({
        tags: ['System'],
        summary: 'Health check',
        response: Type.Object({ status: Type.Literal('ok') }, { additionalProperties: false }),
      }),
      '/v2/meta': pathItem({
        tags: ['System'],
        summary: 'Get API and dataset metadata',
        response: DataEnvelopeSchema(DatasetMetaSchema),
      }),
      '/v2/openapi.json': pathItem({
        tags: ['System'],
        summary: 'Get OpenAPI document',
      }),
      '/v2/datasets/{datasetFile}': datasetPathItem({
        tags: ['Datasets'],
        summary: 'Download latest static dataset file',
        description: `Valid dataset files: ${Object.values(DATASET_FILENAMES).join(', ')}.`,
        params: latestDatasetParams(),
      }),
      '/v2/datasets/{datasetVersion}/{datasetFile}': datasetPathItem({
        tags: ['Datasets'],
        summary: 'Download versioned static dataset file',
        description: `Currently supported dataset version: ${DATASET_META.datasetVersion}.`,
        params: versionedDatasetParams(),
      }),
      '/v2/provinces': pathItem({
        tags: ['Provinces'],
        summary: 'List provinces',
        badRequestDescription: 'Invalid request. Contradictory range filters return INVALID_RANGE_FILTER.',
        query: ProvinceListQuerySchema,
        response: ListResponseSchema(ProvinceSchema),
      }),
      '/v2/provinces/{provinceId}': pathItem({
        tags: ['Provinces'],
        summary: 'Get province by id',
        params: ProvinceParamsSchema,
        query: FieldQuerySchema,
        response: DataResponseSchema(ProvinceSchema),
        notFound: true,
      }),
      '/v2/provinces/{provinceId}/districts': pathItem({
        tags: ['Provinces'],
        summary: 'List districts in a province',
        params: ProvinceParamsSchema,
        query: PaginationFieldQuerySchema,
        response: ListResponseSchema(DistrictSchema),
        notFound: true,
      }),
      '/v2/provinces/{provinceId}/municipalities': pathItem({
        tags: ['Provinces'],
        summary: 'List municipalities in a province',
        params: ProvinceParamsSchema,
        query: PaginationFieldQuerySchema,
        response: ListResponseSchema(MunicipalitySchema),
        notFound: true,
      }),
      '/v2/provinces/{provinceId}/neighborhoods': pathItem({
        tags: ['Provinces'],
        summary: 'List neighborhoods in a province',
        params: ProvinceParamsSchema,
        query: PostalCodeStatusPaginationFieldQuerySchema,
        response: ListResponseSchema(NeighborhoodSchema),
        notFound: true,
      }),
      '/v2/provinces/{provinceId}/villages': pathItem({
        tags: ['Provinces'],
        summary: 'List villages in a province',
        params: ProvinceParamsSchema,
        query: PostalCodeStatusPaginationFieldQuerySchema,
        response: ListResponseSchema(VillageSchema),
        notFound: true,
      }),
      '/v2/districts': pathItem({
        tags: ['Districts'],
        summary: 'List districts',
        badRequestDescription: 'Invalid request. Contradictory range filters return INVALID_RANGE_FILTER.',
        query: DistrictListQuerySchema,
        response: ListResponseSchema(DistrictSchema),
      }),
      '/v2/districts/{districtId}': pathItem({
        tags: ['Districts'],
        summary: 'Get district by id',
        params: DistrictParamsSchema,
        query: FieldQuerySchema,
        response: DataResponseSchema(DistrictSchema),
        notFound: true,
      }),
      '/v2/districts/{districtId}/municipalities': pathItem({
        tags: ['Districts'],
        summary: 'List municipalities in a district',
        params: DistrictParamsSchema,
        query: PaginationFieldQuerySchema,
        response: ListResponseSchema(MunicipalitySchema),
        notFound: true,
      }),
      '/v2/districts/{districtId}/neighborhoods': pathItem({
        tags: ['Districts'],
        summary: 'List neighborhoods in a district',
        params: DistrictParamsSchema,
        query: PostalCodeStatusPaginationFieldQuerySchema,
        response: ListResponseSchema(NeighborhoodSchema),
        notFound: true,
      }),
      '/v2/districts/{districtId}/villages': pathItem({
        tags: ['Districts'],
        summary: 'List villages in a district',
        params: DistrictParamsSchema,
        query: PostalCodeStatusPaginationFieldQuerySchema,
        response: ListResponseSchema(VillageSchema),
        notFound: true,
      }),
      '/v2/municipalities': pathItem({
        tags: ['Municipalities'],
        summary: 'List municipalities',
        badRequestDescription:
          'Invalid request. Contradictory range filters return INVALID_RANGE_FILTER; contradictory hierarchy filters return INVALID_HIERARCHY_FILTER.',
        query: MunicipalityListQuerySchema,
        response: ListResponseSchema(MunicipalitySchema),
      }),
      '/v2/municipalities/{municipalityId}': pathItem({
        tags: ['Municipalities'],
        summary: 'Get municipality by id',
        params: MunicipalityParamsSchema,
        query: FieldQuerySchema,
        response: DataResponseSchema(MunicipalitySchema),
        notFound: true,
      }),
      '/v2/municipalities/{municipalityId}/neighborhoods': pathItem({
        tags: ['Municipalities'],
        summary: 'List neighborhoods in a municipality',
        params: MunicipalityParamsSchema,
        query: PostalCodeStatusPaginationFieldQuerySchema,
        response: ListResponseSchema(NeighborhoodSchema),
        notFound: true,
      }),
      '/v2/neighborhoods': pathItem({
        tags: ['Neighborhoods'],
        summary: 'List neighborhoods',
        badRequestDescription:
          'Invalid request. Contradictory range filters return INVALID_RANGE_FILTER; contradictory hierarchy filters return INVALID_HIERARCHY_FILTER.',
        query: NeighborhoodListQuerySchema,
        response: ListResponseSchema(NeighborhoodSchema),
      }),
      '/v2/neighborhoods/{neighborhoodId}': pathItem({
        tags: ['Neighborhoods'],
        summary: 'Get neighborhood by id',
        params: NeighborhoodParamsSchema,
        query: FieldQuerySchema,
        response: DataResponseSchema(NeighborhoodSchema),
        notFound: true,
      }),
      '/v2/villages': pathItem({
        tags: ['Villages'],
        summary: 'List villages',
        badRequestDescription:
          'Invalid request. Contradictory range filters return INVALID_RANGE_FILTER; contradictory hierarchy filters return INVALID_HIERARCHY_FILTER.',
        query: VillageListQuerySchema,
        response: ListResponseSchema(VillageSchema),
      }),
      '/v2/villages/{villageId}': pathItem({
        tags: ['Villages'],
        summary: 'Get village by id',
        params: VillageParamsSchema,
        query: FieldQuerySchema,
        response: DataResponseSchema(VillageSchema),
        notFound: true,
      }),
    },
    components: {
      schemas: {
        Province: ProvinceSchema,
        District: DistrictSchema,
        Municipality: MunicipalitySchema,
        Neighborhood: NeighborhoodSchema,
        Village: VillageSchema,
        ErrorResponse: ErrorResponseSchema,
        Meta: DatasetMetaSchema,
      },
    },
  };
}
