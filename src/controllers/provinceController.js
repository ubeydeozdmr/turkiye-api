const provinceService = require('../services/provinceService');

exports.getAllProvinces = (req, res) => {
  try {
    const provinces = provinceService.getAllProvinces();
    res.send({ status: 'OK', data: provinces });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: 'ERROR', error: error?.message || 'Internal Server Error' });
  }
};

exports.getProvince = (req, res) => {
  try {
    const { query } = req.params;
    const province = provinceService.getProvince(query);
    res.send({ status: 'OK', data: province });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: 'ERROR', error: error?.message || 'Internal Server Error' });
  }
};
