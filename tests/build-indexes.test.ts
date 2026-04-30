import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildIndexes, getGroup } from '../src/indexes/index.js';
import {
  type Datasets,
  type District,
  type Municipality,
  type Neighborhood,
  type Province,
  type Village,
} from '../src/data/index.js';

const province: Province = {
  id: 1,
  name: 'Adana',
  slug: 'adana',
  population: 2_280_000,
  area: { value: 13_844, unit: 'km2' },
  altitude: { value: 23, unit: 'm' },
  phoneAreaCodes: [322],
  isCoastal: true,
  isMetropolitan: true,
  region: { tr: 'Akdeniz', en: 'Mediterranean' },
  coordinates: { latitude: 37, longitude: 35.3213 },
  stats: {
    districtCount: 1,
    municipalityCount: 1,
    neighborhoodCount: 2,
    villageCount: 1,
  },
};

const district: District = {
  id: 1757,
  name: 'Seyhan',
  slug: 'seyhan',
  provinceId: 1,
  population: 787_771,
  area: { value: 444, unit: 'km2' },
  stats: {
    municipalityCount: 1,
    neighborhoodCount: 2,
    villageCount: 1,
  },
};

const municipality: Municipality = {
  id: 11001,
  name: 'Seyhan',
  slug: 'seyhan',
  type: 'district_center' as const,
  provinceId: 1,
  districtId: 1757,
  population: 787_771,
  stats: { neighborhoodCount: 2 },
};

const neighborhoods: readonly Neighborhood[] = [
  {
    id: 20001,
    name: 'Tellidere',
    slug: 'tellidere',
    provinceId: 1,
    districtId: 1757,
    municipalityId: 11001,
    population: 12_000,
    postalCode: '01010',
  },
  {
    id: 20002,
    name: 'Pinar',
    slug: 'pinar',
    provinceId: 1,
    districtId: 1757,
    municipalityId: 11001,
    population: 9_000,
    postalCode: null,
  },
];

const village: Village = {
  id: 30001,
  name: 'Sample Village',
  slug: 'sample-village',
  provinceId: 1,
  districtId: 1757,
  population: 500,
  postalCode: '01020',
};

const datasets: Datasets = {
  provinces: [province],
  districts: [district],
  municipalities: [municipality],
  neighborhoods,
  villages: [village],
};

describe('buildIndexes', () => {
  it('builds id lookups and grouped relationship indexes', () => {
    const indexes = buildIndexes(datasets);

    assert.equal(indexes.provinceById.get(1), province);
    assert.equal(indexes.districtById.get(1757), district);
    assert.equal(indexes.municipalityById.get(11001), municipality);
    assert.deepEqual(getGroup(indexes.neighborhoodsByProvinceId, 1), neighborhoods);
    assert.deepEqual(getGroup(indexes.neighborhoodsByDistrictId, 1757), neighborhoods);
    assert.deepEqual(getGroup(indexes.neighborhoodsByMunicipalityId, 11001), neighborhoods);
    assert.deepEqual(getGroup(indexes.villagesByDistrictId, 1757), [village]);
    assert.deepEqual(getGroup(indexes.districtsByProvinceId, 999), []);
    assert.equal(Object.isFrozen(indexes), true);
  });

  it('throws when duplicate ids are indexed', () => {
    const duplicateDatasets: Datasets = {
      ...datasets,
      provinces: [province, { ...province }],
    };

    assert.throws(() => buildIndexes(duplicateDatasets), /Duplicate id "1" found while building provinceById\./);
  });
});
