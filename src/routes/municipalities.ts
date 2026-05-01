import { type FastifyPluginAsync } from 'fastify';
import {
  MUNICIPALITY_FIELDS,
  MUNICIPALITY_INCLUDES,
  NEIGHBORHOOD_FIELDS,
  createDataResponse,
  createListResponse,
  hasInclude,
  normalizePagination,
  parseFields,
  parseIncludes,
  paginate,
  projectFields,
  projectFieldsList,
  sendBadRequest,
  sendNotFound,
} from '../utils/index.js';
import {
  DataResponseSchema,
  ErrorResponseSchema,
  FieldQuerySchema,
  type FieldQuery,
  ListResponseSchema,
  type MunicipalityListQuery,
  MunicipalityListQuerySchema,
  type MunicipalityParams,
  MunicipalityParamsSchema,
  MunicipalitySchema,
  NeighborhoodSchema,
  PaginationFieldQuerySchema,
  type PaginationFieldQuery,
} from '../schemas/index.js';
import { type MunicipalityService } from '../services/index.js';

interface MunicipalityRouteOptions {
  readonly municipalityService: MunicipalityService;
}

const municipalityNotFound = {
  code: 'MUNICIPALITY_NOT_FOUND',
  message: 'Municipality not found.',
} as const;

const municipalityRoutes: FastifyPluginAsync<MunicipalityRouteOptions> = async (fastify, options) => {
  const { municipalityService } = options;

  fastify.get<{ Querystring: MunicipalityListQuery }>(
    '/',
    {
      schema: {
        querystring: MunicipalityListQuerySchema,
        response: {
          200: ListResponseSchema(MunicipalitySchema),
        },
      },
    },
    async (request, reply) => {
      const result = municipalityService.listMunicipalities(request.query);
      const fields = parseFields(request.query.fields, MUNICIPALITY_FIELDS);

      if (!fields.ok) {
        return sendBadRequest(reply, 'INVALID_FIELDS', fields.message);
      }

      return createListResponse(projectFieldsList(result.items, fields.fields), result.pagination, result.total);
    },
  );

  fastify.get<{ Params: MunicipalityParams; Querystring: FieldQuery }>(
    '/:municipalityId',
    {
      schema: {
        params: MunicipalityParamsSchema,
        querystring: FieldQuerySchema,
        response: {
          200: DataResponseSchema(MunicipalitySchema),
          404: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const municipality = municipalityService.getMunicipalityById(request.params.municipalityId);
      const fields = parseFields(request.query.fields, MUNICIPALITY_FIELDS);
      const includes = parseIncludes(request.query.include, MUNICIPALITY_INCLUDES);

      if (!fields.ok) {
        return sendBadRequest(reply, 'INVALID_FIELDS', fields.message);
      }

      if (!includes.ok) {
        return sendBadRequest(reply, 'INVALID_INCLUDE', includes.message);
      }

      if (municipality === undefined) {
        return sendNotFound(reply, municipalityNotFound.code, municipalityNotFound.message);
      }

      const data: Record<string, unknown> = { ...projectFields(municipality, fields.fields) };

      if (hasInclude(includes.includes, 'province')) {
        data['province'] = municipalityService.getProvinceByMunicipalityId(municipality.id);
      }

      if (hasInclude(includes.includes, 'district')) {
        data['district'] = municipalityService.getDistrictByMunicipalityId(municipality.id);
      }

      if (hasInclude(includes.includes, 'neighborhoods')) {
        data['neighborhoods'] = municipalityService.getNeighborhoodsByMunicipalityId(municipality.id) ?? [];
      }

      return createDataResponse(data);
    },
  );

  fastify.get<{ Params: MunicipalityParams; Querystring: PaginationFieldQuery }>(
    '/:municipalityId/neighborhoods',
    {
      schema: {
        params: MunicipalityParamsSchema,
        querystring: PaginationFieldQuerySchema,
        response: {
          200: ListResponseSchema(NeighborhoodSchema),
          404: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const neighborhoods = municipalityService.getNeighborhoodsByMunicipalityId(request.params.municipalityId);
      const fields = parseFields(request.query.fields, NEIGHBORHOOD_FIELDS);

      if (!fields.ok) {
        return sendBadRequest(reply, 'INVALID_FIELDS', fields.message);
      }

      if (neighborhoods === undefined) {
        return sendNotFound(reply, municipalityNotFound.code, municipalityNotFound.message);
      }

      const pagination = normalizePagination(request.query);
      const items = paginate(neighborhoods, pagination);

      return createListResponse(projectFieldsList(items, fields.fields), pagination, neighborhoods.length);
    },
  );
};

export default municipalityRoutes;
