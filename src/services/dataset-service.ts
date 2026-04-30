import crypto from 'node:crypto';
import fs from 'node:fs';

import {
  DATASET_FILENAMES,
  DATASET_VERSION,
  getDatasetFilePath,
  getDefaultDatasetDirectory,
  type DatasetName,
} from '../data/index.js';

export type DatasetFileName = (typeof DATASET_FILENAMES)[DatasetName];

export interface StaticDataset {
  readonly content: Buffer;
  readonly contentLength: number;
  readonly datasetName: DatasetName;
  readonly etag: string;
  readonly fileName: DatasetFileName;
  readonly lastModified: string;
}

export interface DatasetService {
  readonly getLatestDataset: (fileName: string) => StaticDataset | undefined;
  readonly getVersionedDataset: (datasetVersion: string, fileName: string) => StaticDataset | undefined;
  readonly isDatasetFileName: (fileName: string) => fileName is DatasetFileName;
}

export interface CreateDatasetServiceOptions {
  readonly datasetDirectory?: string;
}

const datasetEntries = Object.entries(DATASET_FILENAMES) as Array<[DatasetName, DatasetFileName]>;

function createEtag(content: Buffer): string {
  const hash = crypto.createHash('sha256').update(content).digest('hex');

  return `"${hash}"`;
}

function loadStaticDataset(
  datasetName: DatasetName,
  fileName: DatasetFileName,
  datasetDirectory: string,
): StaticDataset {
  const filePath = getDatasetFilePath(datasetName, datasetDirectory);
  const content = fs.readFileSync(filePath);
  const stats = fs.statSync(filePath);

  return {
    content,
    contentLength: content.byteLength,
    datasetName,
    etag: createEtag(content),
    fileName,
    lastModified: stats.mtime.toUTCString(),
  };
}

export function createDatasetService(options: CreateDatasetServiceOptions = {}): DatasetService {
  const datasetDirectory = options.datasetDirectory ?? getDefaultDatasetDirectory();
  const datasetsByFileName = new Map<DatasetFileName, StaticDataset>();
  const datasetFileNames = new Set<string>();

  for (const [datasetName, fileName] of datasetEntries) {
    datasetsByFileName.set(fileName, loadStaticDataset(datasetName, fileName, datasetDirectory));
    datasetFileNames.add(fileName);
  }

  return {
    getLatestDataset(fileName) {
      if (!this.isDatasetFileName(fileName)) {
        return undefined;
      }

      return datasetsByFileName.get(fileName);
    },

    getVersionedDataset(datasetVersion, fileName) {
      if (datasetVersion !== DATASET_VERSION) {
        return undefined;
      }

      return this.getLatestDataset(fileName);
    },

    isDatasetFileName(fileName): fileName is DatasetFileName {
      return datasetFileNames.has(fileName);
    },
  };
}
