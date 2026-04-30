import { type District, type Municipality, type Neighborhood, type Province, type Village } from '../data/index.js';

export type FieldName<Row> = Extract<keyof Row, string>;
export type FieldSelection<Row> = readonly FieldName<Row>[];

export interface FieldParseSuccess<Row> {
  readonly ok: true;
  readonly fields: FieldSelection<Row> | undefined;
}

export interface FieldParseFailure {
  readonly ok: false;
  readonly message: string;
}

export type FieldParseResult<Row> = FieldParseSuccess<Row> | FieldParseFailure;

export const PROVINCE_FIELDS = [
  'id',
  'name',
  'slug',
  'population',
  'area',
  'altitude',
  'phoneAreaCodes',
  'isCoastal',
  'isMetropolitan',
  'region',
  'coordinates',
  'stats',
] as const satisfies readonly FieldName<Province>[];

export const DISTRICT_FIELDS = [
  'id',
  'name',
  'slug',
  'provinceId',
  'population',
  'area',
  'stats',
] as const satisfies readonly FieldName<District>[];

export const MUNICIPALITY_FIELDS = [
  'id',
  'name',
  'slug',
  'type',
  'provinceId',
  'districtId',
  'population',
  'stats',
] as const satisfies readonly FieldName<Municipality>[];

export const NEIGHBORHOOD_FIELDS = [
  'id',
  'name',
  'slug',
  'provinceId',
  'districtId',
  'municipalityId',
  'population',
  'postalCode',
] as const satisfies readonly FieldName<Neighborhood>[];

export const VILLAGE_FIELDS = [
  'id',
  'name',
  'slug',
  'provinceId',
  'districtId',
  'population',
  'postalCode',
] as const satisfies readonly FieldName<Village>[];

export function parseFields<Row>(
  rawFields: string | undefined,
  allowedFields: readonly FieldName<Row>[],
): FieldParseResult<Row> {
  if (rawFields === undefined) {
    return { ok: true, fields: undefined };
  }

  const allowedFieldSet = new Set<string>(allowedFields);
  const fields = rawFields.split(',').map((field) => field.trim());

  if (fields.some((field) => field.length === 0)) {
    return {
      ok: false,
      message: 'fields must be a comma-separated list of field names.',
    };
  }

  const unknownFields = fields.filter((field) => !allowedFieldSet.has(field));

  if (unknownFields.length > 0) {
    return {
      ok: false,
      message: `Unknown field(s): ${unknownFields.join(', ')}.`,
    };
  }

  const uniqueFields: FieldName<Row>[] = [];
  const seenFields = new Set<string>();

  for (const field of fields) {
    if (seenFields.has(field)) {
      continue;
    }

    seenFields.add(field);
    uniqueFields.push(field as FieldName<Row>);
  }

  return {
    ok: true,
    fields: uniqueFields,
  };
}

export function projectFields<Row extends object>(
  row: Row,
  fields: FieldSelection<Row> | undefined,
): Row | Partial<Row> {
  if (fields === undefined) {
    return row;
  }

  const projected: Partial<Row> = {};

  for (const field of fields) {
    projected[field] = row[field];
  }

  return projected;
}

export function projectFieldsList<Row extends object>(
  rows: readonly Row[],
  fields: FieldSelection<Row> | undefined,
): readonly (Row | Partial<Row>)[] {
  if (fields === undefined) {
    return rows;
  }

  return rows.map((row) => projectFields(row, fields));
}
