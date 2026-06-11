import { type Datasets } from '../data/index.js';
import { buildGroupMap, buildIdMap } from './index-helpers.js';
import { type DatasetIndexes } from './types.js';

function validateDistrictReferences(indexes: Pick<DatasetIndexes, 'provinceById'>, datasets: Datasets): void {
  for (const district of datasets.districts) {
    if (!indexes.provinceById.has(district.provinceId)) {
      throw new Error(`District "${district.id}" references missing province "${district.provinceId}".`);
    }
  }
}

function validateMunicipalityReferences(
  indexes: Pick<DatasetIndexes, 'provinceById' | 'districtById'>,
  datasets: Datasets,
): void {
  for (const municipality of datasets.municipalities) {
    const district = indexes.districtById.get(municipality.districtId);

    if (!indexes.provinceById.has(municipality.provinceId)) {
      throw new Error(`Municipality "${municipality.id}" references missing province "${municipality.provinceId}".`);
    }

    if (district === undefined) {
      throw new Error(`Municipality "${municipality.id}" references missing district "${municipality.districtId}".`);
    }

    if (district.provinceId !== municipality.provinceId) {
      throw new Error(
        `Municipality "${municipality.id}" references district "${municipality.districtId}" in province "${district.provinceId}", not province "${municipality.provinceId}".`,
      );
    }
  }
}

function validateNeighborhoodReferences(
  indexes: Pick<DatasetIndexes, 'provinceById' | 'districtById' | 'municipalityById'>,
  datasets: Datasets,
): void {
  for (const neighborhood of datasets.neighborhoods) {
    const district = indexes.districtById.get(neighborhood.districtId);
    const municipality = indexes.municipalityById.get(neighborhood.municipalityId);

    if (!indexes.provinceById.has(neighborhood.provinceId)) {
      throw new Error(`Neighborhood "${neighborhood.id}" references missing province "${neighborhood.provinceId}".`);
    }

    if (district === undefined) {
      throw new Error(`Neighborhood "${neighborhood.id}" references missing district "${neighborhood.districtId}".`);
    }

    if (municipality === undefined) {
      throw new Error(
        `Neighborhood "${neighborhood.id}" references missing municipality "${neighborhood.municipalityId}".`,
      );
    }

    if (district !== undefined && district.provinceId !== neighborhood.provinceId) {
      throw new Error(
        `Neighborhood "${neighborhood.id}" references district "${neighborhood.districtId}" in province "${district.provinceId}", not province "${neighborhood.provinceId}".`,
      );
    }

    if (
      municipality !== undefined &&
      (municipality.provinceId !== neighborhood.provinceId || municipality.districtId !== neighborhood.districtId)
    ) {
      throw new Error(
        `Neighborhood "${neighborhood.id}" references municipality "${neighborhood.municipalityId}" outside its province/district chain.`,
      );
    }
  }
}

function validateVillageReferences(
  indexes: Pick<DatasetIndexes, 'provinceById' | 'districtById'>,
  datasets: Datasets,
): void {
  for (const village of datasets.villages) {
    const district = indexes.districtById.get(village.districtId);

    if (!indexes.provinceById.has(village.provinceId)) {
      throw new Error(`Village "${village.id}" references missing province "${village.provinceId}".`);
    }

    if (district === undefined) {
      throw new Error(`Village "${village.id}" references missing district "${village.districtId}".`);
    }

    if (district !== undefined && district.provinceId !== village.provinceId) {
      throw new Error(
        `Village "${village.id}" references district "${village.districtId}" in province "${district.provinceId}", not province "${village.provinceId}".`,
      );
    }
  }
}

function assertStatCount(label: string, statName: string, expected: number, actual: number): void {
  if (expected !== actual) {
    throw new Error(`${label} stats.${statName} is ${expected}, but indexed data has ${actual}.`);
  }
}

function validateStats(indexes: DatasetIndexes, datasets: Datasets): void {
  for (const province of datasets.provinces) {
    assertStatCount(
      `Province "${province.id}"`,
      'districtCount',
      province.stats.districtCount,
      indexes.districtsByProvinceId.get(province.id)?.length ?? 0,
    );
    assertStatCount(
      `Province "${province.id}"`,
      'municipalityCount',
      province.stats.municipalityCount,
      indexes.municipalitiesByProvinceId.get(province.id)?.length ?? 0,
    );
    assertStatCount(
      `Province "${province.id}"`,
      'neighborhoodCount',
      province.stats.neighborhoodCount,
      indexes.neighborhoodsByProvinceId.get(province.id)?.length ?? 0,
    );
    assertStatCount(
      `Province "${province.id}"`,
      'villageCount',
      province.stats.villageCount,
      indexes.villagesByProvinceId.get(province.id)?.length ?? 0,
    );
  }

  for (const district of datasets.districts) {
    assertStatCount(
      `District "${district.id}"`,
      'municipalityCount',
      district.stats.municipalityCount,
      indexes.municipalitiesByDistrictId.get(district.id)?.length ?? 0,
    );
    assertStatCount(
      `District "${district.id}"`,
      'neighborhoodCount',
      district.stats.neighborhoodCount,
      indexes.neighborhoodsByDistrictId.get(district.id)?.length ?? 0,
    );
    assertStatCount(
      `District "${district.id}"`,
      'villageCount',
      district.stats.villageCount,
      indexes.villagesByDistrictId.get(district.id)?.length ?? 0,
    );
  }

  for (const municipality of datasets.municipalities) {
    assertStatCount(
      `Municipality "${municipality.id}"`,
      'neighborhoodCount',
      municipality.stats.neighborhoodCount,
      indexes.neighborhoodsByMunicipalityId.get(municipality.id)?.length ?? 0,
    );
  }
}

export function buildIndexes(datasets: Datasets): DatasetIndexes {
  const idIndexes = {
    provinceById: buildIdMap(datasets.provinces, 'provinceById'),
    districtById: buildIdMap(datasets.districts, 'districtById'),
    municipalityById: buildIdMap(datasets.municipalities, 'municipalityById'),
    neighborhoodById: buildIdMap(datasets.neighborhoods, 'neighborhoodById'),
    villageById: buildIdMap(datasets.villages, 'villageById'),
  };

  validateDistrictReferences(idIndexes, datasets);
  validateMunicipalityReferences(idIndexes, datasets);
  validateNeighborhoodReferences(idIndexes, datasets);
  validateVillageReferences(idIndexes, datasets);

  const indexes = Object.freeze({
    ...idIndexes,
    districtsByProvinceId: buildGroupMap(datasets.districts, (district) => district.provinceId),
    municipalitiesByProvinceId: buildGroupMap(datasets.municipalities, (municipality) => municipality.provinceId),
    municipalitiesByDistrictId: buildGroupMap(datasets.municipalities, (municipality) => municipality.districtId),
    neighborhoodsByProvinceId: buildGroupMap(datasets.neighborhoods, (neighborhood) => neighborhood.provinceId),
    neighborhoodsByDistrictId: buildGroupMap(datasets.neighborhoods, (neighborhood) => neighborhood.districtId),
    neighborhoodsByMunicipalityId: buildGroupMap(datasets.neighborhoods, (neighborhood) => neighborhood.municipalityId),
    villagesByProvinceId: buildGroupMap(datasets.villages, (village) => village.provinceId),
    villagesByDistrictId: buildGroupMap(datasets.villages, (village) => village.districtId),
  });

  validateStats(indexes, datasets);

  return indexes;
}
