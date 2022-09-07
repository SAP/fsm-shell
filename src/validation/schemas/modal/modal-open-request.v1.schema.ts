export const modalOpenRequest_v1_schema = {
  type: 'object',
  properties: {
    url: {
      type: 'string',
    },
    modalSettings: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
        size: {
          type: 'string',
          enum: ['l', 'm', 's'],
        },
        backdropClickCloseable: {
          type: 'boolean',
        },
        isScrollbarHidden: {
          type: 'boolean',
        },
      },
    },
  },
  data: {
    type: 'object',
  },
  required: ['url'],
};
