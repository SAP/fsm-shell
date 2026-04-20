export const getOrgDataRequest_v1_schema = {
  type: 'object',
  properties: {
    key: {
      type: 'string',
      enum: ['current_user', 'all'],
    },
  },
  required: ['key'],
};
