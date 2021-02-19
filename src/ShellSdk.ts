import { EventType, ErrorType, SHELL_EVENTS } from './ShellEvents';
import { SHELL_VERSION_INFO } from './ShellVersionInfo';
import { Debugger } from './Debugger';
import * as LuigiClient from '@luigi-project/client';

// tslint:disable
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
// tslint:enable

const DEFAULT_MAXIMUM_DEPTH = 1;

export class ShellSdk {
  public LuigiClient = LuigiClient;
  public static VERSION = SHELL_VERSION_INFO.VERSION;
  public static BUILD_TS = SHELL_VERSION_INFO.BUILD_TS;

  private static _instance: ShellSdk;
  private isRoot: boolean; // Is root if on `init`, target value is null.

  private postMessageHandler:
    | (<T>(type: EventType, value: T, to?: string[]) => void)
    | undefined;

  // tslint:disable-next-line
  private subscribersMap: Map<EventType, Function[]>;
  // tslint:disable-next-line
  private subscribersViewStateMap: Map<string, Function[]>;

  private debugger: Debugger;
  private outletsMap: Map<HTMLIFrameElement, string>;

  private allowedOrigins: string[] = [];

  private constructor(
    private target: Window,
    private origin: string,
    private winRef: Window,
    debugId: string,
    private outletMaximumDepth: number
  ) {
    this.subscribersMap = new Map();
    this.subscribersViewStateMap = new Map();
    this.outletsMap = new Map();
    this.initMessageApi();
    this.debugger = new Debugger(winRef, debugId);
    this.isRoot = target == null;
  }

  public static init(
    target: Window,
    origin: string,
    winRef: Window = window,
    debugId: string = '',
    outletMaximumDepth: number = DEFAULT_MAXIMUM_DEPTH
  ): ShellSdk {
    ShellSdk._instance = new ShellSdk(
      target,
      origin,
      winRef,
      debugId,
      outletMaximumDepth
    );
    return ShellSdk._instance;
  }

  public static get instance(): ShellSdk {
    if (!ShellSdk._instance) {
      throw new Error("ShellSdk wasn't initialized.");
    }
    return ShellSdk._instance;
  }

  public static isInsideShell(): boolean {
    // using local variable for window reference below needed to fix issue when running tests
    // for applications which use fsm-shell in cypress
    // cypress may replace `window.self !== window.top` with `window.self !== window.self`
    // what makes isInsideShell method returning wrong value

    const winRef = window;
    return winRef.self !== winRef.top;
  }

  public setAllowedOrigins(allowedOrigins: string[] | '*' = []) {
    this.allowedOrigins = allowedOrigins === '*' ? [] : allowedOrigins;
  }

  public addAllowedOrigin(url: string) {
    let urlObj: URL;
    try {
      urlObj = new URL(url);
    } catch {
      return;
    }
    this.allowedOrigins.push(urlObj.origin);
  }

  public removeAllowedOrigin(url: string) {
    let urlObj: URL;
    try {
      urlObj = new URL(url);
    } catch {
      return;
    }
    const idxToRemove = this.allowedOrigins.findIndex(
      (allowedOrigin) => allowedOrigin === urlObj.origin
    );
    this.allowedOrigins = this.allowedOrigins.filter(
      (_allowedOrigin, originIdx) => originIdx !== idxToRemove
    );
  }

  public isOriginAllowed(url: string): boolean {
    let urlObj: URL;
    try {
      urlObj = new URL(url);
    } catch {
      return false;
    }
    return this.allowedOrigins.some(
      (allowedOrigin) => allowedOrigin === urlObj.origin
    );
  }

  // Called by outlet component to assign an generated uuid to an iframe. This is key
  // to allow one to one communication between a pluging and shell-host
  public registerOutlet(frame: HTMLIFrameElement) {
    this.outletsMap.set(frame, uuidv4());
  }

  public unregisterOutlet(frame: HTMLIFrameElement) {
    this.outletsMap.delete(frame);
  }

  public getTarget() {
    return this.target;
  }

  public setTarget(target: Window, origin: string) {
    const targetChanged = this.target !== target || this.origin !== origin;
    if (targetChanged) {
      this.target = target;
      this.origin = origin;
    }
  }

  // tslint:disable-next-line
  public on = (type: EventType, subscriber: Function): Function => {
    if (!this.subscribersMap.has(type)) {
      this.subscribersMap.set(type, []);
    }
    // tslint:disable-next-line
    const subscribers = this.subscribersMap.get(type) as Function[];
    subscribers.push(subscriber);
    return () => {
      this.removeSubscriber(type, subscriber);
    };
  };

  // tslint:disable-next-line
  public onViewState = (key: string, subscriber: Function): Function => {
    if (!this.subscribersViewStateMap.has(key)) {
      this.subscribersViewStateMap.set(key, []);
    }
    // tslint:disable-next-line
    const subscribers = this.subscribersViewStateMap.get(key) as Function[];
    subscribers.push(subscriber);
    return () => {
      this.removeViewStateSubscriber(key, subscriber);
    };
  };

