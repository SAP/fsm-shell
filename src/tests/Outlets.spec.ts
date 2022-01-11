import { ShellSdk } from '../ShellSdk';
import { SHELL_EVENTS } from '../ShellEvents';
import * as sinon from 'sinon';

const EXTENSION_SRC = 'http://local.coresystems.net/extension';
const EXTENSION_ORIGIN = 'http://local.coresystems.net';

describe('Outlets', () => {
  let sdk: ShellSdk;
  let sdkTarget: any;
  let sdkOrigin: string;
  let data: any;

  let windowMock: any;
  let windowMockEventListenerAdded: boolean;
  let windowMockEventType: string;
  let windowMockCallback: Function;

  const TARGET_OUTLET_NAME_1 = 'Outlet_1';
  const TARGET_OUTLET_NAME_2 = 'Outlet_2';
  const TARGET_OUTLET_INSIDE_OUTLET_NAME_1 = 'Outlet_Inside_Outlet_1';

  beforeEach(() => {
    windowMock = {
      addEventListener: (eventType, callback) => {
        windowMockEventListenerAdded = true;
        windowMockEventType = eventType;
        windowMockCallback = callback;
      },
    };

    sdkOrigin = 'fsm-sdk.net';
    sdkTarget = {
      postMessage: sinon.stub(),
    };
  });

  it('should unregister an outlet', () => {
    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);

    let value: any;

    // postMessage catch messages send to outlets
    const postMessage = sinon.spy();
    const iframe = {
      contentWindow: {
        postMessage,
      } as any as Window,
    } as any as HTMLIFrameElement;

    sdk.registerOutlet(iframe, TARGET_OUTLET_NAME_1);
    sdk.unregisterOutlet(iframe);

    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.SET_VIEW_STATE,
        value: {
          key: 'TECHNICIAN',
          value: 42,
        },
        to: ['abc'], // `to` parameter should be ignored
      },
    });

    expect(postMessage.called).toBe(false);
  });

  it('should handle set_view_state and propagate to all outlet', () => {
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

    sdk.onViewState('TECHNICIAN', (id) => (technicianId = id));

    // Define two outlets with different frame
    sdk.registerOutlet(
      {
        contentWindow: {
          postMessage,
        } as any as Window,
      } as any as HTMLIFrameElement,
      TARGET_OUTLET_NAME_1
    );
    sdk.registerOutlet(
      {
        contentWindow: {
          postMessage,
        } as any as Window,
      } as any as HTMLIFrameElement,
      TARGET_OUTLET_NAME_2
    );

    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.SET_VIEW_STATE,
        value: {
          key: 'TECHNICIAN',
          value: 42,
        },
        to: ['abc'], // `to` parameter should be ignored
      },
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
          value: 42,
        },
      },
    });

    expect(event.called).toBe(false);

    sdk.onViewState('TECHNICIAN', event);
    sdk.offViewState('TECHNICIAN', event);

    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.SET_VIEW_STATE,
        value: {
          key: 'TECHNICIAN',
          value: 42,
        },
      },
    });
    expect(event.called).toBe(false);
  });

  it('should not send to_app request to Outlets', () => {
    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);

    let value: any;
    sdk.on(SHELL_EVENTS.Version1.TO_APP, (_value) => {
      value = _value;
    });

    // postMessage catch messages send to outlets
    const postMessage = sinon.spy();
    sdk.registerOutlet(
      {
        contentWindow: {
          postMessage,
        } as any as Window,
      } as any as HTMLIFrameElement,
      TARGET_OUTLET_NAME_1
    );

    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.TO_APP,
        value: 'HI APP',
      },
    });

    expect(value).toEqual('HI APP');
    expect(postMessage.called).toBe(false);
  });

  it('should not handle TO_APP message from an outlet but send parent', () => {
    const postMessageParent = sinon.spy();
    sdk = ShellSdk.init(
      {
        postMessage: postMessageParent,
      } as any as Window,
      sdkOrigin,
      windowMock
    );

    let handleMessage = sinon.spy();
    sdk.on(SHELL_EVENTS.Version1.TO_APP, handleMessage);

    // postMessage catch messages send to outlets
    const postMessageOutlet = sinon.spy();
    const iframe = {
      src: EXTENSION_SRC,
      contentWindow: {
        postMessage: postMessageOutlet,
      } as any as Window,
    } as any as HTMLIFrameElement;
    sdk.registerOutlet(iframe, TARGET_OUTLET_NAME_1);

    windowMockCallback({
      source: iframe.contentWindow,
      origin: EXTENSION_ORIGIN,
      data: {
        type: SHELL_EVENTS.Version1.TO_APP,
        value: 'RANDOM_VALUE',
      },
    });

    expect(postMessageParent.called).toBe(true);
    expect(handleMessage.called).toBe(false);
    expect(postMessageOutlet.called).toBe(false);
  });

  it('should ignore SET_VIEW_STATE message from an outlet for security reason', () => {
    const postMessageParent = sinon.spy();
    sdk = ShellSdk.init(
      {
        postMessage: postMessageParent,
      } as any as Window,
      sdkOrigin,
      windowMock
    );

    let handleMessage = sinon.spy();
    sdk.on(SHELL_EVENTS.Version1.SET_VIEW_STATE, handleMessage);

    // postMessage catch messages send to outlets
    const postMessageOutlet = sinon.spy();
    const iframe = {
      src: EXTENSION_SRC,
      contentWindow: {
        postMessage: postMessageOutlet,
      } as any as Window,
    } as any as HTMLIFrameElement;
    sdk.registerOutlet(iframe, TARGET_OUTLET_NAME_1);

    const consoleSpy = sinon.spy(console, 'warn');

    windowMockCallback({
      source: iframe.contentWindow,
      origin: EXTENSION_ORIGIN,
      data: {
        type: SHELL_EVENTS.Version1.SET_VIEW_STATE,
        value: {
          key: 'TECHNICIAN',
          value: 42,
        },
      },
    });

    expect(
      consoleSpy.calledWith(
        '[ShellSDk] A plugin tried to update viewState using SetViewState which is not allowed for security reason.'
      )
    ).toBe(true);
    expect(postMessageParent.called).toBe(false);
    expect(handleMessage.called).toBe(false);
    expect(postMessageOutlet.called).toBe(false);
  });

  it('should outlet send to parent loading_success on require_context', () => {
    const postMessageParent = sinon.spy();
    sdk = ShellSdk.init(
      {
        postMessage: postMessageParent,
      } as any as Window,
      sdkOrigin,
      windowMock
    );

    let handleMessage = sinon.spy();
    sdk.on(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, handleMessage);

    // postMessage catch messages send to outlets
    const postMessageOutlet = sinon.spy();
    const iframe = {
      contentWindow: {
        postMessage: postMessageOutlet,
      } as any as Window,
    } as any as HTMLIFrameElement;
    sdk.registerOutlet(iframe, TARGET_OUTLET_NAME_1);

    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.REQUIRE_CONTEXT,
        value: {
          message: 'test',
        },
      },
    });

    expect(postMessageParent.called).toBe(true);
    expect(handleMessage.called).toBe(true);
    expect(postMessageOutlet.called).toBe(false);
  });

  it('should not propagate SHELL_EVENTS.Version1.OUTLET.REQUEST_CONTEXT isConfigurationMode changes', () => {
    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);

    let value: any;

    // postMessage catch messages send to outlets
    const postMessage = sinon.spy();
    sdk.registerOutlet(
      {
        contentWindow: {
          postMessage,
        } as any as Window,
      } as any as HTMLIFrameElement,
      TARGET_OUTLET_NAME_1
    );

    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.OUTLET.REQUEST_CONTEXT,
        value: {
          isConfigurationMode: true,
          target: '',
        },
      },
    });

    expect(postMessage.called).toBe(false);
    postMessage.resetHistory();

    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.OUTLET.REQUEST_CONTEXT,
        value: {
          isConfigurationMode: true,
        },
      },
    });

    expect(postMessage.called).toBe(true);
    postMessage.resetHistory();

    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.OUTLET.REQUEST_CONTEXT,
        value: {
          isConfigurationMode: true,
          plugin: {},
        },
      },
    });

    expect(postMessage.called).toBe(false);
  });

  it(
    'should propagate SHELL_EVENTS.Version1.OUTLET.REQUEST_DYNAMIC_CONTEXT to all registered outlets' +
      'in case it only contains property areDynamicOutletsEnabled',
    () => {
      sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);

      // postMessage catch messages send to outlets
      const postMessage = sinon.spy();

      sdk.registerOutlet(
        {
          contentWindow: {
            postMessage,
          } as any as Window,
        } as any as HTMLIFrameElement,
        TARGET_OUTLET_NAME_1
      );

      sdk.registerOutlet(
        {
          contentWindow: {
            postMessage,
          } as any as Window,
        } as any as HTMLIFrameElement,
        TARGET_OUTLET_NAME_2
      );

      windowMockCallback({
        data: {
          type: SHELL_EVENTS.Version1.OUTLET.REQUEST_DYNAMIC_CONTEXT,
          value: {
            areDynamicOutletsEnabled: true,
            target: 'someTarget',
          },
        },
      });

      expect(postMessage.called).toBe(false);
      postMessage.resetHistory();

      windowMockCallback({
        data: {
          type: SHELL_EVENTS.Version1.OUTLET.REQUEST_DYNAMIC_CONTEXT,
          value: {
            areDynamicOutletsEnabled: true,
          },
        },
      });

      expect(postMessage.callCount).toBe(2);
      postMessage.resetHistory();

      windowMockCallback({
        data: {
          type: SHELL_EVENTS.Version1.OUTLET.REQUEST_DYNAMIC_CONTEXT,
          value: {
            areDynamicOutletsEnabled: true,
            plugins: [],
          },
        },
      });

      expect(postMessage.called).toBe(false);
    }
  );

  it(
    'should return SHELL_EVENTS.Version1.OUTLET.LOADING_FAIL if payload type is ' +
      'SHELL_EVENTS.Version1.OUTLET.REQUEST_CONTEXT and reached maximum depth',
    () => {
      const postMessageParent = sinon.spy();
      sdk = ShellSdk.init(
        {
          postMessage: postMessageParent,
        } as any as Window,
        sdkOrigin,
        windowMock,
        null,
        3
      );

      let handleMessage = sinon.spy();
      sdk.on(SHELL_EVENTS.Version1.OUTLET.LOADING_FAIL, handleMessage);

      const postMessageOutlet = sinon.spy();
      const iframe = {
        src: EXTENSION_SRC,
        contentWindow: {
          postMessage: postMessageOutlet,
        } as any as Window,
      } as any as HTMLIFrameElement;
      sdk.registerOutlet(iframe, TARGET_OUTLET_NAME_1);

      windowMockCallback({
        source: iframe.contentWindow,
        origin: EXTENSION_ORIGIN,
        data: {
          type: SHELL_EVENTS.Version1.OUTLET.REQUEST_CONTEXT,
          value: {
            target: 'test',
          },
          from: ['a', 'b'],
        },
      });

      expect(postMessageParent.called).toBe(true);
      expect(postMessageOutlet.called).toBe(false);
      postMessageParent.resetHistory();
      postMessageOutlet.resetHistory();

      windowMockCallback({
        source: iframe.contentWindow,
        origin: EXTENSION_ORIGIN,
        data: {
          type: SHELL_EVENTS.Version1.OUTLET.REQUEST_CONTEXT,
          value: {
            target: 'test',
          },
          from: ['a', 'b', 'c'],
        },
      });

      expect(postMessageParent.called).toBe(false);
      expect(postMessageOutlet.called).toBe(true);
    }
  );

  it(
    'should return SHELL_EVENTS.Version1.OUTLET.LOADING_FAIL if payload type is ' +
      'SHELL_EVENTS.Version1.OUTLET.REQUEST_DYNAMIC_CONTEXT and reached maximum depth',
    () => {
      const postMessageParent = sinon.spy();
      sdk = ShellSdk.init(
        {
          postMessage: postMessageParent,
        } as any as Window,
        sdkOrigin,
        windowMock,
        null,
        3
      );

      let handleMessage = sinon.spy();
      sdk.on(SHELL_EVENTS.Version1.OUTLET.LOADING_FAIL, handleMessage);

      const postMessageOutlet = sinon.spy();
      const iframe = {
        src: EXTENSION_SRC,
        contentWindow: {
          postMessage: postMessageOutlet,
        } as any as Window,
      } as any as HTMLIFrameElement;
      sdk.registerOutlet(iframe, TARGET_OUTLET_NAME_1);

      windowMockCallback({
        source: iframe.contentWindow,
        origin: EXTENSION_ORIGIN,
        data: {
          type: SHELL_EVENTS.Version1.OUTLET.REQUEST_DYNAMIC_CONTEXT,
          value: {
            target: 'test',
          },
          from: ['a', 'b'],
        },
      });

      expect(postMessageParent.called).toBe(true);
      expect(postMessageOutlet.called).toBe(false);
      postMessageParent.resetHistory();
      postMessageOutlet.resetHistory();

      windowMockCallback({
        source: iframe.contentWindow,
        origin: EXTENSION_ORIGIN,
        data: {
          type: SHELL_EVENTS.Version1.OUTLET.REQUEST_DYNAMIC_CONTEXT,
          value: {
            target: 'test',
          },
          from: ['a', 'b', 'c'],
        },
      });

      expect(postMessageParent.called).toBe(false);
      expect(postMessageOutlet.called).toBe(true);
    }
  );

  it(
    'should add the target outlet name for message SHELL_EVENTS.Version1.REQUIRE_CONTEXT from an extension' +
      'in case target outlet name is defined',
    () => {
      let type: any;
      let value: any;
      let origin: string;
      let from: string[];

      const POST_MESSAGE_PARENT = sinon.spy((payload, _origin) => {
        type = payload.type;
        value = payload.value;
        from = payload.from;
        origin = _origin;
      });
      sdk = ShellSdk.init(
        {
          postMessage: POST_MESSAGE_PARENT,
        } as any as Window,
        sdkOrigin,
        windowMock,
        null,
        3
      );

      // postMessage catch messages send to outlets
      const POST_MESSAGE = sinon.spy();
      const IFRAME = {
        src: EXTENSION_SRC,
        contentWindow: {
          postMessage: POST_MESSAGE,
        } as any as Window,
      } as any as HTMLIFrameElement;

      sdk.registerOutlet(IFRAME, TARGET_OUTLET_NAME_1);

      windowMockCallback({
        data: {
          type: SHELL_EVENTS.Version1.REQUIRE_CONTEXT,
          value: {
            clientIdentifier: 'example-plugin',
          },
        },
        origin: EXTENSION_ORIGIN,
        source: IFRAME.contentWindow,
      });

      const OUTLET = (sdk as any).outletsMap.get(IFRAME);

      expect(POST_MESSAGE.called).toBe(false);
      expect(POST_MESSAGE_PARENT.called).toBe(true);
      expect(type).toEqual(SHELL_EVENTS.Version1.REQUIRE_CONTEXT);
      expect(value).toEqual({
        clientIdentifier: 'example-plugin',
        targetOutletName: OUTLET.name,
      });
      expect(from).toEqual([OUTLET.uuid]);
      expect(origin).toEqual(sdkOrigin);
    }
  );

  it(
    'should not add the target outlet name for message SHELL_EVENTS.Version1.REQUIRE_CONTEXT from an extension' +
      'in case target outlet name is undefined',
    () => {
      let type: any;
      let value: any;
      let origin: string;
      let from: string[];

      const POST_MESSAGE_PARENT = sinon.spy((payload, _origin) => {
        type = payload.type;
        value = payload.value;
        from = payload.from;
        origin = _origin;
      });
      sdk = ShellSdk.init(
        {
          postMessage: POST_MESSAGE_PARENT,
        } as any as Window,
        sdkOrigin,
        windowMock,
        null,
        3
      );

      // postMessage catch messages send to outlets
      const POST_MESSAGE = sinon.spy();
      const IFRAME = {
        src: EXTENSION_SRC,
        contentWindow: {
          postMessage: POST_MESSAGE,
        } as any as Window,
      } as any as HTMLIFrameElement;

      sdk.registerOutlet(IFRAME, undefined);

      windowMockCallback({
        data: {
          type: SHELL_EVENTS.Version1.REQUIRE_CONTEXT,
          value: {
            clientIdentifier: 'example-plugin',
          },
        },
        origin: EXTENSION_ORIGIN,
        source: IFRAME.contentWindow,
      });

      const OUTLET = (sdk as any).outletsMap.get(IFRAME);

      expect(POST_MESSAGE.called).toBe(false);
      expect(POST_MESSAGE_PARENT.called).toBe(true);
      expect(type).toEqual(SHELL_EVENTS.Version1.REQUIRE_CONTEXT);
      expect(value).toEqual({
        clientIdentifier: 'example-plugin',
      });
      expect(from).toEqual([OUTLET.uuid]);
      expect(origin).toEqual(sdkOrigin);
    }
  );

  it('should not override target outlet name for message SHELL_EVENTS.Version1.REQUIRE_CONTEXT from an extension', () => {
    let type: any;
    let value: any;
    let origin: string;
    let from: string[];

    const POST_MESSAGE_PARENT = sinon.spy((payload, _origin) => {
      type = payload.type;
      value = payload.value;
      from = payload.from;
      origin = _origin;
    });
    sdk = ShellSdk.init(
      {
        postMessage: POST_MESSAGE_PARENT,
      } as any as Window,
      sdkOrigin,
      windowMock,
      null,
      3
    );

    // postMessage catch messages send to outlets
    const POST_MESSAGE = sinon.spy();
    const IFRAME = {
      src: EXTENSION_SRC,
      contentWindow: {
        postMessage: POST_MESSAGE,
      } as any as Window,
    } as any as HTMLIFrameElement;

    sdk.registerOutlet(IFRAME, TARGET_OUTLET_NAME_1);

    const UUID4 = '0d719835-b2fb-4683-b02c-f4da1d80f842';

    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.REQUIRE_CONTEXT,
        value: {
          clientIdentifier: 'example-plugin',
          targetOutletName: TARGET_OUTLET_INSIDE_OUTLET_NAME_1,
        },
        from: [UUID4],
      },
      origin: EXTENSION_ORIGIN,
      source: IFRAME.contentWindow,
    });

    const OUTLET = (sdk as any).outletsMap.get(IFRAME);

    expect(POST_MESSAGE.called).toBe(false);
    expect(POST_MESSAGE_PARENT.called).toBe(true);
    expect(type).toEqual(SHELL_EVENTS.Version1.REQUIRE_CONTEXT);
    expect(value).toEqual({
      clientIdentifier: 'example-plugin',
      targetOutletName: TARGET_OUTLET_INSIDE_OUTLET_NAME_1,
    });
    expect(from).toEqual([UUID4, OUTLET.uuid]);
    expect(origin).toEqual(sdkOrigin);
  });

  it('should only open modals with url from allowedOrigins', () => {
    const postMessageParent = sinon.spy();
    sdk = ShellSdk.init(
      {
        postMessage: postMessageParent,
      } as any as Window,
      sdkOrigin,
      windowMock
    );
    sdk.setAllowedOrigins([EXTENSION_ORIGIN]);

    const postMessageOutlet = sinon.spy();
    const iframe = {
      src: EXTENSION_SRC,
      contentWindow: {
        postMessage: postMessageOutlet,
      } as any as Window,
    } as any as HTMLIFrameElement;
    sdk.registerOutlet(iframe, 'outlet_name');

    const requestContext = sinon.spy();

    windowMockCallback({
      source: iframe.contentWindow,
      origin: EXTENSION_ORIGIN,
      data: {
        type: SHELL_EVENTS.Version1.MODAL.OPEN,
        value: {
          url: EXTENSION_ORIGIN + '/my-modal-url/',
        },
      },
    });
    expect(postMessageParent.called).toBe(true);
    postMessageParent.resetHistory();

    windowMockCallback({
      source: iframe.contentWindow,
      origin: EXTENSION_ORIGIN,
      data: {
        type: SHELL_EVENTS.Version1.MODAL.OPEN,
        value: {
          url: 'https://example.com/my-modal-url/',
        },
      },
    });
    expect(postMessageParent.called).toBe(false);
    postMessageParent.resetHistory();
  });
});
