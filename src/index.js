const fs = require('fs');
const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const v1Router = require('./routesV1');
require('./helpers/localizer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8181;
const { NODE_ENV } = process.env;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  const images = fs.readdirSync(path.join(__dirname, 'public/assets'));
  res.render('index', {
    host: req.get('host'),
    protocol: req.get('x-forwarded-proto') ? 'https://' : 'http://',
    image: images[Math.floor(Math.random() * images.length)],
  });
});

app.get('/docs', (req, res) => {
  res.render('docs', {
    host: req.get('host'),
    protocol: req.get('x-forwarded-proto') ? 'https://' : 'http://',
  });
});

app.get('/examples', (req, res) => {
  res.render('examples', {
    host: req.get('host'),
    protocol: req.get('x-forwarded-proto') ? 'https://' : 'http://',
  });
});

app.use('/api/v1', v1Router);

app.all('*', (req, res, next) => {
  res.render('notfound');
});

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
  if (NODE_ENV === 'development') console.log(`http://localhost:${PORT}`);
});
