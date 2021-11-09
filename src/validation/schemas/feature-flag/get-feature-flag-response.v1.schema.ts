export const getFeatureFlagResponse_v1_schema = {
  type: 'object',
  properties: {
    key: {
      type: 'string',
    },
    value: {
      type: 'boolean',
    },
  },
  required: ['key', 'value'],
};
