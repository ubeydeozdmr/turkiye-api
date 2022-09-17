const fs = require('fs');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const v1ProvinceRouter = require('./v1/routes/provinceRoutes');
const { localizer } = require('./helpers/localizer');

const app = express();
const PORT = process.env.PORT || 8181;

app.set('view engine', 'pug');
app.use(express.static('assets'));
app.use(express.static('favicon'));

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.render('index', {
    host: req.headers.host,
    protocol: process.env.NODE_ENV == 'production' ? 'https://' : '',
    image:
      fs.readdirSync('assets')[
        Math.floor(Math.random() * fs.readdirSync('assets').length)
      ],
  });
});
app.use('/api/v1/provinces', v1ProvinceRouter);

app.all('*', (req, res, next) => {
  res.render('notfound');
});

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
