import { type District, type Municipality, type Neighborhood, type Province, type Village } from '../data/index.js';

export type IdMap<Row> = ReadonlyMap<number, Row>;
export type GroupMap<Row> = ReadonlyMap<number, readonly Row[]>;

export interface DatasetIndexes {
  readonly provinceById: IdMap<Province>;
  readonly districtById: IdMap<District>;
  readonly municipalityById: IdMap<Municipality>;
  readonly neighborhoodById: IdMap<Neighborhood>;
  readonly villageById: IdMap<Village>;
  readonly districtsByProvinceId: GroupMap<District>;
  readonly municipalitiesByProvinceId: GroupMap<Municipality>;
  readonly municipalitiesByDistrictId: GroupMap<Municipality>;
  readonly neighborhoodsByProvinceId: GroupMap<Neighborhood>;
  readonly neighborhoodsByDistrictId: GroupMap<Neighborhood>;
  readonly neighborhoodsByMunicipalityId: GroupMap<Neighborhood>;
  readonly villagesByProvinceId: GroupMap<Village>;
  readonly villagesByDistrictId: GroupMap<Village>;
}
