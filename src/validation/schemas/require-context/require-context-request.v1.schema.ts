import { authRequest_v1_schema } from '../authentication/auth-request.v1.schema';

export const requireContextRequest_v1_schema = {
  type: 'object',
  properties: {
    clientIdentifier: {
      type: 'string',
    },
    clientSecret: {
      type: 'string',
    },
    cloudStorageKeys: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string'
          },
          dataVersion: {
            type: 'number'
          },
          companyDependent: {
            type: 'boolean'
          }
        },
        required: [
          'name',
          'dataVersion',
          'companyDependent'
        ]
      },
    },
    auth: authRequest_v1_schema,
    targetOutletName: {
      type: 'string',
    },
  },
  required: ['clientIdentifier', 'clientSecret'],
};