  // tslint:disable-next-line
  public off = (type: EventType, subscriber: Function): void => {
    this.removeSubscriber(type, subscriber);
  };

  // tslint:disable-next-line
  public offViewState = (key: string, subscriber: Function): void => {
    this.removeViewStateSubscriber(key, subscriber);
  };

  public emit<T>(type: EventType, value: T, to?: string[]) {
    if (!this.postMessageHandler) {
      throw new Error("ShellSdk wasn't initialized, message handler not set.");
    }
    // Only root can send a message to a specific node
    this.postMessageHandler(type, value, this.isRoot ? to : undefined);
  }

  public setViewState(key: string, value: any) {
    if (!this.postMessageHandler) {
      throw new Error("ShellSdk wasn't initialized, message handler not set.");
    }
    this.postMessageHandler(SHELL_EVENTS.Version1.SET_VIEW_STATE, {
      key,
      value,
    });
  }

  // tslint:disable-next-line
  private removeSubscriber(type: EventType, subscriber: Function) {
    const subscribers = this.subscribersMap.get(type);
    if (!!subscribers) {
      this.subscribersMap.set(
        type,
        subscribers.filter((it) => it !== subscriber)
      );
    }
  }

  // tslint:disable-next-line
  private removeViewStateSubscriber(type: string, subscriber: Function) {
    const subscribers = this.subscribersViewStateMap.get(type);
    if (!!subscribers) {
      this.subscribersViewStateMap.set(
        type,
        subscribers.filter((it) => it !== subscriber)
      );
    }
  }

  private initMessageApi() {
    this.postMessageHandler = <T>(type: EventType, value: T, to?: string[]) => {
      if (!this.target) {
        throw new Error("ShellSdk wasn't initialized, target is missing.");
      }
      if (!this.origin) {
        throw new Error("ShellSdk wasn't initialized, origin is missing.");
      }

      this.debugger.traceEvent('outgoing', type, value, { to }, true);
      this.target.postMessage({ type, value, to }, this.origin);
    };
    this.winRef.addEventListener('message', this.onMessage);
  }

