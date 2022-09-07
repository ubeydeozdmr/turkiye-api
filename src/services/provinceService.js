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
