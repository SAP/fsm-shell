

export type EventType = 'V1.REQUIRE_CONTEXT' |
  'V1.REQUIRE_CONTEXT_DONE' |
  'V1.CLOSE' |
  'V1.REQUIRE_PERMISSIONS' |
  'V1.GET_PERMISSIONS' |
  'V1.GET_SETTINGS' |
  'V1.GET_STORAGE_ITEM' |
  'V1.SET_STORAGE_ITEM' |
  'V1.START_FLOW' |
  'V1.FLOW_ENDED' |
  'V1.FLOWS.REQUIRE_CONTEXT' |
  'V1.FLOWS.CAN_CONTINUE' |
  'V1.FLOWS.ON_CONTINUE' |
  'V1.FLOWS_TRIGGERS' |
  'V1.SET_VIEW_STATE' |
  string;

export const SHELL_EVENTS = {
  Version1: {
    REQUIRE_CONTEXT: 'V1.REQUIRE_CONTEXT',
    REQUIRE_CONTEXT_DONE: 'V1.REQUIRE_CONTEXT_DONE',
    CLOSE: 'V1.CLOSE',
    REQUIRE_PERMISSIONS: 'V1.REQUIRE_PERMISSIONS',
    GET_PERMISSIONS: 'V1.GET_PERMISSIONS',
    GET_SETTINGS: 'V1.GET_SETTINGS',
    GET_STORAGE_ITEM: 'V1.GET_STORAGE_ITEM',
    SET_STORAGE_ITEM: 'V1.SET_STORAGE_ITEM',
    FLOWS_TRIGGERS: 'V1.FLOWS_TRIGGERS',
    START_FLOW: 'V1.START_FLOW',
    FLOW_ENDED: 'V1.FLOW_ENDED',
    SET_VIEW_STATE: 'V1.SET_VIEW_STATE',
    FLOWS: {
      REQUIRE_CONTEXT: 'V1.FLOWS.REQUIRE_CONTEXT',
      CAN_CONTINUE: 'V1.FLOWS.CAN_CONTINUE',
      ON_CONTINUE: 'V1.FLOWS.ON_CONTINUE'
    }
  },
  ERROR: 'ERROR'
};

const getKeyValues = (source: any, initial: string[] = []): string[] => {
  let result = [ ...initial ];
  for (const key in source) {
    if (typeof source[key] === 'string') {
      result.push(source[key]);
    } else if (typeof source[key] === 'object') {
      result = getKeyValues(source[key], result);
    }
  }
  return result;
}

export const ALL_SHELL_EVENTS_ARRAY: string[] = getKeyValues(SHELL_EVENTS);
