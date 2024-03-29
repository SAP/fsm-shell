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
    isPreviewActive: {
      type: 'boolean',
    },
    plugin: {},
  },
  required: ['isConfigurationMode'],
};
