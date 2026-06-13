import { normalizeText } from './normalize-text.js';

export type SortDirection = 'asc' | 'desc';

export interface NamedRow {
  readonly name: string;
}

export function compareByName<Row extends NamedRow>(left: Row, right: Row, direction: SortDirection = 'asc'): number {
  const leftName = normalizeText(left.name);
  const rightName = normalizeText(right.name);
  const result = leftName.localeCompare(rightName, 'tr-TR');

  return direction === 'asc' ? result : -result;
}

export function sortByName<Row extends NamedRow>(
  rows: readonly Row[],
  direction: SortDirection = 'asc',
): readonly Row[] {
  return [...rows].sort((left, right) => compareByName(left, right, direction));
}
