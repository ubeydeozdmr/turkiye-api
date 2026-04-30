import { type Datasets, type District, type Municipality, type Neighborhood, type Province } from '../data/index.js';
import { getGroup, type DatasetIndexes } from '../indexes/index.js';
import { type MunicipalityListQuery } from '../schemas/index.js';
import { includesNormalizedText, normalizePagination, paginate, sortByName, type Pagination } from '../utils/index.js';

export interface MunicipalityListResult {
  readonly items: readonly Municipality[];
  readonly pagination: Pagination;
  readonly total: number;
}

export interface MunicipalityService {
  readonly listMunicipalities: (query: MunicipalityListQuery) => MunicipalityListResult;
  readonly getMunicipalityById: (municipalityId: number) => Municipality | undefined;
  readonly getProvinceByMunicipalityId: (municipalityId: number) => Province | undefined;
  readonly getDistrictByMunicipalityId: (municipalityId: number) => District | undefined;
  readonly getNeighborhoodsByMunicipalityId: (municipalityId: number) => readonly Neighborhood[] | undefined;
}

export interface CreateMunicipalityServiceOptions {
  readonly datasets: Datasets;
  readonly indexes: DatasetIndexes;
}

function applyMunicipalityFilters(
  municipalities: readonly Municipality[],
  query: MunicipalityListQuery,
): readonly Municipality[] {
  return municipalities.filter((municipality) => {
    if (query.search !== undefined && !includesNormalizedText(municipality.name, query.search)) {
      return false;
    }

    if (query.minPopulation !== undefined && municipality.population < query.minPopulation) {
      return false;
    }

    if (query.maxPopulation !== undefined && municipality.population > query.maxPopulation) {
      return false;
    }

    if (query.provinceId !== undefined && municipality.provinceId !== query.provinceId) {
      return false;
    }

    if (query.districtId !== undefined && municipality.districtId !== query.districtId) {
      return false;
    }

    if (query.type !== undefined && municipality.type !== query.type) {
      return false;
    }

    return true;
  });
}

function applyMunicipalitySort(
  municipalities: readonly Municipality[],
  sort: string | undefined,
): readonly Municipality[] {
  if (sort === undefined || sort === 'id') {
    return [...municipalities].sort((left, right) => left.id - right.id);
  }

  if (sort === '-id') {
    return [...municipalities].sort((left, right) => right.id - left.id);
  }

  if (sort === 'name') {
    return sortByName(municipalities, 'asc');
  }

  if (sort === '-name') {
    return sortByName(municipalities, 'desc');
  }

  if (sort === 'population') {
    return [...municipalities].sort((left, right) => left.population - right.population);
  }

  if (sort === '-population') {
    return [...municipalities].sort((left, right) => right.population - left.population);
  }

  return municipalities;
}

function hasMunicipality(indexes: DatasetIndexes, municipalityId: number): boolean {
  return indexes.municipalityById.has(municipalityId);
}

export function createMunicipalityService(options: CreateMunicipalityServiceOptions): MunicipalityService {
  const { datasets, indexes } = options;

  return {
    listMunicipalities(query) {
      const pagination = normalizePagination(query);
      const filtered = applyMunicipalityFilters(datasets.municipalities, query);
      const sorted = applyMunicipalitySort(filtered, query.sort);

      return {
        items: paginate(sorted, pagination),
        pagination,
        total: sorted.length,
      };
    },

    getMunicipalityById(municipalityId) {
      return indexes.municipalityById.get(municipalityId);
    },

    getProvinceByMunicipalityId(municipalityId) {
      const municipality = indexes.municipalityById.get(municipalityId);

      if (municipality === undefined) {
        return undefined;
      }

      return indexes.provinceById.get(municipality.provinceId);
    },

    getDistrictByMunicipalityId(municipalityId) {
      const municipality = indexes.municipalityById.get(municipalityId);

      if (municipality === undefined) {
        return undefined;
      }

      return indexes.districtById.get(municipality.districtId);
    },

    getNeighborhoodsByMunicipalityId(municipalityId) {
      if (!hasMunicipality(indexes, municipalityId)) {
        return undefined;
      }

      return getGroup(indexes.neighborhoodsByMunicipalityId, municipalityId);
    },
  };
}
