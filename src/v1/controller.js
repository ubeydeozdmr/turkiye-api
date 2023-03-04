const Provinces = require('./data/Provinces');
const Districts = require('./data/Districts');

exports.getProvinces = (req, res) => {
  try {
    const { name } = req.query;
    const { minPopulation } = req.query;
    const { maxPopulation } = req.query;
    const { isMetropolitan } = req.query;
    const { offset } = req.query;
    const { limit } = req.query;
    const { fields } = req.query;
    const { sort } = req.query;

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
    res
      .status(error?.status || 500)
      .send({
        status: 'ERROR',
        error: error?.message || 'Internal Server Error',
      });
  }
};

exports.getExactProvince = (req, res) => {
  try {
    const { id } = req.params;
    const { fields } = req.query;
    const province = Provinces.getExactProvince(id, fields);
    return res.send({ status: 'OK', data: province });
  } catch (error) {
    res.status(error?.status || 500).send({
      status: 'ERROR',
      error: error?.message || 'Internal Server Error',
      devError: error?.devMessage || '-',
    });
  }
};

exports.getDistricts = (req, res) => {
  try {
    const { name } = req.query;
    const { minPopulation } = req.query;
    const { maxPopulation } = req.query;
    const { offset } = req.query;
    const { limit } = req.query;
    const { fields } = req.query;
    const { sort } = req.query;

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
    res
      .status(error?.status || 500)
      .send({
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
      devError: error?.devMessage || '-',
    });
  }
};
