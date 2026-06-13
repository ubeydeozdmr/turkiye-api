import {
  type Datasets,
  type District,
  type Municipality,
  type Neighborhood,
  type Province,
  type Village,
} from '../data/index.js';
import { getGroup, type DatasetIndexes } from '../indexes/index.js';
import { type DistrictListQuery } from '../schemas/index.js';
import { includesNormalizedText, normalizePagination, paginate, sortByName, type Pagination } from '../utils/index.js';

export interface DistrictListResult {
  readonly items: readonly District[];
  readonly pagination: Pagination;
  readonly total: number;
}

export interface DistrictService {
  readonly listDistricts: (query: DistrictListQuery) => DistrictListResult;
  readonly getDistrictById: (districtId: number) => District | undefined;
  readonly getProvinceByDistrictId: (districtId: number) => Province | undefined;
  readonly getMunicipalitiesByDistrictId: (districtId: number) => readonly Municipality[] | undefined;
  readonly getNeighborhoodsByDistrictId: (districtId: number) => readonly Neighborhood[] | undefined;
  readonly getVillagesByDistrictId: (districtId: number) => readonly Village[] | undefined;
}

export interface CreateDistrictServiceOptions {
  readonly datasets: Datasets;
  readonly indexes: DatasetIndexes;
}

function applyDistrictFilters(districts: readonly District[], query: DistrictListQuery): readonly District[] {
  return districts.filter((district) => {
    if (query.search !== undefined && !includesNormalizedText(district.name, query.search)) {
      return false;
    }

    if (query.minPopulation !== undefined && district.population < query.minPopulation) {
      return false;
    }

    if (query.maxPopulation !== undefined && district.population > query.maxPopulation) {
      return false;
    }

    if (query.minArea !== undefined && district.area.value < query.minArea) {
      return false;
    }

    if (query.maxArea !== undefined && district.area.value > query.maxArea) {
      return false;
    }

    if (query.provinceId !== undefined && district.provinceId !== query.provinceId) {
      return false;
    }

    return true;
  });
}

function applyDistrictSort(districts: readonly District[], sort: string | undefined): readonly District[] {
  if (sort === undefined || sort === 'id') {
    return [...districts].sort((left, right) => left.id - right.id);
  }

  if (sort === '-id') {
    return [...districts].sort((left, right) => right.id - left.id);
  }

  if (sort === 'name') {
    return sortByName(districts, 'asc');
  }

  if (sort === '-name') {
    return sortByName(districts, 'desc');
  }

  if (sort === 'population') {
    return [...districts].sort((left, right) => left.population - right.population);
  }

  if (sort === '-population') {
    return [...districts].sort((left, right) => right.population - left.population);
  }

  return districts;
}

function hasDistrict(indexes: DatasetIndexes, districtId: number): boolean {
  return indexes.districtById.has(districtId);
}

export function createDistrictService(options: CreateDistrictServiceOptions): DistrictService {
  const { datasets, indexes } = options;

  return {
    listDistricts(query) {
      const pagination = normalizePagination(query);
      const filtered = applyDistrictFilters(datasets.districts, query);
      const sorted = applyDistrictSort(filtered, query.sort);

      return {
        items: paginate(sorted, pagination),
        pagination,
        total: sorted.length,
      };
    },

    getDistrictById(districtId) {
      return indexes.districtById.get(districtId);
    },

    getProvinceByDistrictId(districtId) {
      const district = indexes.districtById.get(districtId);

      if (district === undefined) {
        return undefined;
      }

      return indexes.provinceById.get(district.provinceId);
    },

    getMunicipalitiesByDistrictId(districtId) {
      if (!hasDistrict(indexes, districtId)) {
        return undefined;
      }

      return getGroup(indexes.municipalitiesByDistrictId, districtId);
    },

    getNeighborhoodsByDistrictId(districtId) {
      if (!hasDistrict(indexes, districtId)) {
        return undefined;
      }

      return getGroup(indexes.neighborhoodsByDistrictId, districtId);
    },

    getVillagesByDistrictId(districtId) {
      if (!hasDistrict(indexes, districtId)) {
        return undefined;
      }

      return getGroup(indexes.villagesByDistrictId, districtId);
    },
  };
}
