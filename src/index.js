const fs = require('fs');
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
app.use(express.static('assets'));
app.use(express.static('public'));
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index', {
    host: req.headers.host,
    protocol: NODE_ENV == 'production' ? 'https://' : 'http://',
    image:
      fs.readdirSync('assets')[
        Math.floor(Math.random() * fs.readdirSync('assets').length)
      ],
  });
});

app.get('/docs', (req, res) => {
  res.render('docs', {
    host: req.headers.host,
    protocol: NODE_ENV == 'production' ? 'https://' : 'http://',
  });
});

app.get('/examples', (req, res) => {
  res.render('examples', {
    host: req.headers.host,
    protocol: NODE_ENV == 'production' ? 'https://' : 'http://',
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
