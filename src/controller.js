const Provinces = require('./data/Provinces');
const Districts = require('./data/Districts');
const Neighborhoods = require('./data/Neighborhoods');
const Villages = require('./data/Villages');
const Towns = require('./data/Towns');

exports.getProvinces = (req, res) => {
  try {
    const {
      name,
      minPopulation,
      maxPopulation,
      minArea,
      maxArea,
      minAltitude,
      maxAltitude,
      activatePostalCodes,
      postalCode,
      isCoastal,
      isMetropolitan,
      offset,
      limit,
      fields,
      sort,
    } = req.query;

    const provinces = Provinces.getProvinces(
      name,
      minPopulation,
      maxPopulation,
      minArea,
      maxArea,
      minAltitude,
      maxAltitude,
      activatePostalCodes,
      postalCode,
      isCoastal,
      isMetropolitan,
      offset,
      limit,
      fields,
      sort,
    );

    return res.send({ status: 'OK', data: provinces });
  } catch (error) {
    res.status(error?.status || 500).send({
      status: 'ERROR',
      error: error?.message || 'Internal Server Error',
    });
  }
};

exports.getExactProvince = (req, res) => {
  try {
    const { id } = req.params;
    const { fields, extend, activatePostalCodes } = req.query;

    const province = Provinces.getExactProvince(
      id,
      fields,
      extend,
      activatePostalCodes,
    );

    return res.send({ status: 'OK', data: province });
  } catch (error) {
    res.status(error?.status || 500).send({
      status: 'ERROR',
      error: error?.message || 'Internal Server Error',
    });
  }
};

exports.getDistricts = (req, res) => {
  try {
    const {
      name,
      minPopulation,
      maxPopulation,
      minArea,
      maxArea,
      activatePostalCodes,
      postalCode,
      provinceId,
      province,
      offset,
      limit,
      fields,
      sort,
    } = req.query;

    const districts = Districts.getDistricts(
      name,
      minPopulation,
      maxPopulation,
      minArea,
      maxArea,
      activatePostalCodes,
      postalCode,
      provinceId,
      province,
      offset,
      limit,
      fields,
      sort,
    );

    return res.send({ status: 'OK', data: districts });
  } catch (error) {
    res.status(error?.status || 500).send({
      status: 'ERROR',
      error: error?.message || 'Internal Server Error',
    });
  }
};

exports.getExactDistrict = (req, res) => {
  try {
    const { id } = req.params;
    const { fields, activatePostalCodes } = req.query;

    const district = Districts.getExactDistrict(
      id,
      fields,
      activatePostalCodes,
    );

    return res.send({ status: 'OK', data: district });
  } catch (error) {
    res.status(error?.status || 500).send({
      status: 'ERROR',
      error: error?.message || 'Internal Server Error',
    });
  }
};

exports.getNeighborhoods = (req, res) => {
  try {
    const {
      name,
      minPopulation,
      maxPopulation,
      provinceId,
      province,
      districtId,
      district,
      offset,
      limit,
      fields,
      sort,
    } = req.query;

    const neighborhood = Neighborhoods.getNeighborhoods(
      name,
      minPopulation,
      maxPopulation,
      provinceId,
      province,
      districtId,
      district,
      offset,
      limit,
      fields,
      sort,
    );

    return res.send({ status: 'OK', data: neighborhood });
  } catch (error) {
    res.status(error?.status || 500).send({
      status: 'ERROR',
      error: error?.message || 'Internal Server Error',
    });
  }
};

exports.getExactNeighborhood = (req, res) => {
  try {
    const { id } = req.params;
    const { fields } = req.query;

    const neighborhood = Neighborhoods.getExactNeighborhood(id, fields);

    return res.send({ status: 'OK', data: neighborhood });
  } catch (error) {
    res.status(error?.status || 500).send({
      status: 'ERROR',
      error: error?.message || 'Internal Server Error',
    });
  }
};

exports.getVillages = (req, res) => {
  try {
    const {
      name,
      minPopulation,
      maxPopulation,
      provinceId,
      province,
      districtId,
      district,
      offset,
      limit,
      fields,
      sort,
    } = req.query;

    const village = Villages.getVillages(
      name,
      minPopulation,
      maxPopulation,
      provinceId,
      province,
      districtId,
      district,
      offset,
      limit,
      fields,
      sort,
    );

    return res.send({ status: 'OK', data: village });
  } catch (error) {
    res.status(error?.status || 500).send({
      status: 'ERROR',
      error: error?.message || 'Internal Server Error',
    });
  }
};

exports.getExactVillage = (req, res) => {
  try {
    const { id } = req.params;
    const { fields } = req.query;

    const village = Villages.getExactVillage(id, fields);

    return res.send({ status: 'OK', data: village });
  } catch (error) {
    res.status(error?.status || 500).send({
      status: 'ERROR',
      error: error?.message || 'Internal Server Error',
    });
  }
};

exports.getTowns = (req, res) => {
  try {
    const {
      name,
      minPopulation,
      maxPopulation,
      provinceId,
      province,
      districtId,
      district,
      offset,
      limit,
      fields,
      sort,
    } = req.query;

    const town = Towns.getTowns(
      name,
      minPopulation,
      maxPopulation,
      provinceId,
      province,
      districtId,
      district,
      offset,
      limit,
      fields,
      sort,
    );

    return res.send({ status: 'OK', data: town });
  } catch (error) {
    res.status(error?.status || 500).send({
      status: 'ERROR',
      error: error?.message || 'Internal Server Error',
    });
  }
};

exports.getExactTown = (req, res) => {
  try {
    const { id } = req.params;
    const { fields } = req.query;

    const town = Towns.getExactTown(id, fields);

    return res.send({ status: 'OK', data: town });
  } catch (error) {
    res.status(error?.status || 500).send({
      status: 'ERROR',
      error: error?.message || 'Internal Server Error',
    });
  }
};
