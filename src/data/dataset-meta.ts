import { type DatasetName } from './types.js';

export const DATASET_VERSION = '2025';
export const DATASET_LAST_UPDATED = '2026-05-01';

export const DATASET_SOURCE = {
  name: 'TÜİK MEDAS',
  url: 'https://biruni.tuik.gov.tr/medas',
} as const;

export const POSTAL_CODE_SOURCE = {
  name: 'PTT Kargo',
  url: 'https://www.ptt.gov.tr/posta-kodu',
} as const;

export const AREA_SOURCE = {
  name: 'T.C. MSB Harita Genel Müdürlüğü',
  url: 'https://web.archive.org/web/20190416051733/https://www.harita.gov.tr/images/urun/il_ilce_alanlari.pdf',
} as const;

export const EXPECTED_DATASET_COUNTS = {
  provinces: 81,
  districts: 973,
  municipalities: 1377,
  neighborhoods: 32254,
  villages: 18183,
} as const satisfies Record<DatasetName, number>;

export interface DatasetMeta {
  readonly apiVersion: string;
  readonly datasetVersion: string;
  readonly lastUpdated: string;
  readonly sources: readonly [typeof DATASET_SOURCE, typeof POSTAL_CODE_SOURCE, typeof AREA_SOURCE];
  readonly counts: typeof EXPECTED_DATASET_COUNTS;
}

export const DATASET_META = {
  apiVersion: '2.0.0',
  datasetVersion: DATASET_VERSION,
  lastUpdated: DATASET_LAST_UPDATED,
  sources: [DATASET_SOURCE, POSTAL_CODE_SOURCE, AREA_SOURCE],
  counts: EXPECTED_DATASET_COUNTS,
} as const satisfies DatasetMeta;
