import type { FastifyPluginAsync } from 'fastify';

import {
  DataResponseSchema,
  ErrorResponseSchema,
  FieldQuerySchema,
  ListResponseSchema,
  MunicipalityListQuerySchema,
  MunicipalityParamsSchema,
  MunicipalitySchema,
  NeighborhoodSchema,
  PostalCodeStatusPaginationFieldQuerySchema,
} from '../schemas/index.js';
import {
  MUNICIPALITY_FIELDS,
  MUNICIPALITY_INCLUDES,
  NEIGHBORHOOD_FIELDS,
  NEIGHBORHOOD_POSTAL_CODE_STATUSES,
  createDataResponse,
  createListResponse,
  filterByPostalCodeQuery,
  filterByPostalCodeStatus,
  hasInclude,
  normalizePagination,
  parseFields,
  parseIncludes,
  parsePostalCodeStatuses,
  paginate,
  projectFields,
  projectFieldsList,
  sendBadRequest,
  sendNotFound,
  validateRangeFilters,
} from '../utils/index.js';
import type {
  FieldQuery,
  MunicipalityListQuery,
  MunicipalityParams,
  PostalCodeStatusPaginationFieldQuery,
} from '../schemas/index.js';
import type { MunicipalityService } from '../services/index.js';

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
      const fields = parseFields(request.query.fields, MUNICIPALITY_FIELDS);
      const ranges = validateRangeFilters(request.query, ['population']);
      const hierarchy = municipalityService.validateListQueryHierarchy(request.query);

      if (!fields.ok) {
        return sendBadRequest(reply, fields.code, fields.message);
      }

      if (!ranges.ok) {
        return sendBadRequest(reply, ranges.code, ranges.message);
      }

      if (!hierarchy.ok) {
        return sendBadRequest(reply, hierarchy.code, hierarchy.message);
      }

      const result = municipalityService.listMunicipalities(request.query);

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
        return sendBadRequest(reply, fields.code, fields.message);
      }

      if (!includes.ok) {
        return sendBadRequest(reply, includes.code, includes.message);
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

  fastify.get<{ Params: MunicipalityParams; Querystring: PostalCodeStatusPaginationFieldQuery }>(
    '/:municipalityId/neighborhoods',
    {
      schema: {
        params: MunicipalityParamsSchema,
        querystring: PostalCodeStatusPaginationFieldQuerySchema,
        response: {
          200: ListResponseSchema(NeighborhoodSchema),
          404: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const neighborhoods = municipalityService.getNeighborhoodsByMunicipalityId(request.params.municipalityId);
      const fields = parseFields(request.query.fields, NEIGHBORHOOD_FIELDS);
      const postalCodeStatuses = parsePostalCodeStatuses(
        request.query.postalCodeStatus,
        NEIGHBORHOOD_POSTAL_CODE_STATUSES,
      );

      if (!fields.ok) {
        return sendBadRequest(reply, fields.code, fields.message);
      }

      if (!postalCodeStatuses.ok) {
        return sendBadRequest(reply, postalCodeStatuses.code, postalCodeStatuses.message);
      }

      if (neighborhoods === undefined) {
        return sendNotFound(reply, municipalityNotFound.code, municipalityNotFound.message);
      }

      const filtered = filterByPostalCodeQuery(
        filterByPostalCodeStatus(neighborhoods, postalCodeStatuses.statuses),
        request.query,
      );
      const pagination = normalizePagination(request.query);
      const items = paginate(filtered, pagination);

      return createListResponse(projectFieldsList(items, fields.fields), pagination, filtered.length);
    },
  );
};

export default municipalityRoutes;
