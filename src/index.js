const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const v1ProvinceRouter = require('./v1/routes/provinceRoutes');
const { localizer } = require('./helpers/localizer');

const app = express();
const PORT = process.env.PORT || 8181;

app.set('view engine', 'pug');

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.render('index', { host: req.headers.host });
});
app.use('/api/v1/provinces', v1ProvinceRouter);

app.all('*', (req, res, next) => {
  res.render('notfound');
});

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
