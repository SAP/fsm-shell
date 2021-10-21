export const getPermissionsResponse_v1_schema = {
  type: 'object',
  properties: {
    CREATE: {
      type: 'boolean',
    },
    READ: {
      type: 'boolean',
    },
    UPDATE: {
      type: 'boolean',
    },
    DELETE: {
      type: 'boolean',
    },
    UI_PERMISSIONS: {
      type: 'array',
      items: {
        type: 'number',
      },
    },
  },
  required: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'UI_PERMISSIONS'],
};
