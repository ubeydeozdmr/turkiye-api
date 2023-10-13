const getDB = require('../../utils/getDB.js');

exports.getProvinces = function (
  name,
  minPopulation = 1,
  maxPopulation = 1000000000,
  isMetropolitan,
  offset = 0,
  limit = 81,
  fields,
  sort,
  dev,
) {
  try {
    if (Object.values(arguments).some((item) => item)) {
      let provinces = getDB(dev).provinces;

      if (name) {
        nameAlt =
          name.charAt(0).toLocaleUpperCase('TR') +
          name.slice(1).toLocaleLowerCase('tr');
        provinces = provinces.filter(
          (item) => item.name.includes(name) || item.name.includes(nameAlt),
        );
      }

      if (minPopulation || maxPopulation) {
        if (+minPopulation <= 0 && +maxPopulation <= 0) {
          throw {
            status: 404,
            message:
              "You can't search for a province with a population of 0 or less.",
          };
        }

        if (+minPopulation > +maxPopulation) {
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

      if (isMetropolitan) {
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

      if (sort) {
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
            (item) => !Object.keys(getDB(dev).provinces[0]).includes(item),
          ) &&
          !sortArray.some(
            (item) =>
              !Object.keys(getDB(dev).provinces[0]).includes(
                item.startsWith('-'),
              ),
          )
        ) {
          throw {
            status: 404,
            message:
              'Invalid sort. The sort parameter must be a comma-separated list of valid fields.',
          };
        }
      }

      if (fields) {
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
            (item) => !Object.keys(getDB(dev).provinces[0]).includes(item),
          )
        ) {
          throw {
            status: 404,
            message:
              'Invalid fields. The fields parameter must be a comma-separated list of valid fields.',
          };
        }
      }

      if (offset || limit) {
        provinces = provinces.slice(+offset, +offset + +limit);

        if (+offset >= getDB(dev).provinces.length && +limit == 0) {
          throw {
            status: 404,
            message:
              'Invalid offset and limit. The limit value must be greater than 0. The offset value must be less than ' +
              getDB(dev).provinces.length,
          };
        } else if (+offset >= getDB(dev).provinces.length) {
          throw {
            status: 404,
            message:
              'Invalid offset. The offset value must be less than ' +
              getDB(dev).provinces.length,
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
      return getDB(dev).provinces;
    }
  } catch (error) {
    throw {
      status: error?.status || 500,
      message: error?.message || 'Internal Server Error',
    };
  }
};

exports.getExactProvince = function (id, fields, dev) {
  try {
    if (!isFinite(id)) {
      throw {
        status: 404,
        message: 'Invalid province ID. The id parameter must be a number.',
      };
    }

    const province = getDB(dev).provinces[id - 1];

    if (fields) {
      const fieldsArray = fields.split(',');
      const filteredProvince = {};

      fieldsArray.forEach((field) => {
        filteredProvince[field] = province[field];
      });

      if (
        fieldsArray.some(
          (item) => !Object.keys(getDB(dev).provinces[0]).includes(item),
        )
      ) {
        throw {
          status: 404,
          message:
            'Invalid fields. The fields parameter must be a comma-separated list of valid fields.',
        };
      }
      return filteredProvince;
    } else {
      if (province) {
        return province;
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
