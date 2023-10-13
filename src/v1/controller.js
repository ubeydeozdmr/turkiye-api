const Provinces = require('./data/Provinces');
const Districts = require('./data/Districts');

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
      dev,
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
      dev,
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
    const { fields, dev } = req.query;

    const province = Provinces.getExactProvince(id, fields, dev);

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
      offset,
      limit,
      fields,
      sort,
      dev,
    } = req.query;

    const districts = Districts.getDistricts(
      name,
      minPopulation,
      maxPopulation,
      offset,
      limit,
      fields,
      sort,
      dev,
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
    const { fields, dev } = req.query;

    const district = Districts.getExactDistrict(id, fields, dev);

    return res.send({ status: 'OK', data: district });
  } catch (error) {
    res.status(error?.status || 500).send({
      status: 'ERROR',
      error: error?.message || 'Internal Server Error',
    });
  }
};
