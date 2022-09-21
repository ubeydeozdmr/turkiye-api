const Provinces = require('./database/Provinces');
const Districts = require('./database/Districts');

exports.getProvinces = (req, res) => {
  try {
    const { name } = req.query;
    const { minPopulation } = req.query;
    const { maxPopulation } = req.query;
    const { isMetropolitan } = req.query;
    const { offset } = req.query;
    const { limit } = req.query;

    const provinces = Provinces.getProvinces(
      name,
      minPopulation,
      maxPopulation,
      isMetropolitan,
      offset,
      limit
    );
    return res.send({ status: 'OK', data: provinces });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: 'ERROR', error: error?.message || 'Internal Server Error' });
  }
};

exports.getExactProvince = (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const province = Provinces.getExactProvince(id);
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

    const districts = Districts.getDistricts(
      name,
      minPopulation,
      maxPopulation,
      offset,
      limit
    );
    return res.send({ status: 'OK', data: districts });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: 'ERROR', error: error?.message || 'Internal Server Error' });
  }
};
