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
      query.replace('İ', 'I').toLowerCase();

      if (isFinite(query)) {
        if (+query > DB.provinces.length) {
          throw { status: 404, message: 'Invalid province ID' };
        }
      } else {
        let state = false;
        DB.provinces.forEach(el => {
          if (el.name.toLowerCase() == query) {
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
    : (province = DB.provinces.find(el => el.name.toLowerCase() === name));

  return province;
};
