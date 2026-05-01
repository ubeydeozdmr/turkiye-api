import Type from 'typebox';

import { MunicipalityTypeSchema } from './entities.js';

export const CsvStringSchema = Type.String({ minLength: 1 });
export const BooleanStringSchema = Type.Union([Type.Literal('true'), Type.Literal('false')]);
export const SortQuerySchema = Type.Union([
  Type.Literal('id'),
  Type.Literal('-id'),
  Type.Literal('name'),
  Type.Literal('-name'),
  Type.Literal('population'),
  Type.Literal('-population'),
]);

export const PaginationQuerySchema = Type.Object(
  {
    limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 1000, default: 100 })),
    offset: Type.Optional(Type.Integer({ minimum: 0, default: 0 })),
  },
  { additionalProperties: false },
);

export const FieldQuerySchema = Type.Object(
  {
    fields: Type.Optional(CsvStringSchema),
    include: Type.Optional(CsvStringSchema),
  },
  { additionalProperties: false },
);

export const PaginationFieldQuerySchema = Type.Object(
  {
    fields: Type.Optional(CsvStringSchema),
    limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 1000, default: 100 })),
    offset: Type.Optional(Type.Integer({ minimum: 0, default: 0 })),
  },
  { additionalProperties: false },
);

const ListQueryProperties = {
  search: Type.Optional(Type.String({ minLength: 1 })),
  fields: Type.Optional(CsvStringSchema),
  sort: Type.Optional(SortQuerySchema),
  limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 1000, default: 100 })),
  offset: Type.Optional(Type.Integer({ minimum: 0, default: 0 })),
} as const;

const PopulationQueryProperties = {
  minPopulation: Type.Optional(Type.Integer({ minimum: 0 })),
  maxPopulation: Type.Optional(Type.Integer({ minimum: 0 })),
} as const;

const AreaQueryProperties = {
  minArea: Type.Optional(Type.Number({ minimum: 0 })),
  maxArea: Type.Optional(Type.Number({ minimum: 0 })),
} as const;

export const ProvinceListQuerySchema = Type.Object(
  {
    ...ListQueryProperties,
    ...PopulationQueryProperties,
    ...AreaQueryProperties,
    minAltitude: Type.Optional(Type.Number()),
    maxAltitude: Type.Optional(Type.Number()),
    isCoastal: Type.Optional(BooleanStringSchema),
    isMetropolitan: Type.Optional(BooleanStringSchema),
  },
  { additionalProperties: false },
);

export const DistrictListQuerySchema = Type.Object(
  {
    ...ListQueryProperties,
    ...PopulationQueryProperties,
    ...AreaQueryProperties,
    provinceId: Type.Optional(Type.Integer({ minimum: 1 })),
  },
  { additionalProperties: false },
);

export const MunicipalityListQuerySchema = Type.Object(
  {
    ...ListQueryProperties,
    ...PopulationQueryProperties,
    provinceId: Type.Optional(Type.Integer({ minimum: 1 })),
    districtId: Type.Optional(Type.Integer({ minimum: 1 })),
    type: Type.Optional(MunicipalityTypeSchema),
  },
  { additionalProperties: false },
);

export const NeighborhoodListQuerySchema = Type.Object(
  {
    ...ListQueryProperties,
    ...PopulationQueryProperties,
    provinceId: Type.Optional(Type.Integer({ minimum: 1 })),
    districtId: Type.Optional(Type.Integer({ minimum: 1 })),
    municipalityId: Type.Optional(Type.Integer({ minimum: 1 })),
  },
  { additionalProperties: false },
);

export const VillageListQuerySchema = Type.Object(
  {
    ...ListQueryProperties,
    ...PopulationQueryProperties,
    provinceId: Type.Optional(Type.Integer({ minimum: 1 })),
    districtId: Type.Optional(Type.Integer({ minimum: 1 })),
  },
  { additionalProperties: false },
);

export const ProvinceParamsSchema = Type.Object(
  {
    provinceId: Type.Integer({ minimum: 1 }),
  },
  { additionalProperties: false },
);

export const DistrictParamsSchema = Type.Object(
  {
    districtId: Type.Integer({ minimum: 1 }),
  },
  { additionalProperties: false },
);

export const MunicipalityParamsSchema = Type.Object(
  {
    municipalityId: Type.Integer({ minimum: 1 }),
  },
  { additionalProperties: false },
);

export const NeighborhoodParamsSchema = Type.Object(
  {
    neighborhoodId: Type.Integer({ minimum: 1 }),
  },
  { additionalProperties: false },
);

export const VillageParamsSchema = Type.Object(
  {
    villageId: Type.Integer({ minimum: 1 }),
  },
  { additionalProperties: false },
);

export type ProvinceListQuery = Type.Static<typeof ProvinceListQuerySchema>;
export type DistrictListQuery = Type.Static<typeof DistrictListQuerySchema>;
export type MunicipalityListQuery = Type.Static<typeof MunicipalityListQuerySchema>;
export type NeighborhoodListQuery = Type.Static<typeof NeighborhoodListQuerySchema>;
export type VillageListQuery = Type.Static<typeof VillageListQuerySchema>;
export type FieldQuery = Type.Static<typeof FieldQuerySchema>;
export type PaginationFieldQuery = Type.Static<typeof PaginationFieldQuerySchema>;
export type ProvinceParams = Type.Static<typeof ProvinceParamsSchema>;
export type DistrictParams = Type.Static<typeof DistrictParamsSchema>;
export type MunicipalityParams = Type.Static<typeof MunicipalityParamsSchema>;
export type NeighborhoodParams = Type.Static<typeof NeighborhoodParamsSchema>;
export type VillageParams = Type.Static<typeof VillageParamsSchema>;
