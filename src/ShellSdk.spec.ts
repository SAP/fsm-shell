import { ShellSdk } from './ShellSdk';
import { SHELL_EVENTS } from './ShellEvents';
import { PayloadValidationError } from './validation/payload-validation-error';
import * as sinon from 'sinon';

const ORIGIN1 = 'https://s1.exemple.com';
const ORIGIN2 = 'https://s2.exemple.com';

describe('Shell Sdk', () => {
  let sdk: ShellSdk;
  let sdkTarget:
    | any
    | {
        postMessage: sinon.SinonStub;
      };
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
        windowMockCallback = callback;
      },
    };

    sdkOrigin = 'fsm-sdk.net';

    sdkTarget = {
      postMessage: sinon.stub(),
    };
    data = { message: 'test' };
  });

  it('should create instance', () => {
    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);
    expect(sdk).toBeDefined();
  });
  it('should create instance as Root', () => {
    sdk = ShellSdk.init(null as any as Window, sdkOrigin, windowMock);
    expect(sdk).toBeDefined();
  });

  it('should return same instance', () => {
    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);
    const sdkCopy = ShellSdk.instance;
    expect(sdk).toEqual(sdkCopy);
  });

  it('should return target using getTarget', () => {
    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);
    expect(sdk.getTarget()).toBe(sdkTarget);
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
          message: 'test data',
        },
      },
    });
  });

  it('should post message if request is from registered outlet and include targetOutletName and targetExtensionAssignmentId', () => {
    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);

    const outletName = 'test-outlet-name';
    const outletExtensionAssignmentId = 'test-extension-assignment-id';
    const MOCK_IFRAME: any = {
      src: ORIGIN1,
      contentWindow: ORIGIN1,
      extensionAssignmentId: outletExtensionAssignmentId,
    };
    sdk.registerOutlet(MOCK_IFRAME, outletName);

    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.REQUIRE_CONTEXT,
        value: {
          message: 'test data',
        },
      },
      source: ORIGIN1,
      origin: ORIGIN1,
    });

    const arg1 = sdkTarget.postMessage.getCall(0).args[0];
    const arg2 = sdkTarget.postMessage.getCall(0).args[1];

    sinon.assert.calledOnce(sdkTarget.postMessage);
    expect(arg1.type).toBe(SHELL_EVENTS.Version1.REQUIRE_CONTEXT);
    expect(arg1.value.message).toBe('test data');
    expect(arg1.value.targetOutletName).toBe(outletName);
    expect(arg1.value.targetExtensionAssignmentId).toBe(
      outletExtensionAssignmentId
    );
    expect(arg2).toBe(sdkOrigin);
  });

  it('should include trace when forwarding messages from outlet (old SDK)', () => {
    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);

    const outletName = 'my-outlet';
    const extensionAssignmentId = 'ext-123';
    const iframeSrc = ORIGIN1 + '/app';
    const MOCK_IFRAME: any = {
      src: iframeSrc,
      contentWindow: 'mock-window',
      extensionAssignmentId,
    };
    sdk.registerOutlet(MOCK_IFRAME, outletName);

    // Old SDK: message without trace
    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.GET_PERMISSIONS,
        value: { objectName: 'test' },
      },
      source: 'mock-window',
      origin: ORIGIN1,
    });

    const arg1 = sdkTarget.postMessage.getCall(0).args[0];

    // trace has 2 entries: outlet entry (created by forwarder) + forwarder's own entry
    expect(arg1.trace).toBeDefined();
    expect(arg1.trace.length).toBe(2);
    // First entry is created for the outlet (old SDK didn't send trace)
    expect(arg1.trace[0].uuid).toBeDefined();
    expect(arg1.trace[0].outletName).toBe(outletName);
    expect(arg1.trace[0].extensionAssignmentId).toBe(extensionAssignmentId);
    expect(arg1.trace[0].iframeSrc).toBe(iframeSrc);
    // Second entry is the forwarder itself (isModal undefined until REQUIRE_CONTEXT received)
    expect(arg1.trace[1].initHref).toBeDefined();
    expect(arg1.trace[1].locationHref).toBeDefined();
    expect(arg1.trace[1].isModal).toBeUndefined();
  });

  it('should include trace when forwarding messages from outlet (new SDK)', () => {
    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);

    const outletName = 'my-outlet';
    const extensionAssignmentId = 'ext-123';
    const iframeSrc = ORIGIN1 + '/app';
    const MOCK_IFRAME: any = {
      src: iframeSrc,
      contentWindow: 'mock-window',
      extensionAssignmentId,
    };
    sdk.registerOutlet(MOCK_IFRAME, outletName);

    // New SDK: message with trace (child's self-reported data, missing iframeSrc)
    const incomingTrace = [
      {
        initHref: 'https://child.example.com/init',
        locationHref: 'https://child.example.com/current',
        isModal: false,
      },
    ];

    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.GET_PERMISSIONS,
        value: { objectName: 'test' },
        trace: incomingTrace,
      },
      source: 'mock-window',
      origin: ORIGIN1,
    });

    const arg1 = sdkTarget.postMessage.getCall(0).args[0];

    // trace has 2 entries: enriched child entry + forwarder's own entry
    expect(arg1.trace).toBeDefined();
    expect(arg1.trace.length).toBe(2);
    // First entry is child's entry, enriched by parent with iframeSrc, uuid, etc.
    expect(arg1.trace[0].initHref).toBe('https://child.example.com/init');
    expect(arg1.trace[0].locationHref).toBe(
      'https://child.example.com/current'
    );
    expect(arg1.trace[0].isModal).toBe(false); // Preserved from child
    expect(arg1.trace[0].iframeSrc).toBe(iframeSrc); // Parent added this
    expect(arg1.trace[0].uuid).toBeDefined(); // Parent added this
    expect(arg1.trace[0].outletName).toBe(outletName); // Parent added this
    expect(arg1.trace[0].extensionAssignmentId).toBe(extensionAssignmentId); // Parent added this
    // Second entry is the forwarder itself (isModal undefined until REQUIRE_CONTEXT received)
    expect(arg1.trace[1].initHref).toBeDefined();
    expect(arg1.trace[1].locationHref).toBeDefined();
    expect(arg1.trace[1].isModal).toBeUndefined();
  });

  it('should handle undefined outlet properties in trace', () => {
    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);

    const MOCK_IFRAME: any = {
      src: ORIGIN1,
      contentWindow: ORIGIN1,
      // No extensionAssignmentId
    };
    sdk.registerOutlet(MOCK_IFRAME, undefined); // No outlet name

    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.GET_PERMISSIONS,
        value: { objectName: 'test' },
      },
      source: ORIGIN1,
      origin: ORIGIN1,
    });

    const arg1 = sdkTarget.postMessage.getCall(0).args[0];

    // trace has 2 entries: outlet entry + forwarder's own entry
    expect(arg1.trace).toBeDefined();
    expect(arg1.trace.length).toBe(2);
    // First entry is the outlet (with undefined optional properties)
    expect(arg1.trace[0].outletName).toBeUndefined();
    expect(arg1.trace[0].extensionAssignmentId).toBeUndefined();
    expect(arg1.trace[0].iframeSrc).toBe(ORIGIN1);
    expect(arg1.trace[0].uuid).toBeDefined();
    // Second entry is the forwarder itself (isModal undefined until REQUIRE_CONTEXT received)
    expect(arg1.trace[1].initHref).toBeDefined();
    expect(arg1.trace[1].locationHref).toBeDefined();
    expect(arg1.trace[1].isModal).toBeUndefined();
  });

  it('should accumulate trace through multiple hops', () => {
    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);

    const outletName = 'middle-outlet';
    const MOCK_IFRAME: any = {
      src: ORIGIN1,
      contentWindow: ORIGIN1,
      extensionAssignmentId: 'ext-middle',
    };
    sdk.registerOutlet(MOCK_IFRAME, outletName);

    // Simulate message from nested outlet that already has 2 trace entries
    // (original sender + first forwarder)
    const incomingTrace = [
      {
        uuid: 'nested-uuid',
        outletName: 'nested-outlet',
        extensionAssignmentId: 'ext-nested',
        iframeSrc: 'https://nested.example.com/app',
        initHref: 'https://nested.example.com/init',
        locationHref: 'https://nested.example.com/current',
        isModal: false,
      },
      {
        initHref: 'https://first-forwarder.example.com/init',
        locationHref: 'https://first-forwarder.example.com/current',
        isModal: false,
      },
    ];

    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.GET_PERMISSIONS,
        value: { objectName: 'test' },
        trace: incomingTrace,
      },
      source: ORIGIN1,
      origin: ORIGIN1,
    });

    const arg1 = sdkTarget.postMessage.getCall(0).args[0];

    // Should have 3 entries: 2 incoming + this forwarder's entry
    expect(arg1.trace).toBeDefined();
    expect(arg1.trace.length).toBe(3);

    // First entry preserved from original sender
    expect(arg1.trace[0].outletName).toBe('nested-outlet');
    expect(arg1.trace[0].iframeSrc).toBe('https://nested.example.com/app');
    expect(arg1.trace[0].isModal).toBe(false);

    // Second entry (first forwarder) enriched by this forwarder
    expect(arg1.trace[1].initHref).toBe(
      'https://first-forwarder.example.com/init'
    );
    expect(arg1.trace[1].iframeSrc).toBe(ORIGIN1); // This forwarder added iframeSrc
    expect(arg1.trace[1].isModal).toBe(false); // Preserved from incoming

    // Third entry is this forwarder's own entry (isModal undefined until REQUIRE_CONTEXT received)
    expect(arg1.trace[2].initHref).toBeDefined();
    expect(arg1.trace[2].locationHref).toBeDefined();
    expect(arg1.trace[2].isModal).toBeUndefined();
  });

  it('should build trace at root level (old SDK fallback)', (done) => {
    // Initialize as root (shell-host) - no registered outlets like in production
    sdk = ShellSdk.init(null as any as Window, sdkOrigin, windowMock);

    const mockSenderWindow = { postMessage: () => {} };

    sdk.on(
      SHELL_EVENTS.Version1.GET_PERMISSIONS,
      (value, origin, from, event, trace) => {
        // trace has 2 entries: old SDK fallback + root's own entry
        expect(trace).toBeDefined();
        expect(trace.length).toBe(2);
        // First entry is fallback for old SDK (uses event.origin since cross-origin)
        expect(trace[0].locationHref).toBe('https://sender.example.com');
        // Second entry is root's own entry
        expect(trace[1].initHref).toBeDefined();
        expect(trace[1].locationHref).toBeDefined();
        done();
      }
    );

    // Message from old SDK (no trace)
    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.GET_PERMISSIONS,
        value: { objectName: 'ServiceCall' },
      },
      source: mockSenderWindow,
      origin: 'https://sender.example.com',
    });
  });

  it('should build trace at root level (new SDK with trace)', (done) => {
    // Initialize as root (shell-host)
    sdk = ShellSdk.init(null as any as Window, sdkOrigin, windowMock);

    const mockSenderWindow = { postMessage: () => {} };

    // Incoming trace from sender through forwarders
    const incomingTrace = [
      {
        uuid: 'sender-uuid',
        outletName: 'sender-outlet',
        iframeSrc: 'https://sender.example.com/app',
        initHref: 'https://sender.example.com/init',
        locationHref: 'https://sender.example.com/current',
        isModal: false,
      },
      {
        iframeSrc: 'https://forwarder.example.com/app',
        initHref: 'https://forwarder.example.com/init',
        locationHref: 'https://forwarder.example.com/current',
        isModal: false,
      },
    ];

    sdk.on(
      SHELL_EVENTS.Version1.GET_PERMISSIONS,
      (_value, _origin, _from, _event, trace) => {
        // trace has 3 entries: 2 incoming + root's own entry
        expect(trace).toBeDefined();
        expect(trace.length).toBe(3);
        // First two entries preserved from incoming
        expect(trace[0].outletName).toBe('sender-outlet');
        expect(trace[0].isModal).toBe(false);
        expect(trace[1].iframeSrc).toBe('https://forwarder.example.com/app');
        expect(trace[1].isModal).toBe(false);
        // Third entry is root's own entry (root has no isModal)
        expect(trace[2].initHref).toBeDefined();
        expect(trace[2].locationHref).toBeDefined();
        done();
      }
    );

    // Message from new SDK (has trace)
    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.GET_PERMISSIONS,
        value: { objectName: 'ServiceCall' },
        trace: incomingTrace,
      },
      source: mockSenderWindow,
      origin: 'https://forwarder.example.com',
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
          message: 'test data',
        },
      },
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
          message: 'test data',
        },
      },
    });

    expect(handler1Called).toBe(false);
    expect(handler2Called).toBe(true);
  });

  it('should confirm context with request_context_done event', () => {
    const postMessageParent = sinon.spy();
    sdk = ShellSdk.init(
      {
        postMessage: postMessageParent,
      } as any as Window,
      sdkOrigin,
      windowMock
    );

    const requestContext = sinon.spy();

    sdk.on(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, requestContext);

    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.REQUIRE_CONTEXT,
        value: {
          message: 'test data',
        },
      },
    });

    expect(requestContext.called).toBe(true);
    expect(postMessageParent.called).toBe(true);
  });

  it('should init viewState on request_context event', () => {
    let technicianId: number;
    let servicecallId: number;

    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);

    sdk.onViewState('TECHNICIAN', (id) => (technicianId = id));
    sdk.onViewState('SERVICECALL', (id) => (servicecallId = id));

    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.REQUIRE_CONTEXT,
        value: {
          message: 'test data',
          viewState: {
            TECHNICIAN: 42,
            SERVICECALL: 1337,
          },
        },
      },
    });

    expect(technicianId).toEqual(42);
    expect(servicecallId).toEqual(1337);
    expect(sdk.isInsideShellModal()).toEqual(false);
  });

  it('should trigger onViewState after request_context then send to parent loading_success', () => {
    const postMessageParent = sinon.spy();
    sdk = ShellSdk.init(
      {
        postMessage: postMessageParent,
      } as any as Window,
      sdkOrigin,
      windowMock
    );

    const requestContext = sinon.spy();

    const onViewStateTechnician = sinon.spy();
    const onViewStateServiceCall = sinon.spy();

    sdk.on(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, requestContext);

    sdk.onViewState('TECHNICIAN', onViewStateTechnician);
    sdk.onViewState('SERVICECALL', onViewStateServiceCall);

    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.REQUIRE_CONTEXT,
        value: {
          message: 'test data',
          viewState: {
            TECHNICIAN: 42,
            SERVICECALL: 1337,
          },
        },
      },
    });

    expect(requestContext.called).toBe(true);
    expect(requestContext.called).toBe(true);
    expect(requestContext.called).toBe(true);

    expect(requestContext.calledBefore(onViewStateTechnician)).toBe(true);
    expect(requestContext.calledBefore(onViewStateServiceCall)).toBe(true);
    expect(requestContext.calledBefore(postMessageParent)).toBe(true);
    expect(onViewStateTechnician.calledBefore(postMessageParent)).toBe(true);
    expect(onViewStateServiceCall.calledBefore(postMessageParent)).toBe(true);
  });

  it('should only accept events from allowedOrigins', () => {
    const postMessageParent = sinon.spy();
    sdk = ShellSdk.init(
      {
        postMessage: postMessageParent,
      } as any as Window,
      sdkOrigin,
      windowMock
    );

    sdk.setAllowedOrigins([ORIGIN1, ORIGIN2]);

    const data = {
      type: SHELL_EVENTS.Version1.REQUIRE_CONTEXT,
      value: {
        message: 'test data',
      },
    };

    const requestContext = sinon.spy();

    sdk.on(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, requestContext);

    windowMockCallback({ origin: 'localhost:8000', data });
    expect(requestContext.called).toBe(false);
    requestContext.resetHistory();

    windowMockCallback({ origin: 'https://s1.exemple.com', data });
    expect(requestContext.called).toBe(true);
    requestContext.resetHistory();

    windowMockCallback({ origin: 's1.exemple.com', data });
    expect(requestContext.called).toBe(false);
    requestContext.resetHistory();

    windowMockCallback({ origin: 'https://s3.exemple.com', data });
    expect(requestContext.called).toBe(false);
    requestContext.resetHistory();

    // Test reseting a list
    sdk.setAllowedOrigins('*');
    windowMockCallback({ origin: 'localhost:8000', data });
    expect(requestContext.called).toBe(true);
    requestContext.resetHistory();

    sdk.setAllowedOrigins(['https://s1.exemple.com']);
    windowMockCallback({ origin: 'https://s3.exemple.com', data });
    expect(requestContext.called).toBe(false);
    sdk.setAllowedOrigins();
    windowMockCallback({ origin: 'https://s3.exemple.com', data });
    expect(requestContext.called).toBe(true);
    requestContext.resetHistory();

    sdk.setAllowedOrigins(['https://s1.exemple.com']);
    windowMockCallback({ origin: 'https://s3.exemple.com', data });
    expect(requestContext.called).toBe(false);
    sdk.setAllowedOrigins([]);
    windowMockCallback({ origin: 'https://s3.exemple.com', data });
    expect(requestContext.called).toBe(true);
    requestContext.resetHistory();
  });

  it('should add allowed origin', () => {
    const postMessageParent = sinon.spy();
    sdk = ShellSdk.init(
      {
        postMessage: postMessageParent,
      } as any as Window,
      sdkOrigin,
      windowMock
    );

    sdk.setAllowedOrigins([ORIGIN1]);
    sdk.addAllowedOrigin(`${ORIGIN2}/extension`);

    const data = {
      type: SHELL_EVENTS.Version1.REQUIRE_CONTEXT,
      value: {
        message: 'test data',
      },
    };

    const requestContext = sinon.spy();

    sdk.on(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, requestContext);

    windowMockCallback({ origin: 'localhost:8000', data });
    expect(requestContext.called).toBe(false);
    requestContext.resetHistory();

    windowMockCallback({ origin: ORIGIN1, data });
    expect(requestContext.called).toBe(true);
    requestContext.resetHistory();

    windowMockCallback({ origin: ORIGIN2, data });
    expect(requestContext.called).toBe(true);
    requestContext.resetHistory();
  });

  it('should remove allowed origin', () => {
    const postMessageParent = sinon.spy();
    sdk = ShellSdk.init(
      {
        postMessage: postMessageParent,
      } as any as Window,
      sdkOrigin,
      windowMock
    );

    sdk.setAllowedOrigins([ORIGIN1, ORIGIN2]);
    sdk.removeAllowedOrigin(`${ORIGIN2}/extension`);

    const data = {
      type: SHELL_EVENTS.Version1.REQUIRE_CONTEXT,
      value: {
        message: 'test data',
      },
    };

    const requestContext = sinon.spy();

    sdk.on(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, requestContext);

    windowMockCallback({ origin: 'localhost:8000', data });
    expect(requestContext.called).toBe(false);
    requestContext.resetHistory();

    windowMockCallback({ origin: ORIGIN1, data });
    expect(requestContext.called).toBe(true);
    requestContext.resetHistory();

    windowMockCallback({ origin: ORIGIN2, data });
    expect(requestContext.called).toBe(false);
    requestContext.resetHistory();
  });

  it('should remove only one allowed origin', () => {
    const postMessageParent = sinon.spy();
    sdk = ShellSdk.init(
      {
        postMessage: postMessageParent,
      } as any as Window,
      sdkOrigin,
      windowMock
    );

    sdk.setAllowedOrigins([ORIGIN1]);
    sdk.addAllowedOrigin(ORIGIN2);
    sdk.addAllowedOrigin(ORIGIN2);

    const data = {
      type: SHELL_EVENTS.Version1.REQUIRE_CONTEXT,
      value: {
        message: 'test data',
      },
    };

    const requestContext = sinon.spy();
    sdk.on(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, requestContext);

    windowMockCallback({ origin: 'localhost:8000', data });
    expect(requestContext.called).toBe(false);
    requestContext.resetHistory();

    windowMockCallback({ origin: ORIGIN1, data });
    expect(requestContext.called).toBe(true);
    requestContext.resetHistory();

    windowMockCallback({ origin: ORIGIN2, data });
    expect(requestContext.called).toBe(true);
    requestContext.resetHistory();

    sdk.removeAllowedOrigin(`${ORIGIN2}/extension`);

    windowMockCallback({ origin: ORIGIN2, data });
    expect(requestContext.called).toBe(true);
    requestContext.resetHistory();

    sdk.removeAllowedOrigin(`${ORIGIN2}/extension`);

    windowMockCallback({ origin: ORIGIN2, data });
    expect(requestContext.called).toBe(false);
    requestContext.resetHistory();
  });

  it('should indicate if origin allowed', () => {
    sdk = ShellSdk.init(
      {
        postMessage: () => {},
      } as any as Window,
      sdkOrigin,
      windowMock
    );

    sdk.setAllowedOrigins([ORIGIN1]);
    expect(sdk.isOriginAllowed(ORIGIN1)).toEqual(true);
    expect(sdk.isOriginAllowed(ORIGIN2)).toEqual(false);
  });

  it('isInsideShell should report result depending on top end self references in window are same', () => {
    const isInsideShell = ShellSdk.isInsideShell();
    expect(isInsideShell).toEqual(window.top !== window.self);
  });

  it('IsInsideShellModal() return true when REQUIRE_CONTEXT has isInsideShellModal: true', () => {
    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);

    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.REQUIRE_CONTEXT,
        value: {
          message: 'test data',
          isInsideShellModal: true,
        },
      },
    });

    expect(sdk.isInsideShellModal()).toEqual(true);
  });

  it('IsInsideShellModal() return false when REQUIRE_CONTEXT has no isInsideShellModal property', () => {
    sdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);

    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.REQUIRE_CONTEXT,
        value: {
          message: 'test data',
        },
      },
    });

    expect(sdk.isInsideShellModal()).toEqual(false);
  });

  it('IsInsideShellModal() return false when instantiated as root', () => {
    sdk = ShellSdk.init(null as any as Window, sdkOrigin, windowMock);

    windowMockCallback({
      data: {
        type: SHELL_EVENTS.Version1.REQUIRE_CONTEXT,
        value: {
          message: 'test data',
          isInsideShellModal: true,
        },
      },
    });

    expect(sdk.isInsideShellModal()).toEqual(false);
  });

  it('should ignore events from IgnoredOrigins', () => {
    const postMessageParent = sinon.spy();
    sdk = ShellSdk.init(
      {
        postMessage: postMessageParent,
      } as any as Window,
      sdkOrigin,
      windowMock
    );

    sdk.setIgnoredOrigins([ORIGIN1]);
    sdk.setAllowedOrigins([ORIGIN2]);

    const data = {
      type: SHELL_EVENTS.Version1.REQUIRE_CONTEXT,
      value: {
        message: 'test data',
      },
    };

    const requestContext = sinon.spy();

    sdk.on(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, requestContext);

    windowMockCallback({ origin: ORIGIN1, data });
    expect(requestContext.called).toBe(false);
    requestContext.resetHistory();

    windowMockCallback({ origin: ORIGIN2, data });
    expect(requestContext.called).toBe(true);
    requestContext.resetHistory();

    sdk.removeIgnoredOrigin(ORIGIN1);
    sdk.addAllowedOrigin(ORIGIN1);
    windowMockCallback({ origin: ORIGIN1, data });
    expect(requestContext.called).toBe(true);
    requestContext.resetHistory();

    sdk.addIgnoredOrigin(ORIGIN1);
    windowMockCallback({ origin: ORIGIN1, data });
    expect(requestContext.called).toBe(false);
    requestContext.resetHistory();

    sdk.setIgnoredOrigins([]);
    sdk.setAllowedOrigins([ORIGIN1]);

    windowMockCallback({ origin: ORIGIN1, data });
    expect(requestContext.called).toBe(true);
    requestContext.resetHistory();
  });

  describe('payload validation', () => {
    it('should trigger validation and indicate success', () => {
      const shellSdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);

      const validationStub = sinon.stub().returns({
        isValid: true,
      });

      shellSdk.setValidator({
        getValidationFunction: () => validationStub,
      });

      shellSdk.emit(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, { key: 'value' });

      expect(validationStub.getCalls().length).toEqual(1);
      expect(
        (sdkTarget.postMessage as sinon.SinonStub).getCalls().length
      ).toEqual(1);
    });

    it('should trigger validation and indicate error', () => {
      const shellSdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);
      const errorMock = new Error('Validation Failed');

      const validationStub = sinon.stub().returns({
        isValid: false,
        error: errorMock,
      });

      shellSdk.setValidator({
        getValidationFunction: () => validationStub,
      });

      let isInvalid = false;
      let error: PayloadValidationError | null = null;

      try {
        shellSdk.emit(SHELL_EVENTS.Version1.REQUIRE_AUTHENTICATION, {
          key: 'value',
        });
      } catch (e) {
        isInvalid = true;
        error = e;
      }

      expect(validationStub.getCalls().length).toEqual(1);
      expect(
        (sdkTarget.postMessage as sinon.SinonStub).getCalls().length
      ).toEqual(0);
      expect(error.name).toEqual('PayloadValidationError');
      expect(error.detail).toEqual(errorMock);
      expect(isInvalid).toEqual(true);
    });

    it('should not trigger validation for events without schema configuration', () => {
      const shellSdk = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);

      const validationStub = sinon.stub().returns({
        isValid: true,
      });

      shellSdk.setValidator({
        getValidationFunction: () => validationStub,
      });

      shellSdk.emit(SHELL_EVENTS.Version1.RESTORE_TITLE, null);

      expect(validationStub.getCalls().length).toEqual(0);
      expect(
        (sdkTarget.postMessage as sinon.SinonStub).getCalls().length
      ).toEqual(1);
    });

    it('should have separate event validation configuration for each shellSdk instance', () => {
      const shellSdk1 = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);

      const validationStub1 = sinon.stub().returns({
        isValid: true,
      });

      shellSdk1.setValidator({
        getValidationFunction: () => validationStub1,
      });

      shellSdk1.emit(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, { key: 'value' });

      expect(validationStub1.getCalls().length).toEqual(1);
      expect(
        (sdkTarget.postMessage as sinon.SinonStub).getCalls().length
      ).toEqual(1);

      const shellSdk2 = ShellSdk.init(sdkTarget, sdkOrigin, windowMock);

      const validationStub2 = sinon.stub().returns({
        isValid: false,
      });

      sdkTarget = {
        postMessage: sinon.stub(),
      };

      shellSdk2.setValidator({
        getValidationFunction: () => validationStub2,
      });

      let isError = false;
      try {
        shellSdk2.emit(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, { key: 'value' });
      } catch (_error) {
        isError = true;
      }

      expect(validationStub2.getCalls().length).toEqual(1);
      expect(
        (sdkTarget.postMessage as sinon.SinonStub).getCalls().length
      ).toEqual(0);
      expect(isError).toEqual(true);
    });
  });
});
