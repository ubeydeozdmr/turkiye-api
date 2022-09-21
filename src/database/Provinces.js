const DB = require('./db.json');

exports.getProvinces = function (
  name,
  minPopulation = 1,
  maxPopulation = 1000000000,
  isMetropolitan,
  offset = 0,
  limit = 81
) {
  try {
    console.log(arguments);
    if (Object.values(arguments).some(item => item)) {
      let provinces = DB.provinces;

      if (arguments[0]) {
        nameAlt =
          name.charAt(0).toUpperCaseLocalized() + name.slice(1).toLowerCaseLocalized();
        provinces = provinces.filter(
          item => item.name.includes(name) || item.name.includes(nameAlt)
        );
      }

      if (arguments[1] || arguments[2]) {
        if (arguments[1] <= 0 && arguments[2] <= 0) {
          throw {
            status: 404,
            message: "You can't search for a province with a population of 0 or less.",
          };
        }

        if (arguments[1] > arguments[2]) {
          throw {
            status: 404,
            message:
              'The minimum population cannot be greater than the maximum population.',
          };
        }

        provinces = provinces.filter(item => {
          return item.population >= minPopulation && item.population <= maxPopulation;
        });
      }

      if (arguments[3]) {
        if (isMetropolitan === 'true') {
          provinces = provinces.filter(item => item.isMetropolitan === true);
        } else if (isMetropolitan === 'false') {
          provinces = provinces.filter(item => item.isMetropolitan === false);
        } else {
          throw {
            status: 404,
            message: 'The isMetropolitan parameter must be either true or false.',
          };
        }
      }

      if (arguments[4] || arguments[5]) {
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
        message: 'Invalid province ID. The id parameter must be a number.',
        devMessage: `The ability to search by province name has been removed for this route. Try using /api/v1/provinces?name=${id} instead.`,
      };
    }

    const province = DB.provinces.find(item => item.id == id);
    if (province) {
      return [DB.provinces.find(item => item.id == id)];
    } else {
      throw {
        status: 404,
        message: 'Invalid province ID. The ID you enter must be 0 to 81.',
        devMessage: '-',
      };
    }
  } catch (error) {
    throw {
      status: error?.status || 500,
      message: error?.message || 'Internal Server Error',
      devMessage: error?.devMessage || '-',
    };
  }
};
