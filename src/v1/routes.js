const express = require('express');
const controller = require('./controller');

const router = express.Router();

router
  .get('/provinces', controller.getProvinces)
  .get('/provinces/:id', controller.getExactProvince)
  .get('/districts', controller.getDistricts)
  .get('/districts/:id', controller.getExactDistrict)
  .get('*', (req, res) => {
    res.status(404).json({
      status: 'ERROR',
      error: 'Wrong endpoint.',
    });
  })
  .all('*', (req, res) => {
    res.status(405).json({
      status: 'ERROR',
      error: 'Method not allowed.',
    });
  });

module.exports = router;
