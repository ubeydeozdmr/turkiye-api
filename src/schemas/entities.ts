import Type from 'typebox';

export const IdSchema = Type.Integer({ minimum: 1 });
export const CountSchema = Type.Integer({ minimum: 0 });
export const PopulationSchema = Type.Integer({ minimum: 0 });
export const NameSchema = Type.String({ minLength: 1 });
export const SlugSchema = Type.String({ minLength: 1 });
export const PostalCodeSchema = Type.String({ pattern: '^[0-9]{5}$' });

export const AreaSchema = Type.Object(
  {
    value: Type.Number({ minimum: 0 }),
    unit: Type.Literal('km2'),
  },
  { additionalProperties: false },
);

export const AltitudeSchema = Type.Object(
  {
    value: Type.Number(),
    unit: Type.Literal('m'),
  },
  { additionalProperties: false },
);

export const CoordinatesSchema = Type.Object(
  {
    latitude: Type.Number({ minimum: -90, maximum: 90 }),
    longitude: Type.Number({ minimum: -180, maximum: 180 }),
  },
  { additionalProperties: false },
);

export const RegionSchema = Type.Object(
  {
    tr: NameSchema,
    en: NameSchema,
  },
  { additionalProperties: false },
);

export const ProvinceStatsSchema = Type.Object(
  {
    districtCount: CountSchema,
    municipalityCount: CountSchema,
    neighborhoodCount: CountSchema,
    villageCount: CountSchema,
  },
  { additionalProperties: false },
);

export const DistrictStatsSchema = Type.Object(
  {
    municipalityCount: CountSchema,
    neighborhoodCount: CountSchema,
    villageCount: CountSchema,
  },
  { additionalProperties: false },
);

export const MunicipalityStatsSchema = Type.Object(
  {
    neighborhoodCount: CountSchema,
  },
  { additionalProperties: false },
);

export const MunicipalityTypeSchema = Type.Union([
  Type.Literal('province_center'),
  Type.Literal('district_center'),
  Type.Literal('town'),
]);

export const ProvinceSchema = Type.Object(
  {
    id: IdSchema,
    name: NameSchema,
    slug: SlugSchema,
    population: PopulationSchema,
    area: AreaSchema,
    altitude: AltitudeSchema,
    phoneAreaCodes: Type.Array(Type.Integer({ minimum: 1 }), { minItems: 1 }),
    isCoastal: Type.Boolean(),
    isMetropolitan: Type.Boolean(),
    region: RegionSchema,
    coordinates: CoordinatesSchema,
    stats: ProvinceStatsSchema,
  },
  { additionalProperties: false },
);

export const DistrictSchema = Type.Object(
  {
    id: IdSchema,
    name: NameSchema,
    slug: SlugSchema,
    provinceId: IdSchema,
    population: PopulationSchema,
    area: AreaSchema,
    stats: DistrictStatsSchema,
  },
  { additionalProperties: false },
);

export const MunicipalitySchema = Type.Object(
  {
    id: IdSchema,
    name: NameSchema,
    slug: SlugSchema,
    type: MunicipalityTypeSchema,
    provinceId: IdSchema,
    districtId: IdSchema,
    population: PopulationSchema,
    stats: MunicipalityStatsSchema,
  },
  { additionalProperties: false },
);

export const NeighborhoodSchema = Type.Object(
  {
    id: IdSchema,
    name: NameSchema,
    slug: SlugSchema,
    provinceId: IdSchema,
    districtId: IdSchema,
    municipalityId: IdSchema,
    population: PopulationSchema,
    postalCode: PostalCodeSchema,
    postalCodeStatus: Type.Union([Type.Literal('official'), Type.Literal('derived'), Type.Literal('estimated')]),
  },
  { additionalProperties: false },
);

export const VillageSchema = Type.Object(
  {
    id: IdSchema,
    name: NameSchema,
    slug: SlugSchema,
    provinceId: IdSchema,
    districtId: IdSchema,
    population: PopulationSchema,
    postalCode: PostalCodeSchema,
    postalCodeStatus: Type.Union([Type.Literal('official'), Type.Literal('estimated')]),
  },
  { additionalProperties: false },
);

export type Province = Type.Static<typeof ProvinceSchema>;
export type District = Type.Static<typeof DistrictSchema>;
export type Municipality = Type.Static<typeof MunicipalitySchema>;
export type Neighborhood = Type.Static<typeof NeighborhoodSchema>;
export type Village = Type.Static<typeof VillageSchema>;
