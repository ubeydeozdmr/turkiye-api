const Provinces = require('./data/Provinces');
const Districts = require('./data/Districts');
const Neighborhoods = require('./data/Neighborhoods');
const Villages = require('./data/Villages');

exports.getProvinces = (req, res) => {
  try {
    const {
      name,
      minPopulation,
      maxPopulation,
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
    const { fields, extend } = req.query;

    const province = Provinces.getExactProvince(id, fields, extend);

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
    const { name, minPopulation, maxPopulation, offset, limit, fields, sort } =
      req.query;

    const districts = Districts.getDistricts(
      name,
      minPopulation,
      maxPopulation,
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
    const { fields } = req.query;

    const district = Districts.getExactDistrict(id, fields);

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
    const { name, minPopulation, maxPopulation, offset, limit, fields, sort } =
      req.query;

    const neighborhood = Neighborhoods.getNeighborhoods(
      name,
      minPopulation,
      maxPopulation,
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
    const { name, minPopulation, maxPopulation, offset, limit, fields, sort } =
      req.query;

    const village = Villages.getVillages(
      name,
      minPopulation,
      maxPopulation,
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
