import { type FastifyPluginAsync } from 'fastify';
import {
  VILLAGE_FIELDS,
  VILLAGE_INCLUDES,
  createDataResponse,
  createListResponse,
  hasInclude,
  parseFields,
  parseIncludes,
  projectFields,
  projectFieldsList,
  sendBadRequest,
  sendNotFound,
} from '../utils/index.js';
import { type VillageService } from '../services/index.js';
import {
  DataResponseSchema,
  ErrorResponseSchema,
  FieldQuerySchema,
  type FieldQuery,
  ListResponseSchema,
  type VillageListQuery,
  VillageListQuerySchema,
  type VillageParams,
  VillageParamsSchema,
  VillageSchema,
} from '../schemas/index.js';

interface VillageRouteOptions {
  readonly villageService: VillageService;
}

const villageNotFound = {
  code: 'VILLAGE_NOT_FOUND',
  message: 'Village not found.',
} as const;

const villageRoutes: FastifyPluginAsync<VillageRouteOptions> = async (fastify, options) => {
  const { villageService } = options;

  fastify.get<{ Querystring: VillageListQuery }>(
    '/',
    {
      schema: {
        querystring: VillageListQuerySchema,
        response: {
          200: ListResponseSchema(VillageSchema),
        },
      },
    },
    async (request, reply) => {
      const result = villageService.listVillages(request.query);
      const fields = parseFields(request.query.fields, VILLAGE_FIELDS);

      if (!fields.ok) {
        return sendBadRequest(reply, 'INVALID_FIELDS', fields.message);
      }

      return createListResponse(projectFieldsList(result.items, fields.fields), result.pagination, result.total);
    },
  );

  fastify.get<{ Params: VillageParams; Querystring: FieldQuery }>(
    '/:villageId',
    {
      schema: {
        params: VillageParamsSchema,
        querystring: FieldQuerySchema,
        response: {
          200: DataResponseSchema(VillageSchema),
          404: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const village = villageService.getVillageById(request.params.villageId);
      const fields = parseFields(request.query.fields, VILLAGE_FIELDS);
      const includes = parseIncludes(request.query.include, VILLAGE_INCLUDES);

      if (!fields.ok) {
        return sendBadRequest(reply, 'INVALID_FIELDS', fields.message);
      }

      if (!includes.ok) {
        return sendBadRequest(reply, 'INVALID_INCLUDE', includes.message);
      }

      if (village === undefined) {
        return sendNotFound(reply, villageNotFound.code, villageNotFound.message);
      }

      const data: Record<string, unknown> = { ...projectFields(village, fields.fields) };

      if (hasInclude(includes.includes, 'province')) {
        data['province'] = villageService.getProvinceByVillageId(village.id);
      }

      if (hasInclude(includes.includes, 'district')) {
        data['district'] = villageService.getDistrictByVillageId(village.id);
      }

      return createDataResponse(data);
    },
  );
};

export default villageRoutes;
