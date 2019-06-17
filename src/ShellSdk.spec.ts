
import { ShellSdk } from './ShellSdk';
import { SHELL_EVENTS } from './ShellEvents';
import { SHELL_ACTIONS, ActionType } from './ShellActions';
import * as sinon from 'sinon';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/;

describe('Shell Sdk', () => {

  let sdk: ShellSdk;
  let sdkTarget: any;
  let sdkOrigin: string;
  let data: any;

  let windowMock: any;
  let windowMockEventListenerAdded: boolean;
  let windowMockEventType: string;
  let windowMockCallback: Function;

  beforeEach(() => {
    windowMock = {
      addEventListener: (eventType, callback) => {
        windowMockEventListenerAdded = true;
        windowMockEventType = eventType;
        windowMockCallback = callback
      }
    }

    sdkOrigin = 'fsm-sdk.net';

    sdkTarget = {
      postMessage: sinon.stub()
    };
    data = { message: 'test' };
  });

  it('should create instance', () => {
    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);
    expect(sdk).toBeDefined();
  });

  it('should return same instance', () => {
    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);
    const sdkCopy = ShellSdk.instance;
    expect(sdk).toEqual(sdkCopy);
  });

  it('should post message on emit', () => {
    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);
    sdk.emit(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, data);

    const arg1 = sdkTarget.postMessage.getCall(0).args[0];
    const arg2 = sdkTarget.postMessage.getCall(0).args[1];

    sinon.assert.calledOnce(sdkTarget.postMessage);
    expect(arg1.type).toBe(SHELL_EVENTS.Version1.REQUIRE_CONTEXT);
    expect(arg1.value.message).toBe('test');
    expect(arg2).toBe(sdkOrigin);
  });

  it('should post message on action', () => {
    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);
    sdk.action(SHELL_ACTIONS.Version1.GET_STORAGE_ITEM as ActionType, 'test_key');

    const arg1 = sdkTarget.postMessage.getCall(0).args[0];
    const arg2 = sdkTarget.postMessage.getCall(0).args[1];

    sinon.assert.calledOnce(sdkTarget.postMessage);
    expect(arg1.type).toBe(SHELL_EVENTS.Version1.SEND_ACTION);
    expect(UUID_REGEX.test(arg1.value.id)).toEqual(true);
    expect(arg1.value.type).toEqual(SHELL_ACTIONS.Version1.GET_STORAGE_ITEM);
    expect(arg1.value.payload).toEqual('test_key');
    expect(arg2).toBe(sdkOrigin);
  });

  it('should handle successfull action response', done => {

    let actionId: string;

    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);
    sdk.action(SHELL_ACTIONS.Version1.GET_STORAGE_ITEM as ActionType, 'test_key')
      .then(result => {
        expect(result).toEqual('test_key_value');
        done();
      });

    sinon.assert.calledOnce(sdkTarget.postMessage);
    const arg1 = sdkTarget.postMessage.getCall(0).args[0];

    actionId = arg1.value.id;

    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.SEND_ACTION_RESULT,
        value: {
          id: actionId,
          payload: 'test_key_value'
        }
      }
    });
  
  });

  it('should add message listener', () => {
    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);
    expect(windowMockEventListenerAdded).toBe(true);
    expect(windowMockEventType).toBe('message'),
    expect(windowMockCallback).toBeDefined();
  });

  it('should call subscriber on message event', (done) => {
    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);
    sdk.on(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, (value) => {
      expect(value.message).toBe('test data');
      done();
    });
    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.REQUIRE_CONTEXT,
        value: {
          message: 'test data'
        }
      }
    });
  });

  it('should call multiple subscribers on message event', () => {
    let handler1Called: boolean = false;
    let handler2Called: boolean = false;

    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);

    sdk.on(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, () => {
      handler1Called = true;
    });

    sdk.on(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, () => {
      handler2Called = true;
    });

    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.REQUIRE_CONTEXT,
        value: {
          message: 'test data'
        }
      }
    });

    expect(handler1Called).toBe(true);
    expect(handler2Called).toBe(true);
  });

  it('should be able to remove subscriber', () => {
    let handler1Called: boolean = false;
    let handler2Called: boolean = false;

    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);

    const unsubscriber = sdk.on(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, () => {
      handler1Called = true;
    });

    sdk.on(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, () => {
      handler2Called = true;
    });

    unsubscriber();
    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.REQUIRE_CONTEXT,
        value: {
          message: 'test data'
        }
      }
    });

    expect(handler1Called).toBe(false);
    expect(handler2Called).toBe(true);
  });

});
