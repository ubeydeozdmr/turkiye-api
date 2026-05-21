import { type FastifyPluginAsync } from 'fastify';

import {
  DataResponseSchema,
  type DistrictListQuery,
  DistrictListQuerySchema,
  type DistrictParams,
  DistrictParamsSchema,
  DistrictSchema,
  ErrorResponseSchema,
  FieldQuerySchema,
  type FieldQuery,
  ListResponseSchema,
  MunicipalitySchema,
  NeighborhoodSchema,
  PaginationFieldQuerySchema,
  PostalCodeStatusPaginationFieldQuerySchema,
  type PaginationFieldQuery,
  type PostalCodeStatusPaginationFieldQuery,
  VillageSchema,
} from '../schemas/index.js';
import { type DistrictService } from '../services/index.js';
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
} from '../utils/index.js';

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
      const result = districtService.listDistricts(request.query);
      const fields = parseFields(request.query.fields, DISTRICT_FIELDS);

      if (!fields.ok) {
        return sendBadRequest(reply, 'INVALID_FIELDS', fields.message);
      }

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
        return sendBadRequest(reply, 'INVALID_FIELDS', fields.message);
      }

      if (!includes.ok) {
        return sendBadRequest(reply, 'INVALID_INCLUDE', includes.message);
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
        return sendBadRequest(reply, 'INVALID_FIELDS', fields.message);
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
        return sendBadRequest(reply, 'INVALID_FIELDS', fields.message);
      }

      if (!postalCodeStatuses.ok) {
        return sendBadRequest(reply, 'INVALID_POSTAL_CODE_STATUS', postalCodeStatuses.message);
      }

      if (neighborhoods === undefined) {
        return sendNotFound(reply, districtNotFound.code, districtNotFound.message);
      }

      const filtered = filterByPostalCodeStatus(neighborhoods, postalCodeStatuses.statuses);
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
        return sendBadRequest(reply, 'INVALID_FIELDS', fields.message);
      }

      if (!postalCodeStatuses.ok) {
        return sendBadRequest(reply, 'INVALID_POSTAL_CODE_STATUS', postalCodeStatuses.message);
      }

      if (villages === undefined) {
        return sendNotFound(reply, districtNotFound.code, districtNotFound.message);
      }

      const filtered = filterByPostalCodeStatus(villages, postalCodeStatuses.statuses);
      const pagination = normalizePagination(request.query);
      const items = paginate(filtered, pagination);

      return createListResponse(projectFieldsList(items, fields.fields), pagination, filtered.length);
    },
  );
};

export default districtRoutes;
