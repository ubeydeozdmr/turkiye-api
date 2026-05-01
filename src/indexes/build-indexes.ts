import { type Datasets } from '../data/index.js';
import { buildGroupMap, buildIdMap } from './index-helpers.js';
import { type DatasetIndexes } from './types.js';

export function buildIndexes(datasets: Datasets): DatasetIndexes {
  return Object.freeze({
    provinceById: buildIdMap(datasets.provinces, 'provinceById'),
    districtById: buildIdMap(datasets.districts, 'districtById'),
    municipalityById: buildIdMap(datasets.municipalities, 'municipalityById'),
    neighborhoodById: buildIdMap(datasets.neighborhoods, 'neighborhoodById'),
    villageById: buildIdMap(datasets.villages, 'villageById'),
    districtsByProvinceId: buildGroupMap(datasets.districts, (district) => district.provinceId),
    municipalitiesByProvinceId: buildGroupMap(datasets.municipalities, (municipality) => municipality.provinceId),
    municipalitiesByDistrictId: buildGroupMap(datasets.municipalities, (municipality) => municipality.districtId),
    neighborhoodsByProvinceId: buildGroupMap(datasets.neighborhoods, (neighborhood) => neighborhood.provinceId),
    neighborhoodsByDistrictId: buildGroupMap(datasets.neighborhoods, (neighborhood) => neighborhood.districtId),
    neighborhoodsByMunicipalityId: buildGroupMap(datasets.neighborhoods, (neighborhood) => neighborhood.municipalityId),
    villagesByProvinceId: buildGroupMap(datasets.villages, (village) => village.provinceId),
    villagesByDistrictId: buildGroupMap(datasets.villages, (village) => village.districtId),
  });
}
