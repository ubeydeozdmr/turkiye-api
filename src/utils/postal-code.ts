export interface PostalCodeQuery {
  readonly postalCode?: string;
  readonly postalCodePrefix?: string;
}

export interface PostalCodeRow {
  readonly postalCode: string;
}

export function filterByPostalCodeQuery<Row extends PostalCodeRow>(
  rows: readonly Row[],
  query: PostalCodeQuery,
): readonly Row[] {
  return rows.filter((row) => {
    if (query.postalCode !== undefined && row.postalCode !== query.postalCode) {
      return false;
    }

    if (query.postalCodePrefix !== undefined && !row.postalCode.startsWith(query.postalCodePrefix)) {
      return false;
    }

    return true;
  });
}
