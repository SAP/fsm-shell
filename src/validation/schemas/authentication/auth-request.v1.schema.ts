export const authRequest_v1_schema = {
  type: 'object',
  properties: {
    response_type: {
      type: 'string',
      enum: ['token', 'code'],
    },
  },
  required: ['response_type'],
};
