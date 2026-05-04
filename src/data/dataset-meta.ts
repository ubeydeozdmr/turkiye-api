import { type DatasetName } from './types.js';

export const DATASET_VERSION = '2025';
export const DATASET_LAST_UPDATED = '2026-05-04';

export const DATASET_SOURCE = {
  name: 'TÜİK MEDAS',
  url: 'https://biruni.tuik.gov.tr/medas',
  description: {
    tr: 'Veri seti iskeletinin kaynağını oluşturur. Yerleşim birimlerinin id, name (ad) ve population (nüfus) bilgilerinin kaynağıdır.',
    en: 'Forms the skeleton of the dataset. It is the source of id, name, and population information for settlements.',
  },
} as const;

export const POSTAL_CODE_SOURCE = {
  name: 'PTT Kargo',
  url: 'https://www.ptt.gov.tr/posta-kodu',
  description: {
    tr: "PTT Kargo'nun sağladığı resmi posta kodu veri kaynağıdır.",
    en: 'The official postal code data source provided by PTT Kargo.',
  },
} as const;

export const AREA_SOURCE = {
  name: 'T.C. MSB Harita Genel Müdürlüğü',
  url: 'https://web.archive.org/web/20190416051733/https://www.harita.gov.tr/images/urun/il_ilce_alanlari.pdf',
  description: {
    tr: 'T.C. Milli Savunma Bakanlığı Harita Genel Müdürlüğü tarafından sağlanan resmi alan verisi kaynağıdır.',
    en: 'The official area data source provided by the General Directorate of Mapping of the Ministry of National Defense of Turkey.',
  },
} as const;

export const COORDINATE_SOURCE = {
  name: 'OpenStreetMap',
  url: 'https://www.openstreetmap.org',
  description: {
    tr: 'OpenStreetMap sitesindeki admin_centre noktaları kaynak olarak alınmıştır, bu noktalar ise şehir merkezleri baz alınarak belirlenir.',
    en: 'The admin_centre points on the OpenStreetMap site were taken as a source, and these points are determined based on city centers.',
  },
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
  readonly sources: readonly [
    typeof DATASET_SOURCE,
    typeof POSTAL_CODE_SOURCE,
    typeof AREA_SOURCE,
    typeof COORDINATE_SOURCE,
  ];
  readonly counts: typeof EXPECTED_DATASET_COUNTS;
}

export const DATASET_META = {
  apiVersion: '2.0.0',
  datasetVersion: DATASET_VERSION,
  lastUpdated: DATASET_LAST_UPDATED,
  sources: [DATASET_SOURCE, POSTAL_CODE_SOURCE, AREA_SOURCE, COORDINATE_SOURCE],
  counts: EXPECTED_DATASET_COUNTS,
} as const satisfies DatasetMeta;
