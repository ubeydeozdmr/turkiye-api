import { type Datasets, type District, type Municipality, type Neighborhood, type Province } from '../data/index.js';
import { type DatasetIndexes } from '../indexes/index.js';
import { type NeighborhoodListQuery } from '../schemas/index.js';
import { includesNormalizedText, normalizePagination, paginate, sortByName, type Pagination } from '../utils/index.js';

export interface NeighborhoodListResult {
  readonly items: readonly Neighborhood[];
  readonly pagination: Pagination;
  readonly total: number;
}

export interface NeighborhoodService {
  readonly listNeighborhoods: (query: NeighborhoodListQuery) => NeighborhoodListResult;
  readonly getNeighborhoodById: (neighborhoodId: number) => Neighborhood | undefined;
  readonly getProvinceByNeighborhoodId: (neighborhoodId: number) => Province | undefined;
  readonly getDistrictByNeighborhoodId: (neighborhoodId: number) => District | undefined;
  readonly getMunicipalityByNeighborhoodId: (neighborhoodId: number) => Municipality | undefined;
}

export interface CreateNeighborhoodServiceOptions {
  readonly datasets: Datasets;
  readonly indexes: DatasetIndexes;
}

function applyNeighborhoodFilters(
  neighborhoods: readonly Neighborhood[],
  query: NeighborhoodListQuery,
): readonly Neighborhood[] {
  return neighborhoods.filter((neighborhood) => {
    if (query.search !== undefined && !includesNormalizedText(neighborhood.name, query.search)) {
      return false;
    }

    if (query.minPopulation !== undefined && neighborhood.population < query.minPopulation) {
      return false;
    }

    if (query.maxPopulation !== undefined && neighborhood.population > query.maxPopulation) {
      return false;
    }

    if (query.provinceId !== undefined && neighborhood.provinceId !== query.provinceId) {
      return false;
    }

    if (query.districtId !== undefined && neighborhood.districtId !== query.districtId) {
      return false;
    }

    if (query.municipalityId !== undefined && neighborhood.municipalityId !== query.municipalityId) {
      return false;
    }

    return true;
  });
}

function applyNeighborhoodSort(
  neighborhoods: readonly Neighborhood[],
  sort: string | undefined,
): readonly Neighborhood[] {
  if (sort === undefined || sort === 'id') {
    return [...neighborhoods].sort((left, right) => left.id - right.id);
  }

  if (sort === '-id') {
    return [...neighborhoods].sort((left, right) => right.id - left.id);
  }

  if (sort === 'name') {
    return sortByName(neighborhoods, 'asc');
  }

  if (sort === '-name') {
    return sortByName(neighborhoods, 'desc');
  }

  if (sort === 'population') {
    return [...neighborhoods].sort((left, right) => left.population - right.population);
  }

  if (sort === '-population') {
    return [...neighborhoods].sort((left, right) => right.population - left.population);
  }

  return neighborhoods;
}

function hasNeighborhood(indexes: DatasetIndexes, neighborhoodId: number): boolean {
  return indexes.neighborhoodById.has(neighborhoodId);
}

export function createNeighborhoodService(options: CreateNeighborhoodServiceOptions): NeighborhoodService {
  const { datasets, indexes } = options;

  return {
    listNeighborhoods(query) {
      const pagination = normalizePagination(query);
      const filtered = applyNeighborhoodFilters(datasets.neighborhoods, query);
      const sorted = applyNeighborhoodSort(filtered, query.sort);

      return {
        items: paginate(sorted, pagination),
        pagination,
        total: sorted.length,
      };
    },

    getNeighborhoodById(neighborhoodId) {
      if (!hasNeighborhood(indexes, neighborhoodId)) {
        return undefined;
      }

      return indexes.neighborhoodById.get(neighborhoodId);
    },

    getProvinceByNeighborhoodId(neighborhoodId) {
      const neighborhood = indexes.neighborhoodById.get(neighborhoodId);

      if (neighborhood === undefined) {
        return undefined;
      }

      return indexes.provinceById.get(neighborhood.provinceId);
    },

    getDistrictByNeighborhoodId(neighborhoodId) {
      const neighborhood = indexes.neighborhoodById.get(neighborhoodId);

      if (neighborhood === undefined) {
        return undefined;
      }

      return indexes.districtById.get(neighborhood.districtId);
    },

    getMunicipalityByNeighborhoodId(neighborhoodId) {
      const neighborhood = indexes.neighborhoodById.get(neighborhoodId);

      if (neighborhood === undefined) {
        return undefined;
      }

      return indexes.municipalityById.get(neighborhood.municipalityId);
    },
  };
}
