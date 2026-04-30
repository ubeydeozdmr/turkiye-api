import { type FastifyInstance, type FastifyReply } from 'fastify';
import { type ErrorResponse } from '../schemas/index.js';

export interface ApiErrorOptions {
  readonly code: string;
  readonly message: string;
  readonly status: number;
}

export function createErrorResponse(options: ApiErrorOptions): ErrorResponse {
  return {
    error: {
      code: options.code,
      message: options.message,
      status: options.status,
    },
  };
}

export function sendError(reply: FastifyReply, options: ApiErrorOptions): FastifyReply {
  return reply.status(options.status).send(createErrorResponse(options));
}

export function sendBadRequest(reply: FastifyReply, code: string, message: string): FastifyReply {
  return sendError(reply, { code, message, status: 400 });
}

export function sendNotFound(reply: FastifyReply, code: string, message: string): FastifyReply {
  return sendError(reply, { code, message, status: 404 });
}

export function sendNotImplemented(reply: FastifyReply): FastifyReply {
  return sendError(reply, {
    code: 'NOT_IMPLEMENTED',
    message: 'This endpoint is not implemented yet.',
    status: 501,
  });
}

interface ErrorLike {
  readonly code?: string;
  readonly message?: string;
  readonly status?: number;
  readonly statusCode?: number;
}

function asErrorLike(error: unknown): ErrorLike {
  if (typeof error === 'object' && error !== null) {
    return error as ErrorLike;
  }

  return {};
}

function getErrorStatus(error: unknown): number {
  const errorLike = asErrorLike(error);

  if (typeof errorLike.statusCode === 'number' && errorLike.statusCode >= 400 && errorLike.statusCode <= 599) {
    return errorLike.statusCode;
  }

  if (typeof errorLike.status === 'number' && errorLike.status >= 400 && errorLike.status <= 599) {
    return errorLike.status;
  }

  return 500;
}

function getErrorCode(error: unknown, status: number): string {
  const errorLike = asErrorLike(error);

  if (status === 400) {
    return 'BAD_REQUEST';
  }

  if (status === 404) {
    return 'NOT_FOUND';
  }

  if (status === 500) {
    return 'INTERNAL_SERVER_ERROR';
  }

  return errorLike.code ?? 'HTTP_ERROR';
}

function getErrorMessage(error: unknown, status: number): string {
  const errorLike = asErrorLike(error);

  if (status === 500) {
    return 'Internal server error.';
  }

  return errorLike.message ?? 'Request failed.';
}

export function registerErrorHandlers(app: FastifyInstance): void {
  app.setErrorHandler((error, request, reply) => {
    const status = getErrorStatus(error);

    if (status >= 500) {
      request.log.error(error);
    } else {
      request.log.warn(error);
    }

    return reply.status(status).send(
      createErrorResponse({
        code: getErrorCode(error, status),
        message: getErrorMessage(error, status),
        status,
      }),
    );
  });

  app.setNotFoundHandler((request, reply) => {
    return reply.status(404).send(
      createErrorResponse({
        code: 'ROUTE_NOT_FOUND',
        message: 'Route not found.',
        status: 404,
      }),
    );
  });
}
