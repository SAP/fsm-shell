export const modalOpenRequest_v2_schema = {
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
        showTitleHeader: {
          type: 'boolean',
        },

        hasBackdrop: {
          type: 'boolean',
        },
        backdropClickCloseable: {
          type: 'boolean',
        },
        escKeyCloseable: {
          type: 'boolean',
        },
        focusTrapped: {
          type: 'boolean',
        },
        fullScreen: {
          type: 'boolean',
        },
        mobile: {
          type: 'boolean',
        },
        mobileOuterSpacing: {
          type: 'boolean',
        },
        draggable: {
          type: 'boolean',
        },
        resizable: {
          type: 'boolean',
        },

        width: {
          type: 'string',
        },
        height: {
          type: 'string',
        },
        minHeight: {
          type: 'string',
        },
        maxHeight: {
          type: 'string',
        },
        minWidth: {
          type: 'string',
        },
        maxWidth: {
          type: 'string',
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
