export const outletsRequestDynamicContextResponse_v1_schema = {
  $defs: {
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
      required: ['name', 'url', 'isActive', 'assignmentId']
    }
  },
  type: 'object',
  properties: {
    target: {
      type: 'string'
    },
    isRootNodeHttps: {
      type: 'boolean'
    },
    isConfigurationMode: {
      type: 'boolean'
    },
    areDynamicOutletsEnabled: {
      type: 'boolean'
    },
    isPreviewActive: {
      type: 'boolean'
    },
    plugins: {
      type: 'array',
      items: {
        $ref: '#/$defs/plugin'
      }
    }
  },
  required: []
};
