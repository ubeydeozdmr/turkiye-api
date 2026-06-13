export type PostalCodeStatusName = string;
export type PostalCodeStatusSelection<Status extends PostalCodeStatusName> = readonly Status[] | undefined;

export interface PostalCodeStatusParseSuccess<Status extends PostalCodeStatusName> {
  readonly ok: true;
  readonly statuses: PostalCodeStatusSelection<Status>;
}

export interface PostalCodeStatusParseFailure {
  readonly ok: false;
  readonly code: string;
  readonly message: string;
}

export type PostalCodeStatusParseResult<Status extends PostalCodeStatusName> =
  | PostalCodeStatusParseSuccess<Status>
  | PostalCodeStatusParseFailure;

export const NEIGHBORHOOD_POSTAL_CODE_STATUSES = ['official', 'derived', 'estimated'] as const;

export const VILLAGE_POSTAL_CODE_STATUSES = ['official', 'estimated'] as const;

export type NeighborhoodPostalCodeStatus = (typeof NEIGHBORHOOD_POSTAL_CODE_STATUSES)[number];
export type VillagePostalCodeStatus = (typeof VILLAGE_POSTAL_CODE_STATUSES)[number];

export interface PostalCodeStatusRow<Status extends PostalCodeStatusName> {
  readonly postalCodeStatus: Status;
}

export function parsePostalCodeStatuses<Status extends PostalCodeStatusName>(
  rawStatuses: string | undefined,
  allowedStatuses: readonly Status[],
): PostalCodeStatusParseResult<Status> {
  if (rawStatuses === undefined) {
    return { ok: true, statuses: undefined };
  }

  const allowedStatusSet = new Set<string>(allowedStatuses);
  const statuses = rawStatuses.split(',').map((status) => status.trim());

  if (statuses.some((status) => status.length === 0)) {
    return {
      ok: false,
      code: 'INVALID_POSTAL_CODE_STATUS',
      message: 'postalCodeStatus must be a comma-separated list of status names.',
    };
  }

  const unknownStatuses = statuses.filter((status) => !allowedStatusSet.has(status));

  if (unknownStatuses.length > 0) {
    return {
      ok: false,
      code: 'INVALID_POSTAL_CODE_STATUS',
      message: `Unknown postalCodeStatus value(s): ${unknownStatuses.join(', ')}.`,
    };
  }

  const uniqueStatuses: Status[] = [];
  const seenStatuses = new Set<string>();

  for (const status of statuses) {
    if (seenStatuses.has(status)) {
      continue;
    }

    seenStatuses.add(status);
    uniqueStatuses.push(status as Status);
  }

  return { ok: true, statuses: uniqueStatuses };
}

export function filterByPostalCodeStatus<Row extends PostalCodeStatusRow<Status>, Status extends PostalCodeStatusName>(
  rows: readonly Row[],
  statuses: PostalCodeStatusSelection<Status>,
): readonly Row[] {
  if (statuses === undefined) {
    return rows;
  }

  return rows.filter((row) => statuses.includes(row.postalCodeStatus));
}
