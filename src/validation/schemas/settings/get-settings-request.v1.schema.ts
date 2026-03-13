export const getSettingsRequest_v1_schema = {
  anyOf: [
    {
       type: 'string'
    },
    {
      type: 'array',
      items: {
        type: ['string', 'array'],
        anyOf: [
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
