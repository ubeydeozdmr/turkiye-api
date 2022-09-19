const DB = require('./db.json');

exports.getProvinces = function (name, offset = 0, limit = 81) {
  try {
    console.log(arguments);
    if (Object.values(arguments).some(item => item)) {
      // const provinces = [];
      let provinces = DB.provinces;

      // if (arguments[0]) {
      //   nameAlt =
      //     name.charAt(0).toUpperCaseLocalized() + name.slice(1).toLowerCaseLocalized();
      //   provinces.push(
      //     ...DB.provinces.filter(
      //       item => item.name.includes(name) || item.name.includes(nameAlt)
      //     )
      //   );
      // }

      if (arguments[0]) {
        nameAlt =
          name.charAt(0).toUpperCaseLocalized() + name.slice(1).toLowerCaseLocalized();
        provinces = provinces.filter(
          item => item.name.includes(name) || item.name.includes(nameAlt)
        );
      }

      if (arguments[1] || arguments[2]) {
        provinces = provinces.slice(+offset, +offset + +limit);

        if (+offset >= DB.provinces.length && +limit == 0) {
          throw {
            status: 404,
            message:
              'Invalid offset and limit. The limit value must be greater than 0. The offset value must be less than ' +
              DB.provinces.length,
          };
        } else if (+offset >= DB.provinces.length) {
          throw {
            status: 404,
            message:
              'Invalid offset. The offset value must be less than ' + DB.provinces.length,
          };
        } else if (+limit == 0) {
          throw {
            status: 404,
            message: 'Invalid limit. The limit value must be greater than 0.',
          };
        }
      }

      if (provinces.length > 0) {
        return provinces;
      } else {
        throw { status: 404, message: 'Invalid province name' };
      }
    } else {
      return DB.provinces;
    }
  } catch (error) {
    throw {
      status: error?.status || 500,
      message: error?.message || 'Internal Server Error',
    };
  }
};

exports.getExactProvince = function (id) {
  try {
    if (!isFinite(id)) {
      throw {
        status: 404,
        message: `The ability to search by province name has been removed for this route. Try using /api/v1/provinces?name=${id} instead.`,
      };
    }

    const province = DB.provinces.find(item => item.id == id);
    if (province) {
      return [DB.provinces.find(item => item.id == id)];
    } else {
      throw { status: 404, message: 'Invalid province ID' };
    }
  } catch (error) {
    throw {
      status: error?.status || 500,
      message: error?.message || 'Internal Server Error',
    };
  }
};
