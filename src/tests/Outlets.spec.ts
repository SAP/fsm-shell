
import { ShellSdk } from '../ShellSdk';
import { SHELL_EVENTS } from '../ShellEvents';
import * as sinon from 'sinon';

describe('Outlets', () => {

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
    };

    sdkOrigin = 'fsm-sdk.net';
    sdkTarget = {
      postMessage: sinon.stub()
    };
  });

  it('should unregister an outlet', () => {
    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);

    let value: any;

    // postMessage catch messages send to outlets
    const postMessage = sinon.spy();
    const iframe = {
      postMessage
    } as any as Window;
    
    sdk.registerOutlet(iframe);
    sdk.unregisterOutlet(iframe);

    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.SET_VIEW_STATE,
        value: {
          key: 'TECHNICIAN',
          value: 42
        },
        to: ['abc'] // `to` parameter should be ignored
      }
    });

    expect(postMessage.called).toBe(false);
  });

  it('should handle SET_VIEW_STATE and propagate to all outlet', () => {
    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);
    let type: any;
    let value: any;
    let origin: string;
    let technicianId;

    // postMessage catch messages send to iFrames
    const postMessage = sinon.spy((payload, _origin) => {
      type = payload.type;
      value = payload.value;
      origin = _origin;
    });

    sdk.onViewState('TECHNICIAN', id => technicianId = id);

    // Define two outlets with different frame
    sdk.registerOutlet({ postMessage } as any as Window);
    sdk.registerOutlet({ postMessage } as any as Window);

    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.SET_VIEW_STATE,
        value: {
          key: 'TECHNICIAN',
          value: 42
        },
        to: ['abc'] // `to` parameter should be ignored
      }
    });

    expect(type).toEqual(SHELL_EVENTS.Version1.SET_VIEW_STATE);
    expect(value.key).toEqual('TECHNICIAN');
    expect(value.value).toEqual(42);
    expect(technicianId).toEqual(42);
    expect(origin).toEqual(sdkOrigin);

    expect(postMessage.calledTwice).toBe(true);
  });

  it('should unregister onViewState', () => {
    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);

    const event = sinon.spy();
    const listenner = sdk.onViewState('TECHNICIAN', event);
    listenner();

    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.SET_VIEW_STATE,
        value: {
          key: 'TECHNICIAN',
          value: 42
        }
      }
    });

    expect(event.called).toBe(false);

    sdk.onViewState('TECHNICIAN', event);
    sdk.offViewState('TECHNICIAN', event);

    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.SET_VIEW_STATE,
        value: {
          key: 'TECHNICIAN',
          value: 42
        }
      }
    });
    expect(event.called).toBe(false);
  });

  it('should not send TO_APP request to Outlets', () => {
    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);

    let value: any;
    sdk.on(SHELL_EVENTS.Version1.TO_APP, (_value) => {
      value = _value;
    });

    // postMessage catch messages send to outlets
    const postMessage = sinon.spy();
    sdk.registerOutlet({
      postMessage
    } as any as Window);

    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.TO_APP,
        value: 'HI APP'
      }
    });

    expect(value).toEqual('HI APP');
    expect(postMessage.called).toBe(false);
  });

  it('should not handle message from an outlet but send parent', () => {
    const postMessageParent = sinon.spy();
    sdk = ShellSdk.init({
      postMessage: postMessageParent
    } as any as Window, sdkOrigin, windowMock);

    let handleMessage = sinon.spy();
    sdk.on(SHELL_EVENTS.Version1.SET_VIEW_STATE, handleMessage);

    // postMessage catch messages send to outlets
    const postMessageOutlet = sinon.spy();
    const iframe = {
      frameElement: true,
      postMessage: postMessageOutlet
    } as any as Window;
    sdk.registerOutlet(iframe);

    windowMockCallback({
      source: iframe,
      data: {
        type: SHELL_EVENTS.Version1.SET_VIEW_STATE,
        value: {
          key: 'TECHNICIAN',
          value: 42
        }
      }
    });

    expect(postMessageParent.called).toBe(true);
    expect(handleMessage.called).toBe(false);
    expect(postMessageOutlet.called).toBe(false);
  });
});
