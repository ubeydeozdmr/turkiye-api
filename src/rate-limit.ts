import rateLimit from '@fastify/rate-limit';
import { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';

import { createErrorResponse } from './utils/index.js';

export interface ApiRateLimitPolicy {
  readonly max: number;
  readonly timeWindow: number | string;
}

export interface ApiRateLimitOptions {
  readonly policies?: readonly ApiRateLimitPolicy[];
  readonly identityHeader?: string;
}

const DEFAULT_RATE_LIMIT_POLICIES: readonly ApiRateLimitPolicy[] = [
  { max: 300, timeWindow: '1 minute' },
  { max: 1000, timeWindow: '5 minutes' },
];

const DEFAULT_IDENTITY_HEADER = 'x-api-key';

function getHeaderValue(request: FastifyRequest, headerName: string): string | undefined {
  const header = request.headers[headerName.toLowerCase()];

  if (Array.isArray(header)) {
    return header.find((value) => value.trim().length > 0)?.trim();
  }

  if (typeof header === 'string' && header.trim().length > 0) {
    return header.trim();
  }

  return undefined;
}

function getRateLimitIdentity(request: FastifyRequest, identityHeader: string): string {
  const configuredIdentity = getHeaderValue(request, identityHeader);

  if (configuredIdentity !== undefined) {
    return `${identityHeader}:${configuredIdentity}`;
  }

  const authorization = getHeaderValue(request, 'authorization');

  if (authorization !== undefined) {
    return `authorization:${authorization}`;
  }

  return `ip:${request.ip}`;
}

type RateLimitChecker = ReturnType<FastifyInstance['createRateLimit']>;
type RateLimitResult = Awaited<ReturnType<RateLimitChecker>>;
type LimitedRateLimitResult = Extract<RateLimitResult, { isAllowed: false }>;

function sendRateLimitResponse(reply: FastifyReply, limit: LimitedRateLimitResult): FastifyReply {
  reply.header('x-ratelimit-limit', limit.max);
  reply.header('x-ratelimit-remaining', 0);
  reply.header('x-ratelimit-reset', limit.ttlInSeconds);
  reply.header('retry-after', limit.ttlInSeconds);

  return reply.status(429).send(
    createErrorResponse({
      code: 'RATE_LIMIT_EXCEEDED',
      message: `Rate limit exceeded. Try again in ${limit.ttlInSeconds} seconds.`,
      status: 429,
    }),
  );
}

function setRemainingRateLimitHeaders(reply: FastifyReply, limit: LimitedRateLimitResult): void {
  reply.header('x-ratelimit-limit', limit.max);
  reply.header('x-ratelimit-remaining', limit.remaining);
  reply.header('x-ratelimit-reset', limit.ttlInSeconds);
}

function isLimitedResult(result: RateLimitResult): result is LimitedRateLimitResult {
  return result.isAllowed === false;
}

export async function registerRateLimit(app: FastifyInstance, options: ApiRateLimitOptions = {}): Promise<void> {
  const policies = options.policies ?? DEFAULT_RATE_LIMIT_POLICIES;
  const identityHeader = options.identityHeader ?? DEFAULT_IDENTITY_HEADER;

  await app.register(rateLimit, {
    global: false,
    keyGenerator: (request) => getRateLimitIdentity(request, identityHeader),
  });

  const limiters = policies.map((policy) => app.createRateLimit(policy));

  app.addHook('onRequest', async (request, reply) => {
    let primaryLimit: LimitedRateLimitResult | undefined;

    for (const limiter of limiters) {
      const result = await limiter(request);

      if (!isLimitedResult(result)) {
        continue;
      }

      if (result.isExceeded) {
        return sendRateLimitResponse(reply, result);
      }

      primaryLimit ??= result;
    }

    if (primaryLimit !== undefined) {
      setRemainingRateLimitHeaders(reply, primaryLimit);
    }
  });
}
