const fs = require('fs');
const path = require('path');
const cors = require('cors');
const express = require('express');
require('dotenv').config();

const app = express();
const { PORT, NODE_ENV } = process.env;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  const images = fs.readdirSync(path.join(__dirname, 'public', 'assets'));
  res.render('index', {
    image: images[Math.floor(Math.random() * images.length)],
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
