import Type from 'typebox';

export const ErrorBodySchema = Type.Object(
  {
    code: Type.String({ minLength: 1 }),
    message: Type.String({ minLength: 1 }),
    status: Type.Integer({ minimum: 400, maximum: 599 }),
  },
  { additionalProperties: false },
);

export const ErrorResponseSchema = Type.Object(
  {
    error: ErrorBodySchema,
  },
  { additionalProperties: false },
);

export type ErrorBody = Type.Static<typeof ErrorBodySchema>;
export type ErrorResponse = Type.Static<typeof ErrorResponseSchema>;
