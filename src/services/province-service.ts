import {
  type Datasets,
  type District,
  type Municipality,
  type Neighborhood,
  type Province,
  type Village,
} from '../data/index.js';
import { getGroup, type DatasetIndexes } from '../indexes/index.js';
import { type ProvinceListQuery } from '../schemas/index.js';
import { includesNormalizedText, normalizePagination, paginate, sortByName, type Pagination } from '../utils/index.js';

export interface ProvinceListResult {
  readonly items: readonly Province[];
  readonly pagination: Pagination;
  readonly total: number;
}

export interface ProvinceService {
  readonly listProvinces: (query: ProvinceListQuery) => ProvinceListResult;
  readonly getProvinceById: (provinceId: number) => Province | undefined;
  readonly getDistrictsByProvinceId: (provinceId: number) => readonly District[] | undefined;
  readonly getMunicipalitiesByProvinceId: (provinceId: number) => readonly Municipality[] | undefined;
  readonly getNeighborhoodsByProvinceId: (provinceId: number) => readonly Neighborhood[] | undefined;
  readonly getVillagesByProvinceId: (provinceId: number) => readonly Village[] | undefined;
}

export interface CreateProvinceServiceOptions {
  readonly datasets: Datasets;
  readonly indexes: DatasetIndexes;
}

function parseBooleanFilter(value: 'true' | 'false' | undefined): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }

  return value === 'true';
}

function applyProvinceFilters(provinces: readonly Province[], query: ProvinceListQuery): readonly Province[] {
  const isCoastal = parseBooleanFilter(query.isCoastal);
  const isMetropolitan = parseBooleanFilter(query.isMetropolitan);

  return provinces.filter((province) => {
    if (query.search !== undefined && !includesNormalizedText(province.name, query.search)) {
      return false;
    }

    if (query.minPopulation !== undefined && province.population < query.minPopulation) {
      return false;
    }

    if (query.maxPopulation !== undefined && province.population > query.maxPopulation) {
      return false;
    }

    if (query.minArea !== undefined && province.area.value < query.minArea) {
      return false;
    }

    if (query.maxArea !== undefined && province.area.value > query.maxArea) {
      return false;
    }

    if (query.minAltitude !== undefined && province.altitude.value < query.minAltitude) {
      return false;
    }

    if (query.maxAltitude !== undefined && province.altitude.value > query.maxAltitude) {
      return false;
    }

    if (isCoastal !== undefined && province.isCoastal !== isCoastal) {
      return false;
    }

    if (isMetropolitan !== undefined && province.isMetropolitan !== isMetropolitan) {
      return false;
    }

    return true;
  });
}

function applyProvinceSort(provinces: readonly Province[], sort: string | undefined): readonly Province[] {
  if (sort === undefined || sort === 'id') {
    return [...provinces].sort((left, right) => left.id - right.id);
  }

  if (sort === '-id') {
    return [...provinces].sort((left, right) => right.id - left.id);
  }

  if (sort === 'name') {
    return sortByName(provinces, 'asc');
  }

  if (sort === '-name') {
    return sortByName(provinces, 'desc');
  }

  if (sort === 'population') {
    return [...provinces].sort((left, right) => left.population - right.population);
  }

  if (sort === '-population') {
    return [...provinces].sort((left, right) => right.population - left.population);
  }

  return provinces;
}

function hasProvince(indexes: DatasetIndexes, provinceId: number): boolean {
  return indexes.provinceById.has(provinceId);
}

export function createProvinceService(options: CreateProvinceServiceOptions): ProvinceService {
  const { datasets, indexes } = options;

  return {
    listProvinces(query) {
      const pagination = normalizePagination(query);
      const filtered = applyProvinceFilters(datasets.provinces, query);
      const sorted = applyProvinceSort(filtered, query.sort);

      return {
        items: paginate(sorted, pagination),
        pagination,
        total: sorted.length,
      };
    },

    getProvinceById(provinceId) {
      return indexes.provinceById.get(provinceId);
    },

    getDistrictsByProvinceId(provinceId) {
      if (!hasProvince(indexes, provinceId)) {
        return undefined;
      }

      return getGroup(indexes.districtsByProvinceId, provinceId);
    },

    getMunicipalitiesByProvinceId(provinceId) {
      if (!hasProvince(indexes, provinceId)) {
        return undefined;
      }

      return getGroup(indexes.municipalitiesByProvinceId, provinceId);
    },

    getNeighborhoodsByProvinceId(provinceId) {
      if (!hasProvince(indexes, provinceId)) {
        return undefined;
      }

      return getGroup(indexes.neighborhoodsByProvinceId, provinceId);
    },

    getVillagesByProvinceId(provinceId) {
      if (!hasProvince(indexes, provinceId)) {
        return undefined;
      }

      return getGroup(indexes.villagesByProvinceId, provinceId);
    },
  };
}
