const express = require('express');
const provinceController = require('../../controllers/provinceController');

const router = express.Router();

router.get('/', provinceController.getAllProvinces);
router.get('/:query', provinceController.getProvince);

module.exports = router;
