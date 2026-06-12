import type { FastifyPluginAsync } from 'fastify';

import {
  DataResponseSchema,
  ErrorResponseSchema,
  FieldQuerySchema,
  ListResponseSchema,
  NeighborhoodListQuerySchema,
  NeighborhoodParamsSchema,
  NeighborhoodSchema,
} from '../schemas/index.js';
import {
  NEIGHBORHOOD_FIELDS,
  NEIGHBORHOOD_INCLUDES,
  NEIGHBORHOOD_POSTAL_CODE_STATUSES,
  createDataResponse,
  createListResponse,
  hasInclude,
  parseFields,
  parseIncludes,
  parsePostalCodeStatuses,
  projectFields,
  projectFieldsList,
  sendBadRequest,
  sendNotFound,
  validateRangeFilters,
} from '../utils/index.js';
import type {
  FieldQuery,
  NeighborhoodListQuery,
  NeighborhoodParams,
} from '../schemas/index.js';
import type { NeighborhoodService } from '../services/index.js';

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

      const ranges = validateRangeFilters(request.query, ['population']);
      const hierarchy = neighborhoodService.validateListQueryHierarchy(request.query);

      if (!ranges.ok) {
        return sendBadRequest(reply, ranges.code, ranges.message);
      }

      if (!hierarchy.ok) {
        return sendBadRequest(reply, hierarchy.code, hierarchy.message);
      }

      const result = neighborhoodService.listNeighborhoods(request.query, postalCodeStatuses.statuses);

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
        return sendBadRequest(reply, fields.code, fields.message);
      }

      if (!includes.ok) {
        return sendBadRequest(reply, includes.code, includes.message);
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
