export interface QueryValidationSuccess {
  readonly ok: true;
}

export interface QueryValidationFailure {
  readonly ok: false;
  readonly code: string;
  readonly message: string;
}

export type QueryValidationResult = QueryValidationSuccess | QueryValidationFailure;

export const validQuery: QueryValidationSuccess = { ok: true };

type RangeFilterKey = 'minPopulation' | 'maxPopulation' | 'minArea' | 'maxArea' | 'minAltitude' | 'maxAltitude';

type RangeFilterName = 'population' | 'area' | 'altitude';

interface RangeFilterPair {
  readonly name: RangeFilterName;
  readonly min: RangeFilterKey;
  readonly max: RangeFilterKey;
}

const RANGE_FILTERS: Record<RangeFilterName, RangeFilterPair> = {
  population: { name: 'population', min: 'minPopulation', max: 'maxPopulation' },
  area: { name: 'area', min: 'minArea', max: 'maxArea' },
  altitude: { name: 'altitude', min: 'minAltitude', max: 'maxAltitude' },
};

export type NumericRangeQuery = Partial<Record<RangeFilterKey, number>>;

export function validateRangeFilters(
  query: NumericRangeQuery,
  filterNames: readonly RangeFilterName[],
): QueryValidationResult {
  for (const filterName of filterNames) {
    const filter = RANGE_FILTERS[filterName];
    const minValue = query[filter.min];
    const maxValue = query[filter.max];

    if (minValue !== undefined && maxValue !== undefined && minValue > maxValue) {
      return {
        ok: false,
        code: 'INVALID_RANGE_FILTER',
        message: `${filter.min} must be less than or equal to ${filter.max}.`,
      };
    }
  }

  return validQuery;
}
