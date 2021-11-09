import { getPermissionsResponse_v1_schema } from './get-permissions-response.v1.schema';

export const getPermissionsResponse_v2_schema = {
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
    permission: getPermissionsResponse_v1_schema,
  },
  required: ['objectName', 'permission'],
};
