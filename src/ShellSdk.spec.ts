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
