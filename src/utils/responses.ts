import { DATASET_LAST_UPDATED, DATASET_VERSION } from '../data/index.js';
import { type ListResponseMeta, type ResponseMeta } from '../schemas/index.js';

export interface ApiDataResponse<Data> {
  readonly data: Data;
  readonly meta: ResponseMeta;
}

export interface ApiDataEnvelope<Data> {
  readonly data: Data;
}

export interface ApiListResponse<Item> {
  readonly data: readonly Item[];
  readonly meta: ListResponseMeta;
}

export function createResponseMeta(): ResponseMeta {
  return {
    datasetVersion: DATASET_VERSION,
    lastUpdated: DATASET_LAST_UPDATED,
  };
}

export function createDataResponse<Data>(data: Data): ApiDataResponse<Data> {
  return {
    data,
    meta: createResponseMeta(),
  };
}

export function createDataEnvelope<Data>(data: Data): ApiDataEnvelope<Data> {
  return { data };
}

export function createListResponse<Item>(
  items: readonly Item[],
  pagination: Pick<ListResponseMeta, 'limit' | 'offset'>,
  total = items.length,
): ApiListResponse<Item> {
  return {
    data: items,
    meta: {
      count: items.length,
      total,
      limit: pagination.limit,
      offset: pagination.offset,
      ...createResponseMeta(),
    },
  };
}
