const DB = require('./db.json');

exports.getAllProvinces = () => {
  try {
    return DB.provinces;
  } catch (error) {
    throw { status: 500, message: 'Internal Server Error' };
  }
};

exports.getProvince = query => {
  try {
    if (query) {
      if (isFinite(query)) {
        if (+query > DB.provinces.length) {
          throw { status: 404, message: 'Invalid province ID' };
        }
      } else {
        let state = false;
        DB.provinces.forEach(el => {
          if (el.name == query) {
            state = true;
          }
        });

        if (!state) {
          throw { status: 404, message: 'Invalid province name' };
        }
      }
    }
  } catch (error) {
    throw {
      status: error?.status || 500,
      message: error?.message || 'Internal Server Error',
    };
  }

  const id = +query;
  const name = query;

  let province;

  isFinite(query)
    ? (province = DB.provinces.find(el => el.id === id))
    : (province = DB.provinces.find(el => el.name === name));

  return province;
};

exports.getAllDistricts = provinceQuery => {
  try {
    if (provinceQuery) {
      if (isFinite(provinceQuery)) {
        if (+provinceQuery > DB.provinces.length) {
          throw { status: 404, message: 'Invalid province ID' };
        }
      } else {
        let state = false;
        DB.provinces.forEach(el => {
          if (el.name == provinceQuery) {
            state = true;
          }
        });

        if (!state) {
          throw { status: 404, message: 'Invalid province name' };
        }
      }
    }
  } catch (error) {
    throw {
      status: error?.status || 500,
      message: error?.message || 'Internal Server Error',
    };
  }

  const id = +provinceQuery;
  const name = provinceQuery;

  let province;

  isFinite(provinceQuery)
    ? (province = DB.provinces.find(el => el.id === id))
    : (province = DB.provinces.find(el => el.name === name));

  return province.districts;
};

exports.getDistrict = (provinceQuery, districtQuery) => {
  try {
    if (provinceQuery) {
      if (isFinite(provinceQuery)) {
        if (+provinceQuery > DB.provinces.length) {
          throw { status: 404, message: 'Invalid province ID' };
        }
      } else {
        let state = false;
        DB.provinces.forEach(el => {
          if (el.name == provinceQuery) {
            state = true;
          }
        });

        if (!state) {
          throw { status: 404, message: 'Invalid province name' };
        }
      }
    }
  } catch (error) {
    throw {
      status: error?.status || 500,
      message: error?.message || 'Internal Server Error',
    };
  }

  const id = +provinceQuery;
  const name = provinceQuery;

  let province;

  isFinite(provinceQuery)
    ? (province = DB.provinces.find(el => el.id === id))
    : (province = DB.provinces.find(el => el.name === name));

  let district = province.districts.find(el => el.name === districtQuery);
  if (!district) throw { status: 404, message: 'Invalid district name' };
  return district;
};
