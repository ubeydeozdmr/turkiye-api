import Type, { type TSchema } from 'typebox';

export const ResponseMetaSchema = Type.Object(
  {
    datasetVersion: Type.String({ minLength: 1 }),
    lastUpdated: Type.String({ minLength: 1 }),
  },
  { additionalProperties: false },
);

export const ListResponseMetaSchema = Type.Object(
  {
    count: Type.Integer({ minimum: 0 }),
    total: Type.Integer({ minimum: 0 }),
    limit: Type.Integer({ minimum: 1 }),
    offset: Type.Integer({ minimum: 0 }),
    datasetVersion: Type.String({ minLength: 1 }),
    lastUpdated: Type.String({ minLength: 1 }),
  },
  { additionalProperties: false },
);

export function DataEnvelopeSchema<Data extends TSchema>(data: Data): TSchema {
  return Type.Object(
    {
      data,
    },
    { additionalProperties: false },
  );
}

export function DataResponseSchema<Data extends TSchema>(data: Data): TSchema {
  return Type.Object(
    {
      data: Type.Partial(data, { additionalProperties: true }),
      meta: ResponseMetaSchema,
    },
    { additionalProperties: false },
  );
}

export function ListResponseSchema<Item extends TSchema>(item: Item): TSchema {
  return Type.Object(
    {
      data: Type.Array(Type.Partial(item)),
      meta: ListResponseMetaSchema,
    },
    { additionalProperties: false },
  );
}

export type ResponseMeta = Type.Static<typeof ResponseMetaSchema>;
export type ListResponseMeta = Type.Static<typeof ListResponseMetaSchema>;
