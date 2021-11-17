export const getPermissionsRequest_v2_schema = {
  type: 'object',
  properties: {
    objectName: {
      type: 'string',
    },
    owners: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  required: ['objectName'],
};
