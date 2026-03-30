export const getPermissionsRequest_v3_schema = {
  $defs: {
    payload: {
      type: 'object',
      properties: {
        objectName: {
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
