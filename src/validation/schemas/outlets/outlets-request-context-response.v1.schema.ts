export const outletsRequestContextResponse_v1_schema = {
  type: 'object',
  properties: {
    target: {
      type: 'string',
    },
    isRootNodeHttps: {
      type: 'boolean',
    },
    isConfigurationMode: {
      type: 'boolean',
    },
    plugin: {},
  },
  required: ['target', 'isRootNodeHttps'],
};
