
import { EventType, SHELL_EVENTS } from './ShellEvents';
import { SHELL_VERSION_INFO } from './ShellVersionInfo';
import { v4 as uuidv4 } from 'uuid';

import { Debugger } from './Debugger';

export class ShellSdk {

  public static VERSION = SHELL_VERSION_INFO.VERSION;
  public static BUILD_TS = SHELL_VERSION_INFO.BUILD_TS;

  private static _instance: ShellSdk;
  private isRoot: boolean; // true is shell instance, false is in outlet or app

  private postMessageHandler: (<T>(type: EventType, value: T, to?: string[]) => void) | undefined;

  private subscribersMap: Map<EventType, Function[]>
  private subscribersViewStateMap: Map<string, Function[]>

  private debugger: Debugger;
  private outletsMap: Map<Window, string>;


  private constructor(
    private target: Window,
    private origin: string,
    private winRef: Window,
    debugId: string
  ) {
    this.subscribersMap = new Map();
    this.subscribersViewStateMap = new Map();
    this.outletsMap = new Map();
    this.initMessageApi();
    this.debugger = new Debugger(winRef, debugId);
    this.isRoot = target == null;
  }

  public static init(target: Window, origin: string, winRef: Window = window, debugId: string = ''): ShellSdk {
    ShellSdk._instance = new ShellSdk(target, origin, winRef, debugId);
    return ShellSdk._instance;
  }

  public static get instance(): ShellSdk {
    if (!ShellSdk._instance) {
      throw new Error('ShellSdk wasn\'t initialized.');
    }
    return ShellSdk._instance;
  }

  // Called by outlet component to assign an id to a iframe.
  // Allow to answer back a message, and ignore messages from other frame not registered
  public registerOutlet(frame: Window, id: string) {
    this.outletsMap.set(frame, uuidv4());
  }

  public unregisterOutlet(frame: Window) {
    this.outletsMap.delete(frame);
  }

  public setTarget(target: Window, origin: string) {
    const targetChanged = this.target !== target || this.origin !== origin;
    if (targetChanged) {
      this.target = target;
      this.origin = origin;
    }
  }

  public on = (type: EventType, subscriber: Function): Function => {
    if (!this.subscribersMap.has(type)) {
      this.subscribersMap.set(type, []);
    }
    const subscribers = this.subscribersMap.get(type) as Function[];
    subscribers.push(subscriber);
    return () => {
      this.removeSubscriber(type, subscriber);
    };
  }

  public onViewState = (key: string, subscriber: Function): Function => {
    if (!this.subscribersViewStateMap.has(key)) {
      this.subscribersViewStateMap.set(key, []);
    }
    const subscribers = this.subscribersViewStateMap.get(key) as Function[];
    subscribers.push(subscriber);
    return () => {
      this.removeViewStateSubscriber(key, subscriber);
    }
  }

  public off = (type: EventType, subscriber: Function): void => {
    this.removeSubscriber(type, subscriber);
  }

  public offViewState = (key: string, subscriber: Function): void => {
    this.removeViewStateSubscriber(key, subscriber);
  }

  public emit<T>(type: EventType, value: T, to?: string[]) {
    if (!this.postMessageHandler) {
      throw new Error('ShellSdk wasn\'t initialized, message handler not set.');
    }
    this.postMessageHandler(type, value, to);
  }

  public setViewState(key: string, value: any) {
    if (!this.postMessageHandler) {
      throw new Error('ShellSdk wasn\'t initialized, message handler not set.');
    }
    this.postMessageHandler(SHELL_EVENTS.Version1.SET_VIEW_STATE, { key, value });
  }

  private removeSubscriber(type: EventType, subscriber: Function) {
    const subscribers = this.subscribersMap.get(type);
    if (!!subscribers) {
      this.subscribersMap.set(type, subscribers.filter(it => it !== subscriber));
    }
  }

