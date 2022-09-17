const Provinces = require('../database/Provinces');

exports.getAllProvinces = () => {
  try {
    const allProvinces = Provinces.getAllProvinces();
    return allProvinces;
  } catch (error) {
    throw error;
  }
};

exports.getProvince = query => {
  try {
    const province = Provinces.getProvince(query);
    return province;
  } catch (error) {
    throw error;
  }
};

exports.getAllDistricts = provinceQuery => {
  try {
    const allDistricts = Provinces.getAllDistricts(provinceQuery);
    return allDistricts;
  } catch (error) {
    throw error;
  }
};

exports.getDistrict = (provinceQuery, districtQuery) => {
  try {
    const district = Provinces.getDistrict(provinceQuery, districtQuery);
    return district;
  } catch (error) {
    throw error;
  }
};
