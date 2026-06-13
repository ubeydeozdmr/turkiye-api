import type { FastifyPluginAsync } from 'fastify';

import {
  DataResponseSchema,
  DistrictListQuerySchema,
  DistrictParamsSchema,
  DistrictSchema,
  ErrorResponseSchema,
  FieldQuerySchema,
  ListResponseSchema,
  MunicipalitySchema,
  NeighborhoodSchema,
  PaginationFieldQuerySchema,
  PostalCodeStatusPaginationFieldQuerySchema,
  VillageSchema,
} from '../schemas/index.js';
import {
  DISTRICT_FIELDS,
  DISTRICT_INCLUDES,
  MUNICIPALITY_FIELDS,
  NEIGHBORHOOD_FIELDS,
  NEIGHBORHOOD_POSTAL_CODE_STATUSES,
  VILLAGE_FIELDS,
  VILLAGE_POSTAL_CODE_STATUSES,
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
  DistrictListQuery,
  DistrictParams,
  FieldQuery,
  PaginationFieldQuery,
  PostalCodeStatusPaginationFieldQuery,
} from '../schemas/index.js';
import type { DistrictService } from '../services/index.js';

interface DistrictRouteOptions {
  readonly districtService: DistrictService;
}

const districtNotFound = {
  code: 'DISTRICT_NOT_FOUND',
  message: 'District not found.',
} as const;

const districtRoutes: FastifyPluginAsync<DistrictRouteOptions> = async (fastify, options) => {
  const { districtService } = options;

  fastify.get<{ Querystring: DistrictListQuery }>(
    '/',
    {
      schema: {
        querystring: DistrictListQuerySchema,
        response: {
          200: ListResponseSchema(DistrictSchema),
        },
      },
    },
    async (request, reply) => {
      const fields = parseFields(request.query.fields, DISTRICT_FIELDS);
      const ranges = validateRangeFilters(request.query, ['population', 'area']);

      if (!fields.ok) {
        return sendBadRequest(reply, fields.code, fields.message);
      }

      if (!ranges.ok) {
        return sendBadRequest(reply, ranges.code, ranges.message);
      }

      const result = districtService.listDistricts(request.query);

      return createListResponse(projectFieldsList(result.items, fields.fields), result.pagination, result.total);
    },
  );

  fastify.get<{ Params: DistrictParams; Querystring: FieldQuery }>(
    '/:districtId',
    {
      schema: {
        params: DistrictParamsSchema,
        querystring: FieldQuerySchema,
        response: {
          200: DataResponseSchema(DistrictSchema),
          404: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const district = districtService.getDistrictById(request.params.districtId);
      const fields = parseFields(request.query.fields, DISTRICT_FIELDS);
      const includes = parseIncludes(request.query.include, DISTRICT_INCLUDES);

      if (!fields.ok) {
        return sendBadRequest(reply, fields.code, fields.message);
      }

      if (!includes.ok) {
        return sendBadRequest(reply, includes.code, includes.message);
      }

      if (district === undefined) {
        return sendNotFound(reply, districtNotFound.code, districtNotFound.message);
      }

      const data: Record<string, unknown> = { ...projectFields(district, fields.fields) };

      if (hasInclude(includes.includes, 'province')) {
        data['province'] = districtService.getProvinceByDistrictId(district.id);
      }

      if (hasInclude(includes.includes, 'municipalities')) {
        data['municipalities'] = districtService.getMunicipalitiesByDistrictId(district.id) ?? [];
      }

      if (hasInclude(includes.includes, 'neighborhoods')) {
        data['neighborhoods'] = districtService.getNeighborhoodsByDistrictId(district.id) ?? [];
      }

      if (hasInclude(includes.includes, 'villages')) {
        data['villages'] = districtService.getVillagesByDistrictId(district.id) ?? [];
      }

      return createDataResponse(data);
    },
  );

  fastify.get<{ Params: DistrictParams; Querystring: PaginationFieldQuery }>(
    '/:districtId/municipalities',
    {
      schema: {
        params: DistrictParamsSchema,
        querystring: PaginationFieldQuerySchema,
        response: {
          200: ListResponseSchema(MunicipalitySchema),
          404: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const municipalities = districtService.getMunicipalitiesByDistrictId(request.params.districtId);
      const fields = parseFields(request.query.fields, MUNICIPALITY_FIELDS);

      if (!fields.ok) {
        return sendBadRequest(reply, fields.code, fields.message);
      }

      if (municipalities === undefined) {
        return sendNotFound(reply, districtNotFound.code, districtNotFound.message);
      }

      const pagination = normalizePagination(request.query);
      const items = paginate(municipalities, pagination);

      return createListResponse(projectFieldsList(items, fields.fields), pagination, municipalities.length);
    },
  );

  fastify.get<{ Params: DistrictParams; Querystring: PostalCodeStatusPaginationFieldQuery }>(
    '/:districtId/neighborhoods',
    {
      schema: {
        params: DistrictParamsSchema,
        querystring: PostalCodeStatusPaginationFieldQuerySchema,
        response: {
          200: ListResponseSchema(NeighborhoodSchema),
          404: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const neighborhoods = districtService.getNeighborhoodsByDistrictId(request.params.districtId);
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
        return sendNotFound(reply, districtNotFound.code, districtNotFound.message);
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

  fastify.get<{ Params: DistrictParams; Querystring: PostalCodeStatusPaginationFieldQuery }>(
    '/:districtId/villages',
    {
      schema: {
        params: DistrictParamsSchema,
        querystring: PostalCodeStatusPaginationFieldQuerySchema,
        response: {
          200: ListResponseSchema(VillageSchema),
          404: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const villages = districtService.getVillagesByDistrictId(request.params.districtId);
      const fields = parseFields(request.query.fields, VILLAGE_FIELDS);
      const postalCodeStatuses = parsePostalCodeStatuses(request.query.postalCodeStatus, VILLAGE_POSTAL_CODE_STATUSES);

      if (!fields.ok) {
        return sendBadRequest(reply, fields.code, fields.message);
      }

      if (!postalCodeStatuses.ok) {
        return sendBadRequest(reply, postalCodeStatuses.code, postalCodeStatuses.message);
      }

      if (villages === undefined) {
        return sendNotFound(reply, districtNotFound.code, districtNotFound.message);
      }

      const filtered = filterByPostalCodeQuery(
        filterByPostalCodeStatus(villages, postalCodeStatuses.statuses),
        request.query,
      );
      const pagination = normalizePagination(request.query);
      const items = paginate(filtered, pagination);

      return createListResponse(projectFieldsList(items, fields.fields), pagination, filtered.length);
    },
  );
};

export default districtRoutes;
