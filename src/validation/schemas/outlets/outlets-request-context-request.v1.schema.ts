export const outletsRequestContextRequest_v1_schema = {
  type: 'object',
  properties: {
    target: {
      type: 'string',
    },
    assignmentId: {
      type: 'string',
    },
    showMocks: {
      type: 'boolean',
    },
    outletSettings: {},
  },
  required: ['target'],
};
