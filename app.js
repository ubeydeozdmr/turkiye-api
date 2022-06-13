const express = require('express');
const morgan = require('morgan');
const router = require('./router');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.set('view engine', 'pug');

app.get('/', function (req, res) {
  res.render('template', { host: req.headers.host });
});

app.use('/api/v1/provinces', router);

app.all('*', (req, res, next) => {
  res.send(`<h1>Can't find url you entered on this server</h1>`);
});

module.exports = app;
