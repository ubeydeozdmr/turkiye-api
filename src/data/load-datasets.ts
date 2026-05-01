import fs from 'node:fs';

import { getDatasetFilePath } from './dataset-files.js';
import {
  type DatasetName,
  type DatasetRow,
  type Datasets,
  type District,
  type Municipality,
  type Neighborhood,
  type Province,
  type Village,
} from './types.js';

export interface LoadDatasetsOptions {
  readonly datasetDirectory?: string;
}

function parseDatasetFile<Name extends DatasetName>(
  datasetName: Name,
  datasetDirectory: string | undefined,
): readonly DatasetRow<Name>[] {
  const filePath = getDatasetFilePath(datasetName, datasetDirectory);
  const rawJson = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(rawJson) as unknown;

  if (!Array.isArray(parsed)) {
    throw new Error(`Dataset "${datasetName}" must be a JSON array.`);
  }

  return Object.freeze(parsed as DatasetRow<Name>[]);
}

export function loadDatasets(options: LoadDatasetsOptions = {}): Datasets {
  const datasetDirectory = options.datasetDirectory;

  return Object.freeze({
    provinces: parseDatasetFile('provinces', datasetDirectory) as readonly Province[],
    districts: parseDatasetFile('districts', datasetDirectory) as readonly District[],
    municipalities: parseDatasetFile('municipalities', datasetDirectory) as readonly Municipality[],
    neighborhoods: parseDatasetFile('neighborhoods', datasetDirectory) as readonly Neighborhood[],
    villages: parseDatasetFile('villages', datasetDirectory) as readonly Village[],
  });
}
