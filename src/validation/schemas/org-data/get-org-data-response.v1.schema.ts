export const getOrgDataResponse_v1_schema = {
  $defs: {
    orgLevel: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        externalId: { type: ['string', 'null'] },
        name: { type: 'string' },
        shortDescription: { type: ['string', 'null'] },
        longDescription: { type: ['string', 'null'] },
        validFrom: { type: ['string', 'null'] },
        validTo: { type: ['string', 'null'] },
        status: { type: 'string', enum: ['ENABLED', 'DISABLED'] },
        subLevels: {
          type: 'array',
          items: { $ref: '#/$defs/orgLevel' },
        },
      },
      required: ['id', 'name', 'status'],
    },
    orgLevelWithoutSubLevels: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        externalId: { type: ['string', 'null'] },
        name: { type: 'string' },
        shortDescription: { type: ['string', 'null'] },
        longDescription: { type: ['string', 'null'] },
        validFrom: { type: ['string', 'null'] },
        validTo: { type: ['string', 'null'] },
        status: { type: 'string', enum: ['ENABLED', 'DISABLED'] },
      },
      required: ['id', 'name', 'status'],
    },
    orgLevelAllocation: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        externalId: { type: ['string', 'null'] },
        level: { $ref: '#/$defs/orgLevelWithoutSubLevels' },
        role: { type: 'string', enum: ['MEMBER', 'MANAGER'] },
        unifiedPersonId: { type: 'string' },
      },
      required: ['id', 'level', 'role', 'unifiedPersonId'],
    },
  },
  type: 'object',
  properties: {
    key: {
      type: 'string',
      enum: ['current_user', 'all'],
    },
    data: {
      oneOf: [
        { $ref: '#/$defs/orgLevel' },
        {
          type: 'array',
          items: { $ref: '#/$defs/orgLevelAllocation' },
        },
      ],
    },
  },
  required: ['key', 'data'],
};
