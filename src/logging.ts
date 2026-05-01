import { randomUUID } from 'node:crypto';
import { type IncomingHttpHeaders, type IncomingMessage } from 'node:http';
import { type FastifyRequest, type FastifyServerOptions } from 'fastify';

export const REQUEST_ID_HEADER = 'x-request-id';

const DEFAULT_SERVICE_NAME = 'turkiye-api-v2';
const PRODUCTION_LOG_LEVEL = 'info';
const DEVELOPMENT_LOG_LEVEL = 'debug';
const VALID_LOG_LEVELS = new Set(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']);

type LoggerOptions = NonNullable<FastifyServerOptions['logger']>;

interface ApiServerLoggingOptions {
  readonly env?: NodeJS.ProcessEnv;
}

type ServerLoggingOptions = Pick<
  FastifyServerOptions,
  'disableRequestLogging' | 'genReqId' | 'logger' | 'requestIdHeader' | 'trustProxy'
>;

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
  const [path = ''] = request.url.split('?');

  return path === '/health';
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
  const logEnabled = parseBoolean(env['LOG_ENABLED']) ?? true;
  const logHealthchecks = parseBoolean(env['LOG_HEALTHCHECKS']) ?? false;

  return {
    disableRequestLogging: logHealthchecks ? false : isHealthcheckRequest,
    genReqId: getRequestId,
    logger: logEnabled ? createLoggerOptions(env) : false,
    requestIdHeader: REQUEST_ID_HEADER,
    trustProxy: parseBoolean(env['TRUST_PROXY']) ?? false,
  };
}
