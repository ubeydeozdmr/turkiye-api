import Type from 'typebox';

export const DatasetMetaSchema = Type.Object(
  {
    apiVersion: Type.String({ minLength: 1 }),
    datasetVersion: Type.String({ minLength: 1 }),
    lastUpdated: Type.String({ minLength: 1 }),
    sources: Type.Array(
      Type.Object(
        {
          name: Type.String({ minLength: 1 }),
          url: Type.String({ minLength: 1 }),
          description: Type.Object({
            tr: Type.String({ minLength: 1 }),
            en: Type.String({ minLength: 1 }),
          }),
        },
        { additionalProperties: false },
      ),
    ),
    counts: Type.Object(
      {
        provinces: Type.Integer({ minimum: 0 }),
        districts: Type.Integer({ minimum: 0 }),
        municipalities: Type.Integer({ minimum: 0 }),
        neighborhoods: Type.Integer({ minimum: 0 }),
        villages: Type.Integer({ minimum: 0 }),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export type DatasetMetaResponse = Type.Static<typeof DatasetMetaSchema>;
