export const getSettingsRequest_v1_schema = {
  oneOf: [
    {
       type: 'string'
    },
    {
      type: 'array',
      items: {
        type: ['string', 'array'],
        oneOf: [
          {
            type: 'string'
          },
          {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        ]
      }
    }
  ]
};
