import { type FastifyPluginAsync } from 'fastify';
import { type NeighborhoodService } from '../services/index.js';
import {
  DataResponseSchema,
  ErrorResponseSchema,
  FieldQuerySchema,
  type FieldQuery,
  ListResponseSchema,
  type NeighborhoodListQuery,
  NeighborhoodListQuerySchema,
  type NeighborhoodParams,
  NeighborhoodParamsSchema,
  NeighborhoodSchema,
} from '../schemas/index.js';
import {
  NEIGHBORHOOD_FIELDS,
  NEIGHBORHOOD_INCLUDES,
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

interface NeighborhoodRouteOptions {
  readonly neighborhoodService: NeighborhoodService;
}

const neighborhoodNotFound = {
  code: 'NEIGHBORHOOD_NOT_FOUND',
  message: 'Neighborhood not found.',
} as const;

const neighborhoodRoutes: FastifyPluginAsync<NeighborhoodRouteOptions> = async (fastify, options) => {
  const { neighborhoodService } = options;

  fastify.get<{ Querystring: NeighborhoodListQuery }>(
    '/',
    {
      schema: {
        querystring: NeighborhoodListQuerySchema,
        response: {
          200: ListResponseSchema(NeighborhoodSchema),
        },
      },
    },
    async (request, reply) => {
      const result = neighborhoodService.listNeighborhoods(request.query);
      const fields = parseFields(request.query.fields, NEIGHBORHOOD_FIELDS);

      if (!fields.ok) {
        return sendBadRequest(reply, 'INVALID_FIELDS', fields.message);
      }

      return createListResponse(projectFieldsList(result.items, fields.fields), result.pagination, result.total);
    },
  );

  fastify.get<{ Params: NeighborhoodParams; Querystring: FieldQuery }>(
    '/:neighborhoodId',
    {
      schema: {
        params: NeighborhoodParamsSchema,
        querystring: FieldQuerySchema,
        response: {
          200: DataResponseSchema(NeighborhoodSchema),
          404: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const neighborhood = neighborhoodService.getNeighborhoodById(request.params.neighborhoodId);
      const fields = parseFields(request.query.fields, NEIGHBORHOOD_FIELDS);
      const includes = parseIncludes(request.query.include, NEIGHBORHOOD_INCLUDES);

      if (!fields.ok) {
        return sendBadRequest(reply, 'INVALID_FIELDS', fields.message);
      }

      if (!includes.ok) {
        return sendBadRequest(reply, 'INVALID_INCLUDE', includes.message);
      }

      if (neighborhood === undefined) {
        return sendNotFound(reply, neighborhoodNotFound.code, neighborhoodNotFound.message);
      }

      const data: Record<string, unknown> = { ...projectFields(neighborhood, fields.fields) };

      if (hasInclude(includes.includes, 'province')) {
        data['province'] = neighborhoodService.getProvinceByNeighborhoodId(neighborhood.id);
      }

      if (hasInclude(includes.includes, 'district')) {
        data['district'] = neighborhoodService.getDistrictByNeighborhoodId(neighborhood.id);
      }

      if (hasInclude(includes.includes, 'municipality')) {
        data['municipality'] = neighborhoodService.getMunicipalityByNeighborhoodId(neighborhood.id);
      }

      return createDataResponse(data);
    },
  );
};

export default neighborhoodRoutes;
