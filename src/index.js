const fs = require('fs');
const path = require('path');
const cors = require('cors');
const express = require('express');
const v1Router = require('./routesV1');
require('./helpers/localizer');
require('dotenv').config();

const app = express();
const { NODE_ENV, PORT } = process.env;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.locals = {
    host: req.get('host'),
    protocol: req.get('x-forwarded-proto') ? 'https://' : 'http://',
  };
  next();
});

app.get('/', (req, res) => {
  const images = fs.readdirSync(path.join(__dirname, 'public', 'assets'));
  res.locals.image = images[Math.floor(Math.random() * images.length)];
  res.render('index', res.locals);
});

app.get('/docs', (req, res) => {
  res.render('docs', res.locals);
});

app.get('/examples', (req, res) => {
  res.render('examples', res.locals);
});

app.use('/api/v1', v1Router);

app.all('*', (req, res, next) => {
  res.render('notfound');
});

app.listen(PORT || 8181, () => {
  console.log(`API is listening on port ${PORT}`);
  if (NODE_ENV === 'development') console.log(`http://localhost:${PORT}`);
});
