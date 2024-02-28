const data = require('./villages.json');

exports.getVillages = function (
  name,
  minPopulation = 1,
  maxPopulation = 1000000000,
  offset = 0,
  limit,
  fields,
  sort,
) {
  try {
    let villages = data;

    if (!Object.values(arguments).some((item) => item)) {
      return villages.slice(+offset, +offset + 1000);
    }

    if (name) {
      nameAlt =
        name.charAt(0).toLocaleUpperCase('TR') +
        name.slice(1).toLocaleLowerCase('tr');
      villages = villages.filter(
        (item) => item.name.includes(name) || item.name.includes(nameAlt),
      );
    }

    if (minPopulation || maxPopulation) {
      if (+minPopulation <= 0 && +maxPopulation <= 0) {
        throw {
          status: 404,
          message:
            "You can't search for a neighborhood with a population of 0 or less.",
        };
      }

      if (+minPopulation > +maxPopulation) {
        throw {
          status: 404,
          message:
            'The minimum population cannot be greater than the maximum population.',
        };
      }

      villages = villages.filter((item) => {
        return (
          item.population >= minPopulation && item.population <= maxPopulation
        );
      });
    }

    if (sort) {
      const sortArray = sort.split(',').reverse();

      sortArray.forEach((item) => {
        if (item !== 'name' && item !== '-name') {
          if (item.startsWith('-')) {
            const field = item.slice(1);
            villages.sort((a, b) => (a[field] > b[field] ? -1 : 1));
          } else {
            villages.sort((a, b) => (a[item] > b[item] ? 1 : -1));
          }
        } else {
          if (item.startsWith('-')) {
            const field = item.slice(1);
            villages.sort((a, b) =>
              b[field].localeCompare(a[field], 'tr', { sensitivity: 'base' }),
            );
          } else {
            villages.sort((a, b) =>
              a[item].localeCompare(b[item], 'tr', { sensitivity: 'base' }),
            );
          }
        }
      });

      if (
        sortArray.some((item) => !Object.keys(data[0]).includes(item)) &&
        !sortArray.some(
          (item) => !Object.keys(data[0]).includes(item.startsWith('-')),
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
      const filteredVillages = [];

      villages.forEach((item) => {
        const filteredNeighborhood = {};
        fieldsArray.forEach((field) => {
          filteredNeighborhood[field] = item[field];
        });
        filteredVillages.push(filteredNeighborhood);
      });

      villages = filteredVillages;

      if (fieldsArray.some((item) => !Object.keys(data[0]).includes(item))) {
        throw {
          status: 404,
          message:
            'Invalid fields. The fields parameter must be a comma-separated list of valid fields.',
        };
      }
    }

    if (!limit) {
      limit = 1000;
    }

    if (limit > 1000) {
      throw {
        status: 404,
        message: 'The limit value must be less than or equal to 1000.',
      };
    }
    villages = villages.slice(+offset, +offset + +limit);

    if (+offset >= data.length && +limit == 0) {
      throw {
        status: 404,
        message:
          'Invalid offset and limit. The limit value must be greater than 0. The offset value must be less than ' +
          data.length,
      };
    } else if (+offset >= data.length) {
      throw {
        status: 404,
        message:
          'Invalid offset. The offset value must be less than ' + data.length,
      };
    } else if (+limit == 0) {
      throw {
        status: 404,
        message: 'Invalid limit. The limit value must be greater than 0.',
      };
    }

    if (villages.length > 0) {
      return villages;
    } else {
      throw {
        status: 404,
        message: 'No neighborhood found.',
      };
    }
  } catch (error) {
    throw {
      status: error?.status || 500,
      message: error?.message || 'Internal Server Error',
    };
  }
};

exports.getExactVillage = function (id, fields) {
  try {
    if (!isFinite(id)) {
      throw {
        status: 404,
        message: 'Invalid village ID. The id parameter must be a number.',
      };
    }

    const village = data.find((item) => item.id === +id);

    if (fields) {
      const fieldsArray = fields.split(',');
      const filteredVillage = {};

      fieldsArray.forEach((field) => {
        filteredVillage[field] = village[field];
      });

      if (fieldsArray.some((item) => !Object.keys(data[0]).includes(item))) {
        throw {
          status: 404,
          message:
            'Invalid fields. The fields parameter must be a comma-separated list of valid fields.',
        };
      }
      return filteredVillage;
    } else {
      if (village) {
        return village;
      } else {
        throw {
          status: 404,
          message: 'No village found.',
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
