export const getFeatureFlagRequest_v1_schema = {
  $defs: {
    payload: {
      type: 'object',
      properties: {
        key: {
          type: 'string'
        },
        defaultValue: {
          type: 'boolean'
        }
      },
      required: ['key', 'defaultValue']
    }
  },
  anyOf: [
    {
      $ref: '#/$defs/payload'
    },
    {
      type: 'array',
      items: {
        $ref: '#/$defs/payload'
      }
    }
  ]
};
