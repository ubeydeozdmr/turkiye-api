import path from 'node:path';

import { type DatasetName } from './types.js';

export const DATASET_FILENAMES = {
  provinces: 'provinces.json',
  districts: 'districts.json',
  municipalities: 'municipalities.json',
  neighborhoods: 'neighborhoods.json',
  villages: 'villages.json',
} as const satisfies Record<DatasetName, string>;

export function getDefaultDatasetDirectory(): string {
  return path.resolve(process.cwd(), 'datasets');
}

export function getDatasetFilePath(datasetName: DatasetName, datasetDirectory = getDefaultDatasetDirectory()): string {
  return path.join(datasetDirectory, DATASET_FILENAMES[datasetName]);
}
