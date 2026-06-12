import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, it } from 'node:test';

import { DATASET_FILENAMES, DATASET_VERSION, type DatasetName } from '../src/data/index.js';
import { createDatasetService } from '../src/services/index.js';

const tempDirectories: string[] = [];

function writeDatasetFiles(directory: string, marker: string): void {
  fs.mkdirSync(directory, { recursive: true });

  for (const [datasetName, fileName] of Object.entries(DATASET_FILENAMES) as [DatasetName, string][]) {
    fs.writeFileSync(path.join(directory, fileName), JSON.stringify([{ datasetName, marker }]));
  }
}

function createDatasetDirectory(): string {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'turkiye-api-static-datasets-'));
  tempDirectories.push(directory);

  writeDatasetFiles(directory, 'latest');
  writeDatasetFiles(path.join(directory, DATASET_VERSION), 'versioned');

  return directory;
}

afterEach(() => {
  for (const directory of tempDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe('createDatasetService', () => {
  it('serves versioned dataset files from the version directory, not latest files', () => {
    const datasetDirectory = createDatasetDirectory();
    const service = createDatasetService({ datasetDirectory });

    const latest = service.getLatestDataset('provinces.json');
    const versioned = service.getVersionedDataset(DATASET_VERSION, 'provinces.json');

    assert.ok(latest);
    assert.ok(versioned);
    assert.deepEqual(JSON.parse(latest.content.toString('utf8')), [{ datasetName: 'provinces', marker: 'latest' }]);
    assert.deepEqual(JSON.parse(versioned.content.toString('utf8')), [
      { datasetName: 'provinces', marker: 'versioned' },
    ]);
    assert.notEqual(versioned.etag, latest.etag);
    assert.equal(service.getVersionedDataset('missing-version', 'provinces.json'), undefined);
  });
});
