import { type Datasets, type District, type Province, type Village } from '../data/index.js';
import { type DatasetIndexes } from '../indexes/index.js';
import { type VillageListQuery } from '../schemas/index.js';
import {
  filterByPostalCodeQuery,
  filterByPostalCodeStatus,
  includesNormalizedText,
  normalizePagination,
  paginate,
  sortByName,
  type Pagination,
  type PostalCodeStatusSelection,
  type QueryValidationResult,
  type VillagePostalCodeStatus,
  validQuery,
} from '../utils/index.js';

export interface VillageListResult {
  readonly items: readonly Village[];
  readonly pagination: Pagination;
  readonly total: number;
}

export interface VillageService {
  readonly listVillages: (
    query: VillageListQuery,
    postalCodeStatuses?: PostalCodeStatusSelection<VillagePostalCodeStatus>,
  ) => VillageListResult;
  readonly validateListQueryHierarchy: (query: VillageListQuery) => QueryValidationResult;
  readonly getVillageById: (villageId: number) => Village | undefined;
  readonly getProvinceByVillageId: (villageId: number) => Province | undefined;
  readonly getDistrictByVillageId: (villageId: number) => District | undefined;
}

export interface CreateVillageServiceOptions {
  readonly datasets: Datasets;
  readonly indexes: DatasetIndexes;
}

function applyVillageFilters(
  villages: readonly Village[],
  query: VillageListQuery,
  postalCodeStatuses: PostalCodeStatusSelection<VillagePostalCodeStatus>,
): readonly Village[] {
  return filterByPostalCodeQuery(filterByPostalCodeStatus(villages, postalCodeStatuses), query).filter((village) => {
    if (query.search !== undefined && !includesNormalizedText(village.name, query.search)) {
      return false;
    }

    if (query.minPopulation !== undefined && village.population < query.minPopulation) {
      return false;
    }

    if (query.maxPopulation !== undefined && village.population > query.maxPopulation) {
      return false;
    }

    if (query.provinceId !== undefined && village.provinceId !== query.provinceId) {
      return false;
    }

    if (query.districtId !== undefined && village.districtId !== query.districtId) {
      return false;
    }

    return true;
  });
}

function applyVillageSort(villages: readonly Village[], sort: string | undefined): readonly Village[] {
  if (sort === undefined || sort === 'id') {
    return [...villages].sort((left, right) => left.id - right.id);
  }

  if (sort === '-id') {
    return [...villages].sort((left, right) => right.id - left.id);
  }

  if (sort === 'name') {
    return sortByName(villages, 'asc');
  }

  if (sort === '-name') {
    return sortByName(villages, 'desc');
  }

  if (sort === 'population') {
    return [...villages].sort((left, right) => left.population - right.population);
  }

  if (sort === '-population') {
    return [...villages].sort((left, right) => right.population - left.population);
  }

  return villages;
}

function hasVillage(indexes: DatasetIndexes, villageId: number): boolean {
  return indexes.villageById.has(villageId);
}

function validateVillageListQueryHierarchy(indexes: DatasetIndexes, query: VillageListQuery): QueryValidationResult {
  if (query.provinceId === undefined || query.districtId === undefined) {
    return validQuery;
  }

  const district = indexes.districtById.get(query.districtId);

  if (district !== undefined && district.provinceId !== query.provinceId) {
    return {
      ok: false,
      code: 'INVALID_HIERARCHY_FILTER',
      message: `districtId "${query.districtId}" does not belong to provinceId "${query.provinceId}".`,
    };
  }

  return validQuery;
}

export function createVillageService(options: CreateVillageServiceOptions): VillageService {
  const { datasets, indexes } = options;

  return {
    listVillages(query, postalCodeStatuses) {
      const pagination = normalizePagination(query);
      const filtered = applyVillageFilters(datasets.villages, query, postalCodeStatuses);
      const sorted = applyVillageSort(filtered, query.sort);

      return {
        items: paginate(sorted, pagination),
        pagination,
        total: sorted.length,
      };
    },

    validateListQueryHierarchy(query) {
      return validateVillageListQueryHierarchy(indexes, query);
    },

    getVillageById(villageId) {
      if (!hasVillage(indexes, villageId)) {
        return undefined;
      }

      return indexes.villageById.get(villageId);
    },

    getProvinceByVillageId(villageId) {
      const village = indexes.villageById.get(villageId);

      if (village === undefined) {
        return undefined;
      }

      return indexes.provinceById.get(village.provinceId);
    },

    getDistrictByVillageId(villageId) {
      const village = indexes.villageById.get(villageId);

      if (village === undefined) {
        return undefined;
      }

      return indexes.districtById.get(village.districtId);
    },
  };
}
