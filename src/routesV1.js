const express = require('express');
const controller = require('./controller');

const router = express.Router();

router
  .get('/provinces', controller.getProvinces)
  .get('/provinces/:id', controller.getExactProvince);
// .get('/districts', controller.getDistricts);

module.exports = router;
