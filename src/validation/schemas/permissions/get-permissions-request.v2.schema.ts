export const getPermissionsRequest_v2_schema = {
  $defs: {
    payload: {
      type: 'object',
      properties: {
        objectName: {
          type: 'string',
        },
      },
      owners: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      required: ['objectName'],
    }
  },
  oneOf: [
    {
      $ref: '#/$defs/payload',
    },
    {
      type: 'array',
      items: {
        $ref: '#/$defs/payload',
      }
    }
  ],
};
