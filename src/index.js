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

const { PORT, NODE_ENV } = process.env;

app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 150,
  message: 'Too many requests from this IP, please try again in 15 minutes!',
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('combined'));
app.use(cache('2 minutes'));
app.use(limiter);

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

app.use('/api/v1', require('./v1/routes'));

app.all('*', (req, res, next) => {
  res.render('notfound');
});

app.listen(PORT || 8181, () => {
  console.log(`API is listening on port ${PORT}`);
  if (NODE_ENV === 'development') console.log(`http://localhost:${PORT}`);
});
