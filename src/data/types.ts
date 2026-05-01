export type MunicipalityType = 'province_center' | 'district_center' | 'town';

export interface UnitValue<Unit extends string> {
  readonly value: number;
  readonly unit: Unit;
}

export interface Coordinates {
  readonly latitude: number;
  readonly longitude: number;
}

export interface RegionName {
  readonly tr: string;
  readonly en: string;
}

export interface ProvinceStats {
  readonly districtCount: number;
  readonly municipalityCount: number;
  readonly neighborhoodCount: number;
  readonly villageCount: number;
}

export interface DistrictStats {
  readonly municipalityCount: number;
  readonly neighborhoodCount: number;
  readonly villageCount: number;
}

export interface MunicipalityStats {
  readonly neighborhoodCount: number;
}

export interface Province {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly population: number;
  readonly area: UnitValue<'km2'>;
  readonly altitude: UnitValue<'m'>;
  readonly phoneAreaCodes: readonly number[];
  readonly isCoastal: boolean;
  readonly isMetropolitan: boolean;
  readonly region: RegionName;
  readonly coordinates: Coordinates;
  readonly stats: ProvinceStats;
}

export interface District {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly provinceId: number;
  readonly population: number;
  readonly area: UnitValue<'km2'>;
  readonly stats: DistrictStats;
}

export interface Municipality {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly type: MunicipalityType;
  readonly provinceId: number;
  readonly districtId: number;
  readonly population: number;
  readonly stats: MunicipalityStats;
}

export interface Neighborhood {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly provinceId: number;
  readonly districtId: number;
  readonly municipalityId: number;
  readonly population: number;
  readonly postalCode: string | null;
}

export interface Village {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly provinceId: number;
  readonly districtId: number;
  readonly population: number;
  readonly postalCode: string | null;
}

export interface Datasets {
  readonly provinces: readonly Province[];
  readonly districts: readonly District[];
  readonly municipalities: readonly Municipality[];
  readonly neighborhoods: readonly Neighborhood[];
  readonly villages: readonly Village[];
}

export type DatasetName = keyof Datasets;

export type DatasetRow<Name extends DatasetName> = Datasets[Name][number];
