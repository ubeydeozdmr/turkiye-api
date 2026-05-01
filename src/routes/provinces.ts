import { type FastifyPluginAsync } from 'fastify';

import {
  DataResponseSchema,
  DistrictSchema,
  ErrorResponseSchema,
  FieldQuerySchema,
  type FieldQuery,
  ListResponseSchema,
  MunicipalitySchema,
  NeighborhoodSchema,
  PaginationFieldQuerySchema,
  ProvinceListQuerySchema,
  ProvinceParamsSchema,
  ProvinceSchema,
  VillageSchema,
  type PaginationFieldQuery,
  type ProvinceListQuery,
  type ProvinceParams,
} from '../schemas/index.js';
import { type ProvinceService } from '../services/index.js';
import {
  DISTRICT_FIELDS,
  MUNICIPALITY_FIELDS,
  NEIGHBORHOOD_FIELDS,
  PROVINCE_FIELDS,
  PROVINCE_INCLUDES,
  VILLAGE_FIELDS,
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

interface ProvinceRouteOptions {
  readonly provinceService: ProvinceService;
}

const provinceNotFound = {
  code: 'PROVINCE_NOT_FOUND',
  message: 'Province not found.',
} as const;

const provinceRoutes: FastifyPluginAsync<ProvinceRouteOptions> = async (fastify, options) => {
  const { provinceService } = options;

  fastify.get<{ Querystring: ProvinceListQuery }>(
    '/',
    {
      schema: {
        querystring: ProvinceListQuerySchema,
        response: {
          200: ListResponseSchema(ProvinceSchema),
        },
      },
    },
    async (request, reply) => {
      const result = provinceService.listProvinces(request.query);
      const fields = parseFields(request.query.fields, PROVINCE_FIELDS);

      if (!fields.ok) {
        return sendBadRequest(reply, 'INVALID_FIELDS', fields.message);
      }

      return createListResponse(projectFieldsList(result.items, fields.fields), result.pagination, result.total);
    },
  );

  fastify.get<{ Params: ProvinceParams; Querystring: FieldQuery }>(
    '/:provinceId',
    {
      schema: {
        params: ProvinceParamsSchema,
        querystring: FieldQuerySchema,
        response: {
          200: DataResponseSchema(ProvinceSchema),
          404: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const province = provinceService.getProvinceById(request.params.provinceId);
      const fields = parseFields(request.query.fields, PROVINCE_FIELDS);
      const includes = parseIncludes(request.query.include, PROVINCE_INCLUDES);

      if (!fields.ok) {
        return sendBadRequest(reply, 'INVALID_FIELDS', fields.message);
      }

      if (!includes.ok) {
        return sendBadRequest(reply, 'INVALID_INCLUDE', includes.message);
      }

      if (province === undefined) {
        return sendNotFound(reply, provinceNotFound.code, provinceNotFound.message);
      }

      const data: Record<string, unknown> = { ...projectFields(province, fields.fields) };

      if (hasInclude(includes.includes, 'districts')) {
        data['districts'] = provinceService.getDistrictsByProvinceId(province.id) ?? [];
      }

      if (hasInclude(includes.includes, 'municipalities')) {
        data['municipalities'] = provinceService.getMunicipalitiesByProvinceId(province.id) ?? [];
      }

      if (hasInclude(includes.includes, 'neighborhoods')) {
        data['neighborhoods'] = provinceService.getNeighborhoodsByProvinceId(province.id) ?? [];
      }

      if (hasInclude(includes.includes, 'villages')) {
        data['villages'] = provinceService.getVillagesByProvinceId(province.id) ?? [];
      }

      return createDataResponse(data);
    },
  );

  fastify.get<{ Params: ProvinceParams; Querystring: PaginationFieldQuery }>(
    '/:provinceId/districts',
    {
      schema: {
        params: ProvinceParamsSchema,
        querystring: PaginationFieldQuerySchema,
        response: {
          200: ListResponseSchema(DistrictSchema),
          404: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const districts = provinceService.getDistrictsByProvinceId(request.params.provinceId);
      const fields = parseFields(request.query.fields, DISTRICT_FIELDS);

      if (!fields.ok) {
        return sendBadRequest(reply, 'INVALID_FIELDS', fields.message);
      }

      if (districts === undefined) {
        return sendNotFound(reply, provinceNotFound.code, provinceNotFound.message);
      }

      const pagination = normalizePagination(request.query);
      const items = paginate(districts, pagination);

      return createListResponse(projectFieldsList(items, fields.fields), pagination, districts.length);
    },
  );

  fastify.get<{ Params: ProvinceParams; Querystring: PaginationFieldQuery }>(
    '/:provinceId/municipalities',
    {
      schema: {
        params: ProvinceParamsSchema,
        querystring: PaginationFieldQuerySchema,
        response: {
          200: ListResponseSchema(MunicipalitySchema),
          404: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const municipalities = provinceService.getMunicipalitiesByProvinceId(request.params.provinceId);
      const fields = parseFields(request.query.fields, MUNICIPALITY_FIELDS);

      if (!fields.ok) {
        return sendBadRequest(reply, 'INVALID_FIELDS', fields.message);
      }

      if (municipalities === undefined) {
        return sendNotFound(reply, provinceNotFound.code, provinceNotFound.message);
      }

      const pagination = normalizePagination(request.query);
      const items = paginate(municipalities, pagination);

      return createListResponse(projectFieldsList(items, fields.fields), pagination, municipalities.length);
    },
  );

  fastify.get<{ Params: ProvinceParams; Querystring: PaginationFieldQuery }>(
    '/:provinceId/neighborhoods',
    {
      schema: {
        params: ProvinceParamsSchema,
        querystring: PaginationFieldQuerySchema,
        response: {
          200: ListResponseSchema(NeighborhoodSchema),
          404: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const neighborhoods = provinceService.getNeighborhoodsByProvinceId(request.params.provinceId);
      const fields = parseFields(request.query.fields, NEIGHBORHOOD_FIELDS);

      if (!fields.ok) {
        return sendBadRequest(reply, 'INVALID_FIELDS', fields.message);
      }

      if (neighborhoods === undefined) {
        return sendNotFound(reply, provinceNotFound.code, provinceNotFound.message);
      }

      const pagination = normalizePagination(request.query);
      const items = paginate(neighborhoods, pagination);

      return createListResponse(projectFieldsList(items, fields.fields), pagination, neighborhoods.length);
    },
  );

  fastify.get<{ Params: ProvinceParams; Querystring: PaginationFieldQuery }>(
    '/:provinceId/villages',
    {
      schema: {
        params: ProvinceParamsSchema,
        querystring: PaginationFieldQuerySchema,
        response: {
          200: ListResponseSchema(VillageSchema),
          404: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const villages = provinceService.getVillagesByProvinceId(request.params.provinceId);
      const fields = parseFields(request.query.fields, VILLAGE_FIELDS);

      if (!fields.ok) {
        return sendBadRequest(reply, 'INVALID_FIELDS', fields.message);
      }

      if (villages === undefined) {
        return sendNotFound(reply, provinceNotFound.code, provinceNotFound.message);
      }

      const pagination = normalizePagination(request.query);
      const items = paginate(villages, pagination);

      return createListResponse(projectFieldsList(items, fields.fields), pagination, villages.length);
    },
  );
};

export default provinceRoutes;
