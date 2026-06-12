import crypto from 'node:crypto';
import fs from 'node:fs';

import {
  DATASET_FILENAMES,
  DATASET_VERSION,
  getDatasetFilePath,
  getDefaultDatasetDirectory,
  getVersionedDatasetDirectory,
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
  const latestDatasetsByFileName = new Map<DatasetFileName, StaticDataset>();
  const versionedDatasetsByVersion = new Map<string, ReadonlyMap<DatasetFileName, StaticDataset>>();
  const datasetFileNames = new Set<string>();

  for (const [datasetName, fileName] of datasetEntries) {
    latestDatasetsByFileName.set(fileName, loadStaticDataset(datasetName, fileName, datasetDirectory));
    datasetFileNames.add(fileName);
  }

  const currentVersionDirectory = getVersionedDatasetDirectory(DATASET_VERSION, datasetDirectory);
  const currentVersionDatasetsByFileName = new Map<DatasetFileName, StaticDataset>();

  for (const [datasetName, fileName] of datasetEntries) {
    currentVersionDatasetsByFileName.set(fileName, loadStaticDataset(datasetName, fileName, currentVersionDirectory));
  }

  versionedDatasetsByVersion.set(DATASET_VERSION, currentVersionDatasetsByFileName);

  return {
    getLatestDataset(fileName) {
      if (!datasetFileNames.has(fileName)) {
        return undefined;
      }

      return latestDatasetsByFileName.get(fileName as DatasetFileName);
    },

    getVersionedDataset(datasetVersion, fileName) {
      if (!datasetFileNames.has(fileName)) {
        return undefined;
      }

      return versionedDatasetsByVersion.get(datasetVersion)?.get(fileName as DatasetFileName);
    },

    isDatasetFileName(fileName): fileName is DatasetFileName {
      return datasetFileNames.has(fileName);
    },
  };
}
