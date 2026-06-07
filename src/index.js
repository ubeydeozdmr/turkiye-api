const fs = require('fs');
const path = require('path');
const cors = require('cors');
const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const morgan = require('morgan');
const apicache = require('apicache');
const { rateLimit } = require('express-rate-limit');
require('dotenv').config();

const app = express();
const cache = apicache.middleware;
const routes = require('./routes');

const { PORT, NODE_ENV, INSTANT_LIMIT, LIMIT } = process.env;

app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);

const instantLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: Number(INSTANT_LIMIT) || 60,
  standardHeaders: 'draft-8',
  identifier: 'v1-minute',
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again in a minute!',
});

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: Number(LIMIT) || 200,
  standardHeaders: 'draft-8',
  identifier: 'v1-5-minute',
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again in 5 minutes!',
});

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('combined'));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: NODE_ENV || 'development',
  });
});

app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.get('/', (req, res) => {
  const images = fs.readdirSync(path.join(__dirname, 'public', 'assets'));
  const language = req.acceptsLanguages('tr', 'tr-TR') ? 'tr' : 'en';
  res.render('index', {
    image: images[Math.floor(Math.random() * images.length)],
    language,
  });
});

app.get('/docs', (req, res) => {
  res.render('docs');
});

app.get('/examples', (req, res) => {
  res.render('examples');
});

app.use('/v1', instantLimiter, limiter, cache('30 minutes'), routes);
app.use('/api/v1', instantLimiter, limiter, cache('30 minutes'), routes); // Deprecated: Backward compatibility for /api/v1

app.all('*', (req, res, next) => {
  res.render('notfound');
});

const port = Number(PORT) || 8181;

app.listen(port, '0.0.0.0', () => {
  console.log(`API is listening on port ${port}`);
  if (NODE_ENV === 'development') console.log(`http://localhost:${port}`);
});
