const express = require('express');
const provinceController = require('../../controllers/provinceController');

const router = express.Router();

router.get('/', provinceController.getAllProvinces);
router.get('/:provinceQuery', provinceController.getProvince);
router.get('/:provinceQuery/districts', provinceController.getAllDistricts);
router.get('/:provinceQuery/districts/:districtQuery', provinceController.getDistrict);

module.exports = router;
