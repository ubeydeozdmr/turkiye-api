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
    const { provinceQuery } = req.params;
    let transformedQuery = provinceQuery.trim();

    transformedQuery =
      transformedQuery.charAt(0).toUpperCaseLocalized() +
      transformedQuery.slice(1).toLowerCaseLocalized();

    const province = provinceService.getProvince(transformedQuery);
    res.send({ status: 'OK', data: province });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: 'ERROR', error: error?.message || 'Internal Server Error' });
  }
};

exports.getAllDistricts = (req, res) => {
  try {
    const { provinceQuery } = req.params;
    let transformedQuery = provinceQuery.trim();

    transformedQuery =
      transformedQuery.charAt(0).toUpperCaseLocalized() +
      transformedQuery.slice(1).toLowerCaseLocalized();

    const province = provinceService.getAllDistricts(transformedQuery);
    res.send({ status: 'OK', data: province });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: 'ERROR', error: error?.message || 'Internal Server Error' });
  }
};

exports.getDistrict = (req, res) => {
  try {
    const { provinceQuery, districtQuery } = req.params;
    let transformedQuery1 = provinceQuery.trim();
    let transformedQuery2 = districtQuery.trim();

    transformedQuery1 =
      transformedQuery1.charAt(0).toUpperCaseLocalized() +
      transformedQuery1.slice(1).toLowerCaseLocalized();

    transformedQuery2 =
      transformedQuery2.charAt(0).toUpperCaseLocalized() +
      transformedQuery2.slice(1).toLowerCaseLocalized();

    const province = provinceService.getDistrict(transformedQuery1, transformedQuery2);
    res.send({ status: 'OK', data: province });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: 'ERROR', error: error?.message || 'Internal Server Error' });
  }
};
