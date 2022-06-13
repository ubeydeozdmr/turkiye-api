const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.param('query', controller.checkQuery);

router.route('/').get(controller.getAllProvinces);
router.route('/:query').get(controller.getProvince);

module.exports = router;
