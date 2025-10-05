const data = require('./neighborhoods.min.json');

exports.getNeighborhoods = function (
  name,
  minPopulation = 1,
  maxPopulation = 1000000000,
  provinceId,
  province,
  districtId,
  district,
  offset = 0,
  limit,
  fields,
  sort,
) {
  try {
    let neighborhoods = data;

    if (!Object.values(arguments).some((item) => item)) {
      return neighborhoods.slice(+offset, +offset + 1000);
    }

    if (name) {
      nameAlt =
        name.charAt(0).toLocaleUpperCase('TR') +
        name.slice(1).toLocaleLowerCase('tr');
      neighborhoods = neighborhoods.filter(
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

      neighborhoods = neighborhoods.filter((item) => {
        return (
          item.population >= minPopulation && item.population <= maxPopulation
        );
      });
    }

    if (provinceId || province) {
      if (provinceId && province) {
        throw {
          status: 404,
          message:
            'You can only use one of the provinceId or province parameters.',
        };
      }

      if (provinceId) {
        if (!isFinite(provinceId)) {
          throw {
            status: 404,
            message:
              'Invalid province ID. The provinceId parameter must be a number.',
          };
        }

        neighborhoods = neighborhoods.filter(
          (item) => item.provinceId === +provinceId,
        );
      }

      if (province) {
        const provinceAlt =
          province.charAt(0).toLocaleUpperCase('TR') +
          province.slice(1).toLocaleLowerCase('tr');

        neighborhoods = neighborhoods.filter(
          (item) =>
            item.province.includes(province) ||
            item.province.includes(provinceAlt),
        );
      }
    }

    if (districtId || district) {
      if (districtId && district) {
        throw {
          status: 404,
          message:
            'You can only use one of the districtId or district parameters.',
        };
      }

      if (districtId) {
        if (!isFinite(districtId)) {
          throw {
            status: 404,
            message:
              'Invalid district ID. The districtId parameter must be a number.',
          };
        }

        neighborhoods = neighborhoods.filter(
          (item) => item.districtId === +districtId,
        );
      }

      if (district) {
        const districtAlt =
          district.charAt(0).toLocaleUpperCase('TR') +
          district.slice(1).toLocaleLowerCase('tr');

        neighborhoods = neighborhoods.filter(
          (item) =>
            item.district.includes(district) ||
            item.district.includes(districtAlt),
        );
      }
    }

    if (sort) {
      const sortArray = sort.split(',').reverse();

      sortArray.forEach((item) => {
        if (item !== 'name' && item !== '-name') {
          if (item.startsWith('-')) {
            const field = item.slice(1);
            neighborhoods.sort((a, b) => (a[field] > b[field] ? -1 : 1));
          } else {
            neighborhoods.sort((a, b) => (a[item] > b[item] ? 1 : -1));
          }
        } else {
          if (item.startsWith('-')) {
            const field = item.slice(1);
            neighborhoods.sort((a, b) =>
              b[field].localeCompare(a[field], 'tr', { sensitivity: 'base' }),
            );
          } else {
            neighborhoods.sort((a, b) =>
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
      const filteredNeighborhoods = [];

      neighborhoods.forEach((item) => {
        const filteredNeighborhood = {};
        fieldsArray.forEach((field) => {
          filteredNeighborhood[field] = item[field];
        });
        filteredNeighborhoods.push(filteredNeighborhood);
      });

      neighborhoods = filteredNeighborhoods;

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
    neighborhoods = neighborhoods.slice(+offset, +offset + +limit);

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

    if (neighborhoods.length > 0) {
      return neighborhoods;
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

exports.getExactNeighborhood = function (id, fields) {
  try {
    if (!isFinite(id)) {
      throw {
        status: 404,
        message: 'Invalid neighborhood ID. The id parameter must be a number.',
      };
    }

    const neighborhood = data.find((item) => item.id === +id);

    if (fields) {
      const fieldsArray = fields.split(',');
      const filteredNeighborhood = {};

      fieldsArray.forEach((field) => {
        filteredNeighborhood[field] = neighborhood[field];
      });

      if (fieldsArray.some((item) => !Object.keys(data[0]).includes(item))) {
        throw {
          status: 404,
          message:
            'Invalid fields. The fields parameter must be a comma-separated list of valid fields.',
        };
      }
      return filteredNeighborhood;
    } else {
      if (neighborhood) {
        return neighborhood;
      } else {
        throw {
          status: 404,
          message: 'No neighborhood found.',
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
