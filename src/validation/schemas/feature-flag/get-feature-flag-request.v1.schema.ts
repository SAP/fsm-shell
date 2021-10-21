export const getFeatureFlagRequest_v1_schema = {
  type: 'object',
  properties: {
    key: {
      type: 'string',
    },
    defaultValue: {
      type: 'boolean',
    },
  },
  required: ['key', 'defaultValue'],
};
