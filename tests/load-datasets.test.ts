import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, it } from 'node:test';

import { loadDatasets } from '../src/data/load-datasets.js';
import { DATASET_FILENAMES } from '../src/data/dataset-files.js';
import { type DatasetName } from '../src/data/types.js';

const tempDirectories: string[] = [];

const province = {
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
    neighborhoodCount: 1,
    villageCount: 1,
  },
};

const district = {
  id: 1757,
  name: 'Seyhan',
  slug: 'seyhan',
  provinceId: 1,
  population: 787_771,
  area: { value: 444, unit: 'km2' },
  stats: {
    municipalityCount: 1,
    neighborhoodCount: 1,
    villageCount: 1,
  },
};

const municipality = {
  id: 11001,
  name: 'Seyhan',
  slug: 'seyhan',
  type: 'district_center',
  provinceId: 1,
  districtId: 1757,
  population: 787_771,
  stats: { neighborhoodCount: 1 },
};

const neighborhood = {
  id: 20001,
  name: 'Tellidere',
  slug: 'tellidere',
  provinceId: 1,
  districtId: 1757,
  municipalityId: 11001,
  population: 12_000,
  postalCode: '01010',
};

const village = {
  id: 30001,
  name: 'Sample Village',
  slug: 'sample-village',
  provinceId: 1,
  districtId: 1757,
  population: 500,
  postalCode: null,
};

function createDatasetDirectory(overrides: Partial<Record<DatasetName, unknown>> = {}): string {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'turkiye-api-datasets-'));
  tempDirectories.push(directory);

  const datasets: Record<DatasetName, unknown> = {
    provinces: [province],
    districts: [district],
    municipalities: [municipality],
    neighborhoods: [neighborhood],
    villages: [village],
    ...overrides,
  };

  for (const [datasetName, filename] of Object.entries(DATASET_FILENAMES) as [DatasetName, string][]) {
    fs.writeFileSync(path.join(directory, filename), JSON.stringify(datasets[datasetName]));
  }

  return directory;
}

afterEach(() => {
  for (const directory of tempDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe('loadDatasets', () => {
  it('loads every dataset file from a custom directory', () => {
    const datasetDirectory = createDatasetDirectory();

    const datasets = loadDatasets({ datasetDirectory });

    assert.deepEqual(datasets.provinces, [province]);
    assert.deepEqual(datasets.districts, [district]);
    assert.deepEqual(datasets.municipalities, [municipality]);
    assert.deepEqual(datasets.neighborhoods, [neighborhood]);
    assert.deepEqual(datasets.villages, [village]);
    assert.equal(Object.isFrozen(datasets), true);
  });

  it('throws when a dataset file is not a JSON array', () => {
    const datasetDirectory = createDatasetDirectory({
      provinces: { id: 1, name: 'Adana' },
    });

    assert.throws(() => loadDatasets({ datasetDirectory }), /Dataset "provinces" must be a JSON array\./);
  });
});
