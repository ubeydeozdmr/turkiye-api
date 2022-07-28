const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.param('id', controller.checkID);

router.route('/').get(controller.getAllProvinces);
router.route('/:id').get(controller.getProvince);
// router.route("/:id/districts").get();
// router.route("/:id/districts/:district").get();

module.exports = router;
