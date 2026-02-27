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
    plugin: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        url: {
          type: 'string'
        },
        optimalHeight: {
          type: 'string'
        },
        useShellSDK: {
          type: 'boolean'
        },
        isActive: {
          type: 'boolean'
        },
        sandboxPolicies: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        assignmentId: {
          type: 'string'
        }
      },
      required: ['name', 'url', 'isActive']
    },
  },
  required: ['isConfigurationMode'],
};
