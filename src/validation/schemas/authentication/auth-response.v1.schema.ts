export const authResponse_v1_schema = {
  type: 'object',
  properties: {
    access_token: {
      type: 'string',
    },
    expires_in: {
      type: 'number',
    },
    token_type: {
      type: 'string',
    },
  },
  required: ['access_token', 'expires_in', 'token_type'],
};