  private removeViewStateSubscriber(type: string, subscriber: Function) {
    const subscribers = this.subscribersViewStateMap.get(type);
    if (!!subscribers) {
      this.subscribersViewStateMap.set(type, subscribers.filter(it => it !== subscriber));
    }
  }

  private initMessageApi() {
    this.postMessageHandler = (<T>(type: EventType, value: T, to?: string[]) => {
      if (!this.target) {
        throw new Error('ShellSdk wasn\'t initialized, target is missing.');
      }
      if (!this.origin) {
        throw new Error('ShellSdk wasn\'t initialized, origin is missing.');
      }

      this.debugger.traceEvent('outgoing', type, value, { to }, true);
      this.target.postMessage({ type, value, to }, this.origin);
    });
    this.winRef.addEventListener('message', this.onMessage);
  }

  private onMessage = (event: MessageEvent) => {

    if (!event.data || typeof event.data.type !== 'string') {
      return;
    }

    const payload = event.data as { type: EventType, value: any, from?: string[], to?: string[] };

    // If current instance is not root, we act as middleman node to propagate
    if (!this.isRoot) {

      // Message come from a registered outlet, we send to parent (this.target) with a `from` value
      const source: Window = <Window>event.source;
      if (source.frameElement && this.outletsMap.get(source)) { // If it come from an outlet
        const outletPosition = this.outletsMap.get(source);
        const from = payload.from || [];
        this.debugger.traceEvent('outgoing', payload.type, payload.value, { from: [...from, outletPosition] }, true);
        this.target.postMessage({ type: payload.type, value: payload.value, from: [...from, outletPosition] }, this.origin);
        return;
      }

      // Message has a `to` value, send to an outlet as one to one communication
      if (payload.to && payload.to.length != 0) {
        this.debugger.traceEvent('outgoing', payload.type, payload.value, { to: payload.to }, true);
        this.outletsMap.forEach((value, key) => {
          if (payload.to && payload.to.indexOf(value) !== -1) {
            key.postMessage({ type: payload.type, value: payload.value, to: payload.to.filter(id => id != value) }, this.origin);
          }
        });
        return;
      }

      // Propagate SET_VIEW_STATE to childrens's outlet andset value to current subscribers
      if (payload.type == SHELL_EVENTS.Version1.SET_VIEW_STATE) {
        this.outletsMap.forEach((value, key) => {
          key.postMessage({ type: payload.type, value: payload.value }, this.origin);
        });

        const subscribers = this.subscribersViewStateMap.get(payload.value.key);
        this.debugger.traceEvent('incoming', payload.type, payload.value, {}, !!subscribers);
        if (!!subscribers) {
          for (const subscriber of subscribers) {
            subscriber(payload.value.value);
          }
        }
        return;
      }
    }

    // If isRoot or message is for me, we send to subscribers/handlers
    const subscribers = this.subscribersMap.get(payload.type);
    this.debugger.traceEvent('incoming', payload.type, payload.value, { from: payload.from }, !!subscribers);

    if (!!subscribers) {
      for (const subscriber of subscribers) {
        subscriber(
          payload.value,
          event.origin,
          payload.type == SHELL_EVENTS.Version1.SET_VIEW_STATE ? null : payload.from
        );
      }
    }

    // On REQUIRE_CONTEXT, we split and propagate viewState
    // Need to be done AFTER REQUIRE_CONTEXT event in case of plugin need auth or context.
    if (!this.isRoot && payload.type == SHELL_EVENTS.Version1.REQUIRE_CONTEXT) {
      const viewState = JSON.parse(payload.value).viewState;
      for (let key of Object.keys(viewState)) {
        const subscribers = this.subscribersViewStateMap.get(`${key}`);
        if (!!subscribers) {
          for (const subscriber of subscribers) {
            subscriber(viewState[key]);
          }
        }
      }
      // Propagate REQUIRE_CONTEXT_DONE to have nice UI
      for (const subscriber of (this.subscribersMap.get(SHELL_EVENTS.Version1.REQUIRE_CONTEXT_DONE) || [])) {
        subscriber();
      }
    }
  }
}
