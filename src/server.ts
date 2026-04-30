import build from './app.js';
import { createServerLoggingOptions } from './logging.js';

const app = build(createServerLoggingOptions());

const port = Number(process.env['PORT'] ?? 3000);
const host = process.env['HOST'] ?? '0.0.0.0';

try {
  const address = await app.listen({ port, host });
  app.log.info({ address, host, port }, 'server started');
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
