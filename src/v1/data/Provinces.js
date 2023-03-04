const DB = require('./data.json');

exports.getProvinces = function (
  name,
  minPopulation = 1,
  maxPopulation = 1000000000,
  isMetropolitan,
  offset = 0,
  limit = 81,
  fields,
  sort,
) {
  try {
    if (Object.values(arguments).some((item) => item)) {
      let provinces = DB.provinces;

      if (arguments[0]) {
        nameAlt =
          name.charAt(0).toUpperCaseLocalized() +
          name.slice(1).toLowerCaseLocalized();
        provinces = provinces.filter(
          (item) => item.name.includes(name) || item.name.includes(nameAlt),
        );
      }

      if (arguments[1] || arguments[2]) {
        if (+arguments[1] <= 0 && +arguments[2] <= 0) {
          throw {
            status: 404,
            message:
              "You can't search for a province with a population of 0 or less.",
          };
        }

        if (+arguments[1] > +arguments[2]) {
          throw {
            status: 404,
            message:
              'The minimum population cannot be greater than the maximum population.',
          };
        }

        provinces = provinces.filter((item) => {
          return (
            item.population >= minPopulation && item.population <= maxPopulation
          );
        });
      }

      if (arguments[3]) {
        if (isMetropolitan === 'true') {
          provinces = provinces.filter((item) => item.isMetropolitan === true);
        } else if (isMetropolitan === 'false') {
          provinces = provinces.filter((item) => item.isMetropolitan === false);
        } else {
          throw {
            status: 404,
            message:
              'The isMetropolitan parameter must be either true or false.',
          };
        }
      }

      if (arguments[7]) {
        const sortArray = sort.split(',').reverse();
        const sortedProvinces = [];

        sortArray.forEach((item) => {
          if (item !== 'name' && item !== '-name') {
            if (item.startsWith('-')) {
              const field = item.slice(1);
              provinces.sort((a, b) => (a[field] > b[field] ? -1 : 1));
            } else {
              provinces.sort((a, b) => (a[item] > b[item] ? 1 : -1));
            }
          } else {
            if (item.startsWith('-')) {
              const field = item.slice(1);
              provinces.sort((a, b) =>
                b[field].localeCompare(a[field], 'tr', { sensitivity: 'base' }),
              );
            } else {
              provinces.sort((a, b) =>
                a[item].localeCompare(b[item], 'tr', { sensitivity: 'base' }),
              );
            }
          }
        });

        provinces.forEach((item) => {
          sortedProvinces.push(item);
        });

        provinces = sortedProvinces;

        if (
          sortArray.some(
            (item) => !Object.keys(DB.provinces[0]).includes(item),
          ) &&
          !sortArray.some(
            (item) =>
              !Object.keys(DB.provinces[0]).includes(item.startsWith('-')),
          )
        ) {
          throw {
            status: 404,
            message:
              'Invalid sort. The sort parameter must be a comma-separated list of valid fields.',
          };
        }
      }

      if (arguments[6]) {
        const fieldsArray = fields.split(',');
        const filteredProvinces = [];

        provinces.forEach((item) => {
          const filteredProvince = {};
          fieldsArray.forEach((field) => {
            filteredProvince[field] = item[field];
          });
          filteredProvinces.push(filteredProvince);
        });

        provinces = filteredProvinces;

        if (
          fieldsArray.some(
            (item) => !Object.keys(DB.provinces[0]).includes(item),
          )
        ) {
          throw {
            status: 404,
            message:
              'Invalid fields. The fields parameter must be a comma-separated list of valid fields.',
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
              'Invalid offset. The offset value must be less than ' +
              DB.provinces.length,
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
        throw {
          status: 404,
          message: 'No province found.',
        };
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

exports.getExactProvince = function (id, fields) {
  try {
    if (!isFinite(id)) {
      throw {
        status: 404,
        message: 'Invalid province ID. The id parameter must be a number.',
      };
    }

    if (fields) {
      const fieldsArray = fields.split(',');
      const filteredProvince = {};

      fieldsArray.forEach((field) => {
        filteredProvince[field] = DB.provinces[id - 1][field];
      });

      if (
        fieldsArray.some((item) => !Object.keys(DB.provinces[0]).includes(item))
      ) {
        throw {
          status: 404,
          message:
            'Invalid fields. The fields parameter must be a comma-separated list of valid fields.',
        };
      }
      return filteredProvince;
    } else {
      if (DB.provinces[id - 1]) {
        return DB.provinces[id - 1];
      } else {
        throw {
          status: 404,
          message: 'No province found.',
        };
      }
    }
  } catch (error) {
    throw {
      status: error?.status || 500,
      message: error?.message || 'Internal Server Error',
    };
  }
};
