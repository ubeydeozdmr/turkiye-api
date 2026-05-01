import crypto from 'node:crypto';

import { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';

const DYNAMIC_API_CACHE_CONTROL = 'public, max-age=300';

function createEtag(payload: string | Buffer): string {
  const hash = crypto.createHash('sha256').update(payload).digest('hex');

  return `"${hash}"`;
}

function clientHasFreshResponse(request: FastifyRequest, etag: string): boolean {
  const ifNoneMatch = request.headers['if-none-match'];

  if (typeof ifNoneMatch !== 'string') {
    return false;
  }

  return ifNoneMatch
    .split(',')
    .map((candidate) => candidate.trim())
    .includes(etag);
}

function shouldCacheDynamicResponse(
  request: FastifyRequest,
  reply: FastifyReply,
  payload: unknown,
): payload is string | Buffer {
  return (
    request.method === 'GET' &&
    request.url.startsWith('/v2/') &&
    !request.url.startsWith('/v2/datasets/') &&
    reply.statusCode === 200 &&
    (typeof payload === 'string' || Buffer.isBuffer(payload))
  );
}

export function registerDynamicCache(app: FastifyInstance): void {
  app.addHook('onSend', async (request, reply, payload) => {
    if (!shouldCacheDynamicResponse(request, reply, payload)) {
      return payload;
    }

    const etag = createEtag(payload);

    reply.header('Cache-Control', DYNAMIC_API_CACHE_CONTROL).header('ETag', etag);

    if (clientHasFreshResponse(request, etag)) {
      reply.removeHeader('Content-Length');
      reply.status(304);
      return '';
    }

    return payload;
  });
}
