const data = require('./provinces.min.json');
const districts = require('./districts.min.json');
const neighborhoods = require('./neighborhoods.min.json');
const villages = require('./villages.min.json');

exports.getProvinces = function (
  name,
  minPopulation = 1,
  maxPopulation = 1000000000,
  minArea = 1,
  maxArea = 1000000000,
  minAltitude = 0,
  maxAltitude = 10000,
  isMetropolitan,
  offset = 0,
  limit = 81,
  fields,
  sort,
) {
  try {
    let provinces = data;

    provinces.forEach((province) => {
      const provinceDistricts = districts
        .filter((district) => district.provinceId === province.id)
        .map(({ id, name, population, area }) => ({
          id,
          name,
          population,
          area,
        }));

      province.districts = provinceDistricts;
    });

    if (!Object.values(arguments).some((item) => item)) {
      return provinces;
    }

    if (name) {
      const nameAlt =
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

    if (minArea || maxArea) {
      if (+minArea <= 0 && +maxArea <= 0) {
        throw {
          status: 404,
          message: "You can't search for a province with an area of 0 or less.",
        };
      }

      if (+minArea > +maxArea) {
        throw {
          status: 404,
          message: 'The minimum area cannot be greater than the maximum area.',
        };
      }

      provinces = provinces.filter((item) => {
        return item.area >= minArea && item.area <= maxArea;
      });
    }

    if (minAltitude || maxAltitude) {
      if (+minAltitude < 0 && +maxAltitude < 0) {
        throw {
          status: 404,
          message:
            "You can't search for a province with an altitude of less than 0.",
        };
      }

      if (+minAltitude > +maxAltitude) {
        throw {
          status: 404,
          message:
            'The minimum altitude cannot be greater than the maximum altitude.',
        };
      }

      provinces = provinces.filter((item) => {
        return item.altitude >= minAltitude && item.altitude <= maxAltitude;
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
          message: 'The isMetropolitan parameter must be either true or false.',
        };
      }
    }

    if (sort) {
      const sortArray = sort.split(',').reverse();

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
      const filteredProvinces = [];

      provinces.forEach((item) => {
        const filteredProvince = {};
        fieldsArray.forEach((field) => {
          filteredProvince[field] = item[field];
        });
        filteredProvinces.push(filteredProvince);
      });

      provinces = filteredProvinces;

      if (fieldsArray.some((item) => !Object.keys(data[0]).includes(item))) {
        throw {
          status: 404,
          message:
            'Invalid fields. The fields parameter must be a comma-separated list of valid fields.',
        };
      }
    }

    if (offset || limit) {
      provinces = provinces.slice(+offset, +offset + +limit);

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

    if (provinces.length > 0) {
      return provinces;
    } else {
      throw {
        status: 404,
        message: 'No province found.',
      };
    }
  } catch (error) {
    throw {
      status: error?.status || 500,
      message: error?.message || 'Internal Server Error',
    };
  }
};

exports.getExactProvince = function (id, fields, extend) {
  try {
    if (!isFinite(id)) {
      throw {
        status: 404,
        message: 'Invalid province ID. The id parameter must be a number.',
      };
    }

    const province = data.find((item) => item.id === +id);

    const provinceDistricts = districts.filter(
      (district) => district.provinceId === province.id,
    );

    province.districts = provinceDistricts.map(
      ({ id, name, population, area }) => ({ id, name, population, area }),
    );

    if (extend === 'true') {
      province.districts.forEach((district) => {
        const districtNeighborhoods = neighborhoods
          .filter((neighborhood) => neighborhood.districtId === district.id)
          .map(({ id, name, population }) => ({ id, name, population }));

        district.neighborhoods = districtNeighborhoods;

        const districtVillages = villages
          .filter((village) => village.districtId === district.id)
          .map(({ id, name, population }) => ({ id, name, population }));

        district.villages = districtVillages;
      });
    }

    if (fields) {
      const fieldsArray = fields.split(',');
      const filteredProvince = {};

      fieldsArray.forEach((field) => {
        filteredProvince[field] = province[field];
      });

      if (fieldsArray.some((item) => !Object.keys(data[0]).includes(item))) {
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
