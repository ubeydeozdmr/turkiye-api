import { randomUUID } from 'node:crypto';
import type { IncomingHttpHeaders, IncomingMessage } from 'node:http';
import type { FastifyInstance, FastifyReply, FastifyRequest, FastifyServerOptions } from 'fastify';

export const REQUEST_ID_HEADER = 'x-request-id';

const DEFAULT_SERVICE_NAME = 'turkiye-api-v2';
const PRODUCTION_LOG_LEVEL = 'info';
const DEVELOPMENT_LOG_LEVEL = 'debug';
const VALID_LOG_LEVELS = new Set(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']);
const API_VERSION = 'v2';

type LoggerOptions = NonNullable<FastifyServerOptions['logger']>;

interface ApiServerLoggingOptions {
  readonly env?: NodeJS.ProcessEnv;
}

interface ApiRequestLoggingOptions {
  readonly env?: NodeJS.ProcessEnv;
}

type ServerLoggingOptions = Pick<
  FastifyServerOptions,
  'disableRequestLogging' | 'genReqId' | 'logger' | 'requestIdHeader' | 'trustProxy'
>;

export type RequestCacheStatus = 'bypass' | 'hit' | 'miss';

export interface RequestRateLimitStatus {
  readonly limited: boolean;
  readonly limit?: number;
  readonly remaining?: number;
  readonly resetSeconds?: number;
}

export interface ReplyErrorLogData {
  readonly code: string;
  readonly message: string;
  readonly status: number;
}

const requestStartTimes = new WeakMap<FastifyRequest, bigint>();
const requestCacheStatuses = new WeakMap<FastifyRequest, RequestCacheStatus>();
const requestRateLimitStatuses = new WeakMap<FastifyRequest, RequestRateLimitStatus>();
const replyErrorData = new WeakMap<FastifyReply, ReplyErrorLogData>();

function parseBoolean(value: string | undefined): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (['1', 'true', 'yes', 'on'].includes(normalizedValue)) {
    return true;
  }

  if (['0', 'false', 'no', 'off'].includes(normalizedValue)) {
    return false;
  }

  return undefined;
}

function getLogLevel(env: NodeJS.ProcessEnv, nodeEnv: string): string {
  const configuredLevel = env['LOG_LEVEL']?.trim().toLowerCase();

  if (configuredLevel !== undefined && VALID_LOG_LEVELS.has(configuredLevel)) {
    return configuredLevel;
  }

  return nodeEnv === 'production' ? PRODUCTION_LOG_LEVEL : DEVELOPMENT_LOG_LEVEL;
}

function getHeaderValue(headers: IncomingHttpHeaders, headerName: string): string | undefined {
  const header = headers[headerName];

  if (Array.isArray(header)) {
    return header.find((value) => value.trim().length > 0)?.trim();
  }

  if (typeof header === 'string' && header.trim().length > 0) {
    return header.trim();
  }

  return undefined;
}

function isHealthcheckRequest(request: FastifyRequest): boolean {
  const path = getRequestPath(request);

  return path === '/health';
}

function getRequestPath(request: FastifyRequest): string {
  try {
    return new URL(request.url, 'http://localhost').pathname;
  } catch {
    const [path = request.url] = request.url.split('?');

    return path;
  }
}

function getQueryKeys(request: FastifyRequest): readonly string[] {
  let searchParams: URLSearchParams;

  try {
    searchParams = new URL(request.url, 'http://localhost').searchParams;
  } catch {
    return [];
  }

  return Array.from(new Set(searchParams.keys())).sort();
}

function getRequestRoute(request: FastifyRequest, path: string): string {
  return request.routeOptions.url ?? path;
}

function getRequestVersion(path: string): string {
  return path === `/${API_VERSION}` || path.startsWith(`/${API_VERSION}/`) ? API_VERSION : 'system';
}

function getResponseTimeMs(request: FastifyRequest): number {
  const start = requestStartTimes.get(request);

  if (start === undefined) {
    return 0;
  }

  return Math.round(Number(process.hrtime.bigint() - start) / 1_000_000);
}

function getRequestLogLevel(statusCode: number): 'error' | 'info' | 'warn' {
  if (statusCode >= 500) {
    return 'error';
  }

  if (statusCode >= 400) {
    return 'warn';
  }

  return 'info';
}

export function setRequestCacheStatus(request: FastifyRequest, status: RequestCacheStatus): void {
  requestCacheStatuses.set(request, status);
}

export function setRequestRateLimitStatus(request: FastifyRequest, status: RequestRateLimitStatus): void {
  requestRateLimitStatuses.set(request, status);
}

export function setReplyErrorLogData(reply: FastifyReply, data: ReplyErrorLogData): void {
  replyErrorData.set(reply, data);
}

export function getRequestId(request: IncomingMessage): string {
  return getHeaderValue(request.headers, REQUEST_ID_HEADER) ?? randomUUID();
}

export function createLoggerOptions(env: NodeJS.ProcessEnv = process.env): LoggerOptions {
  const nodeEnv = env['NODE_ENV'] ?? 'development';

  return {
    level: getLogLevel(env, nodeEnv),
    base: {
      environment: nodeEnv,
      service: env['SERVICE_NAME'] ?? DEFAULT_SERVICE_NAME,
    },
    messageKey: 'message',
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
    redact: {
      paths: [
        'headers.authorization',
        'headers.cookie',
        'headers["x-api-key"]',
        'req.headers.authorization',
        'req.headers.cookie',
        'req.headers["x-api-key"]',
      ],
      remove: true,
    },
  };
}

export function createServerLoggingOptions(options: ApiServerLoggingOptions = {}): ServerLoggingOptions {
  const env = options.env ?? process.env;
  const nodeEnv = env['NODE_ENV'] ?? 'development';
  const logEnabled = parseBoolean(env['LOG_ENABLED']) ?? true;

  return {
    disableRequestLogging: true,
    genReqId: getRequestId,
    logger: logEnabled ? createLoggerOptions(env) : false,
    requestIdHeader: REQUEST_ID_HEADER,
    trustProxy: parseBoolean(env['TRUST_PROXY']) ?? nodeEnv === 'production',
  };
}

export function registerSemanticRequestLogging(app: FastifyInstance, options: ApiRequestLoggingOptions = {}): void {
  const env = options.env ?? process.env;
  const logHealthchecks = parseBoolean(env['LOG_HEALTHCHECKS']) ?? false;

  app.addHook('onRequest', async (request, reply) => {
    requestStartTimes.set(request, process.hrtime.bigint());
    reply.header(REQUEST_ID_HEADER, request.id);
  });

  app.addHook('onResponse', async (request, reply) => {
    if (!logHealthchecks && isHealthcheckRequest(request)) {
      return;
    }

    const path = getRequestPath(request);
    const statusCode = reply.statusCode;
    const errorData = replyErrorData.get(reply);
    const logPayload: Record<string, unknown> = {
      requestId: request.id,
      version: getRequestVersion(path),
      method: request.method,
      path,
      route: getRequestRoute(request, path),
      queryKeys: getQueryKeys(request),
      statusCode,
      responseTimeMs: getResponseTimeMs(request),
      cacheStatus: requestCacheStatuses.get(request) ?? 'bypass',
    };

    const rateLimit = requestRateLimitStatuses.get(request);

    if (rateLimit !== undefined) {
      logPayload['rateLimit'] = rateLimit;
    }

    if (errorData !== undefined) {
      logPayload['errorCode'] = errorData.code;
      logPayload['errorMessage'] = errorData.message;
    }

    request.log[getRequestLogLevel(statusCode)](logPayload, 'request completed');
  });
}
