const DB = require('./db.json');

exports.getDistricts = function (
  name,
  minPopulation = 1,
  maxPopulation = 1000000000,
  offset = 0,
  limit = 976
) {
  try {
    console.log(arguments);
    let districts = [];
    DB.provinces.forEach(province => {
      province.districts.forEach(item => {
        item.province = province.name;
      });
      districts = districts.concat(province.districts);
    });
    let initialDistricts = [...districts];

    if (Object.values(arguments).some(item => item)) {
      if (arguments[0]) {
        nameAlt =
          name.charAt(0).toUpperCaseLocalized() + name.slice(1).toLowerCaseLocalized();
        districts = districts.filter(
          item => item.name.includes(name) || item.name.includes(nameAlt)
        );
      }

      if (arguments[1] || arguments[2]) {
        if (arguments[1] <= 0 && arguments[2] <= 0) {
          throw {
            status: 404,
            message: "You can't search for a district with a population of 0 or less.",
          };
        }

        if (arguments[1] > arguments[2]) {
          throw {
            status: 404,
            message:
              'The minimum population cannot be greater than the maximum population.',
          };
        }

        districts = districts.filter(item => {
          return item.population >= minPopulation && item.population <= maxPopulation;
        });
      }

      if (arguments[3] || arguments[4]) {
        districts = districts.slice(+offset, +offset + +limit);

        if (+offset >= initialDistricts.length && +limit == 0) {
          throw {
            status: 404,
            message:
              'Invalid offset and limit. The limit value must be greater than 0. The offset value must be less than ' +
              initialDistricts.length,
          };
        } else if (+offset >= initialDistricts.length) {
          throw {
            status: 404,
            message:
              'Invalid offset. The offset value must be less than ' +
              initialDistricts.length,
          };
        } else if (+limit == 0) {
          throw {
            status: 404,
            message: 'Invalid limit. The limit value must be greater than 0.',
          };
        }
      }
    }

    if (districts.length > 0) {
      return districts;
    } else {
      throw {
        status: 404,
        message: 'No districts found.',
      };
    }
  } catch (error) {
    throw {
      status: error?.status || 500,
      message: error?.message || 'Internal Server Error',
    };
  }
};
