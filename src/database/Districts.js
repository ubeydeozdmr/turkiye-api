const DB = require('./db.json');

exports.getDistricts = function (
  name,
  minPopulation = 1,
  maxPopulation = 1000000000,
  offset = 0,
  limit = 976,
  fields,
  sort
) {
  try {
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

      if (arguments[6]) {
        const sortArray = sort.split(',').reverse();
        const sortedDistricts = [];

        sortArray.forEach(item => {
          if (
            item !== 'name' &&
            item !== '-name' &&
            item !== 'province' &&
            item !== '-province'
          ) {
            if (item.startsWith('-')) {
              const field = item.slice(1);
              districts.sort((a, b) => (a[field] > b[field] ? -1 : 1));
            } else {
              districts.sort((a, b) => (a[item] > b[item] ? 1 : -1));
            }
          } else {
            if (item.startsWith('-')) {
              const field = item.slice(1);
              districts.sort((a, b) =>
                b[field].localeCompare(a[field], 'tr', { sensitivity: 'base' })
              );
            } else {
              districts.sort((a, b) =>
                a[item].localeCompare(b[item], 'tr', { sensitivity: 'base' })
              );
            }
          }
        });

        districts.forEach(item => {
          sortedDistricts.push(item);
        });

        districts = sortedDistricts;

        if (
          sortArray.some(item => !Object.keys(districts[0]).includes(item)) &&
          !sortArray.some(
            item => !Object.keys(districts[0]).includes(item.startsWith('-'))
          )
        ) {
          throw {
            status: 404,
            message:
              'Invalid sort. The sort parameter must be a comma-separated list of valid fields.',
          };
        }
      }

      if (arguments[5]) {
        const fieldsArray = fields.split(',');
        const filteredDistricts = [];

        districts.forEach(item => {
          const filteredProvince = {};
          fieldsArray.forEach(field => {
            filteredProvince[field] = item[field];
          });
          filteredDistricts.push(filteredProvince);
        });

        districts = filteredDistricts;

        if (fieldsArray.some(item => !Object.keys(districts[0]).includes(item))) {
          throw {
            status: 404,
            message:
              'Invalid fields. The fields parameter must be a comma-separated list of valid fields.',
          };
        }
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

exports.getExactDistrict = function (id, fields) {
  try {
    let districts = [];
    DB.provinces.forEach(province => {
      province.districts.forEach(item => {
        item.province = province.name;
      });
      districts = districts.concat(province.districts);
    });

    let fieldsArrayCopy;

    if (arguments[1]) {
      const fieldsArray = fields.split(',');
      fieldsArrayCopy = [...fieldsArray];

      // BUG: The program cannot find the exact district when the user does not add "id" to the fields query. So I added a workaround.
      if (fieldsArray.every(item => item !== 'id')) fieldsArray.push('id');
      // BUG: The program cannot find the exact district when the user does not add "id" to the fields query. So I added a workaround.

      const filteredDistricts = [];

      districts.forEach(item => {
        const filteredProvince = {};
        fieldsArray.forEach(field => {
          filteredProvince[field] = item[field];
        });
        filteredDistricts.push(filteredProvince);
      });

      districts = filteredDistricts;

      if (fieldsArray.some(item => !Object.keys(districts[0]).includes(item))) {
        throw {
          status: 404,
          message:
            'Invalid fields. The fields parameter must be a comma-separated list of valid fields.',
        };
      }
    }

    const district = districts.find(item => item.id === +id);
    if (!fieldsArrayCopy.includes('id')) district.id = undefined; // a temporary solution to the BUG I mentioned above.

    if (district) {
      return district;
    } else {
      throw {
        status: 404,
        message: 'No district found.',
      };
    }
  } catch (error) {
    throw {
      status: error?.status || 500,
      message: error?.message || 'Internal Server Error',
    };
  }
};
