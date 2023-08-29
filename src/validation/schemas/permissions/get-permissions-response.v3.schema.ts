import { getPermissionsResponse_v1_schema } from './get-permissions-response.v1.schema';

export const getPermissionsResponse_v3_schema = {
  type: 'object',
  properties: {
    objectName: {
      type: 'string',
    },
    permission: getPermissionsResponse_v1_schema,
  },
  required: ['objectName', 'permission'],
};
