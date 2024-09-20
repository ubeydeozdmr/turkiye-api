const data = require('./districts.min.json');
const neighborhoods = require('./neighborhoods.min.json');
const villages = require('./villages.min.json');

exports.getDistricts = function (
  name,
  minPopulation = 1,
  maxPopulation = 1000000000,
  minArea = 1,
  maxArea = 1000000000,
  provinceId,
  province,
  offset = 0,
  limit = 973,
  fields,
  sort,
) {
  try {
    let districts = data;

    if (!Object.values(arguments).some((item) => item)) {
      return districts;
    }

    if (name) {
      nameAlt =
        name.charAt(0).toLocaleUpperCase('TR') +
        name.slice(1).toLocaleLowerCase('tr');
      districts = districts.filter(
        (item) => item.name.includes(name) || item.name.includes(nameAlt),
      );
    }

    if (minPopulation || maxPopulation) {
      if (+minPopulation <= 0 && +maxPopulation <= 0) {
        throw {
          status: 404,
          message:
            "You can't search for a district with a population of 0 or less.",
        };
      }

      if (+minPopulation > +maxPopulation) {
        throw {
          status: 404,
          message:
            'The minimum population cannot be greater than the maximum population.',
        };
      }

      districts = districts.filter((item) => {
        return (
          item.population >= minPopulation && item.population <= maxPopulation
        );
      });
    }

    if (minArea || maxArea) {
      if (+minArea <= 0 && +maxArea <= 0) {
        throw {
          status: 404,
          message: "You can't search for a district with an area of 0 or less.",
        };
      }

      if (+minArea > +maxArea) {
        throw {
          status: 404,
          message: 'The minimum area cannot be greater than the maximum area.',
        };
      }

      districts = districts.filter((item) => {
        return item.area >= minArea && item.area <= maxArea;
      });
    }

    if (provinceId || province) {
      console.log(provinceId, province);
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

        districts = districts.filter((item) => item.provinceId === +provinceId);
      }

      if (province) {
        const provinceAlt =
          province.charAt(0).toLocaleUpperCase('TR') +
          province.slice(1).toLocaleLowerCase('tr');

        districts = districts.filter(
          (item) =>
            item.province.includes(province) ||
            item.province.includes(provinceAlt),
        );
      }
    }

    if (sort) {
      const sortArray = sort.split(',').reverse();

      sortArray.forEach((item) => {
        if (item !== 'name' && item !== '-name') {
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
              b[field].localeCompare(a[field], 'tr', { sensitivity: 'base' }),
            );
          } else {
            districts.sort((a, b) =>
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
      const filteredDistricts = [];

      districts.forEach((item) => {
        const filteredDistrict = {};
        fieldsArray.forEach((field) => {
          filteredDistrict[field] = item[field];
        });
        filteredDistricts.push(filteredDistrict);
      });

      districts = filteredDistricts;

      if (fieldsArray.some((item) => !Object.keys(data[0]).includes(item))) {
        throw {
          status: 404,
          message:
            'Invalid fields. The fields parameter must be a comma-separated list of valid fields.',
        };
      }
    }

    if (offset || limit) {
      districts = districts.slice(+offset, +offset + +limit);

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
    }

    if (districts.length > 0) {
      return districts;
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

exports.getExactDistrict = function (id, fields) {
  try {
    if (!isFinite(id)) {
      throw {
        status: 404,
        message: 'Invalid district ID. The id parameter must be a number.',
      };
    }

    const district = data.find((item) => item.id === +id);

    const districtNeighborhoods = neighborhoods
      .filter((neighborhood) => neighborhood.districtId === district.id)
      .map(({ id, name, population }) => ({ id, name, population }));

    district.neighborhoods = districtNeighborhoods;

    const districtVillages = villages
      .filter((village) => village.districtId === district.id)
      .map(({ id, name, population }) => ({ id, name, population }));

    district.villages = districtVillages;

    if (fields) {
      const fieldsArray = fields.split(',');
      const filteredDistrict = {};

      fieldsArray.forEach((field) => {
        filteredDistrict[field] = district[field];
      });

      if (fieldsArray.some((item) => !Object.keys(data[0]).includes(item))) {
        throw {
          status: 404,
          message:
            'Invalid fields. The fields parameter must be a comma-separated list of valid fields.',
        };
      }
      return filteredDistrict;
    } else {
      if (district) {
        return district;
      } else {
        throw {
          status: 404,
          message: 'No district found.',
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