  /*
    Message handler, generic for all ShellSDK instances but have different behaviours if root of not.

    - If root, we handle all messages to subscribers
    - If not root, and receive a message from an iframe registered as outlet, we send to parent node
    and add node's id to allow return if needed.
    - If not root and receive SET_VIEW_STATE, we set new value on local node and propagate to outlets
    - If not root and receive TO_APP, we handle locally and do not propagate to outlets
    - If not root and receive any message with `to` value, we remove our id and send to destination

    Also define a new event for REQUIRE_CONTEXT which now contains ViewState. To use ViewState binding
    and avoid duplicate key we first provide REQUIRE_CONTEXT to init currrent node, then propagate each
    key of ViewState individualy to match potential subscriptions. To avoid UI glitch after this we
    send an empty REQUIRE_CONTEXT_DONE to eventually adjust UI if needed.
  */
  private onMessage = (event: MessageEvent) => {
    if (!event.data || typeof event.data.type !== 'string') {
      return;
    }

    if (
      event.source !== window.parent &&
      this.allowedOrigins &&
      Array.isArray(this.allowedOrigins) &&
      this.allowedOrigins.length !== 0 &&
      this.allowedOrigins.indexOf(event.origin) === -1
    ) {
      console.error(`${event.origin} is not in the list of known origins`);
      return;
    }

    const payload = event.data as {
      type: EventType;
      value: any;
      from?: string[];
      to?: string[];
    };

    // we ignore LOADING SUCCESS as it is handled by the outlet component itself
    if (payload.type === SHELL_EVENTS.Version1.OUTLET.LOADING_SUCCESS) {
      return;
    }

    // If current instance is not root, we act as middleman node to propagate
    if (!this.isRoot) {
      // Message come from a registered outlet, we send to parent (this.target) with a `from` value
      const source: Window = event.source as Window;

      if (source) {
        // If has a source, we look if it come from one of our HTMLIFrameElement
        const iFrameElement = Array.from(this.outletsMap.keys()).find(
          (frame) => frame.contentWindow === source
        );
        if (iFrameElement && iFrameElement.src) {
          const iFrameOrigin = new URL(iFrameElement.src).origin;
          if (iFrameOrigin !== event.origin) {
            // If it comes from unregistered iFrame we ignore it
            // in order to prevent unauthorized access to the data
            this.debugger.traceEvent(
              'blocked',
              payload.type,
              payload.value,
              { from: payload.from },
              false
            );
            return;
          }

          // If it come from an outlet
          if (payload.type === SHELL_EVENTS.Version1.SET_VIEW_STATE) {
            console.warn(
              '[ShellSDk] A plugin tried to update viewState using SetViewState which is not allowed for security reason.'
            );
            return;
          }
          let from = payload.from || [];
          // If we receive from outlet request_context to fetch plugin from target, we return LOADING_FAIL
          // if too many depth exchanges
          if (
            payload.type === SHELL_EVENTS.Version1.OUTLET.REQUEST_CONTEXT &&
            from.length >= this.outletMaximumDepth
          ) {
            source.postMessage(
              {
                type: SHELL_EVENTS.Version1.OUTLET.LOADING_FAIL,
                value: {
                  target: payload.value.target,
                  error: ErrorType.OUTLET_MAXIMUM_DEPTH,
                },
                to: from,
              },
              this.origin
            );
          } else {
            const uuid = this.outletsMap.get(iFrameElement);
            if (uuid) {
              // this is the uuid outlet used for routing of source object
              from = [...from, uuid];
              this.debugger.traceEvent(
                'outgoing',
                payload.type,
                payload.value,
                { from },
                true
              );
              this.target.postMessage(
                { type: payload.type, value: payload.value, from },
                this.origin
              );
            }
          }
          return;
        } else if (source !== this.target) {
          // ShellSdk now ignore messages from outlets if it has no outlet registered
          return;
        }
      }

      // Propagate SET_VIEW_STATE to childrens's outlet andset value to current subscribers
      if (payload.type === SHELL_EVENTS.Version1.SET_VIEW_STATE) {
        this.outletsMap.forEach((value, key) => {
          if (key.contentWindow) {
            key.contentWindow.postMessage(
              { type: payload.type, value: payload.value },
              this.origin
            );
          }
        });

        const thisSubscribers = this.subscribersViewStateMap.get(
          payload.value.key
        );
        this.debugger.traceEvent(
          'incoming',
          payload.type,
          payload.value,
          {},
          !!thisSubscribers
        );
        if (!!thisSubscribers) {
          for (const subscriber of thisSubscribers) {
            subscriber(payload.value.value);
          }
        }
        return;
      }

      // If ShellSdk receive OUTLET.REQUEST_CONTEXT with only `isConfigurationMode` we propagate to all outlets
      if (
        payload.type === SHELL_EVENTS.Version1.OUTLET.REQUEST_CONTEXT &&
        payload.value.hasOwnProperty('isConfigurationMode') &&
        !payload.value.hasOwnProperty('target') &&
        !payload.value.hasOwnProperty('plugin')
      ) {
        this.outletsMap.forEach((value, key) => {
          if (key.contentWindow) {
            key.contentWindow.postMessage(
              { type: payload.type, value: payload.value },
              this.origin
            );
          }
        });
      }

      // Message has a `to` value, send to an outlet as one to one communication
      if (
        payload.to &&
        payload.to.length !== 0 &&
        payload.type !== SHELL_EVENTS.Version1.TO_APP
      ) {
        this.debugger.traceEvent(
          'outgoing',
          payload.type,
          payload.value,
          { to: payload.to },
          true
        );
        this.outletsMap.forEach((value, key) => {
          if (
            payload.to &&
            payload.to.indexOf(value) !== -1 &&
            key.contentWindow
          ) {
            key.contentWindow.postMessage(
              {
                type: payload.type,
                value: payload.value,
                to: payload.to.filter((id) => id !== value),
              },
              this.origin
            );
          }
        });
        return;
      }
    }

    // If isRoot or message is for me, we send to subscribers/handlers
    const subscribers = this.subscribersMap.get(payload.type);
    this.debugger.traceEvent(
      'incoming',
      payload.type,
      payload.value,
      { from: payload.from },
      !!subscribers
    );

    if (!!subscribers) {
      for (const subscriber of subscribers) {
        subscriber(
          payload.value,
          event.origin,
          payload.type === SHELL_EVENTS.Version1.SET_VIEW_STATE
            ? null
            : payload.from
        );
      }
    }

    // On REQUIRE_CONTEXT, we split and propagate viewState
    // Need to be done AFTER REQUIRE_CONTEXT event in case of plugin need auth or context.
    if (
      !this.isRoot &&
      payload.type === SHELL_EVENTS.Version1.REQUIRE_CONTEXT
    ) {
      const context =
        typeof payload.value === 'string'
          ? JSON.parse(payload.value)
          : payload.value;
      const viewState = context.viewState;
      if (viewState) {
        for (const key of Object.keys(viewState)) {
          const thisSubscribers = this.subscribersViewStateMap.get(`${key}`);
          if (!!thisSubscribers) {
            for (const subscriber of thisSubscribers) {
              subscriber(viewState[key]);
            }
          }
        }
      }
      this.target.postMessage(
        { type: SHELL_EVENTS.Version1.OUTLET.LOADING_SUCCESS },
        this.origin
      );
    }
  };
}
