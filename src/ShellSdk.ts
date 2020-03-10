
import { EventType, SHELL_EVENTS } from './ShellEvents';
import { SHELL_VERSION_INFO } from './ShellVersionInfo';

import { Debugger } from './Debugger';

export class ShellSdk {

  public static VERSION = SHELL_VERSION_INFO.VERSION;
  public static BUILD_TS =SHELL_VERSION_INFO.BUILD_TS;

  private static _instance: ShellSdk;

  private postMessageHandler: (<T>(type: EventType, value: T, to?: string) => void) | undefined;

  private subscribersMap: Map<EventType, Function[]>
  private subscribersViewStateMap: Map<string, Function[]>

  private debugger: Debugger;
  private outletsMap: Map<Window, string>;

  private constructor(
    private target: Window,
    private origin: string,
    private winRef: Window,
    private debugId: string
  ) {
    this.subscribersMap = new Map();
    this.subscribersViewStateMap = new Map();
    this.outletsMap = new Map();
    this.initMessageApi();
    this.debugger = new Debugger(winRef, debugId);
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

  public setOutlet(id: string, frame: Window) {
    this.outletsMap.set(frame, id);
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
      this.offViewState(key, subscriber);
    }
  }

  public off = (type: EventType, subscriber: Function): void => {
    this.removeSubscriber(type, subscriber);
  }

  public offViewState = (key: string, subscriber: Function): void => {
    this.removeViewStateSubscriber(key, subscriber);
  }

  public emit<T>(type: EventType, value: T, to?: string) {
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

  public initViewState() {
    if (!this.postMessageHandler) {
      throw new Error('ShellSdk wasn\'t initialized, message handler not set.');
    }
    this.postMessageHandler(SHELL_EVENTS.Version1.INIT_VIEW_STATE, {});
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
    this.postMessageHandler = (<T>(type: EventType, value: T, to?: string) => {
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

    const payload = event.data as { type: EventType, value: any, from?: string, to?: string };
    const isShellHost = this.debugId === 'shell-host';

    // Message come from an outlet, we send to parent (this.target) and add `from` value
    const source: Window = <Window>event.source;
    if (source.frameElement && this.outletsMap.get(source)) {
      const outletPosition = this.outletsMap.get(source);
      this.debugger.traceEvent('outgoing', payload.type, payload.value, { from: outletPosition }, true);
      this.target.postMessage({ type: payload.type, value: payload.value, from: outletPosition }, this.origin);
      return;
    }

    // Message has a from value and I am not shell-host, so just propagate to parent
    if (payload.from && this.target && !isShellHost) {     
      this.debugger.traceEvent('outgoing', payload.type, payload.value, { from: payload.from }, true);
      this.target.postMessage({ type: payload.type, value: payload.value, from: payload.from }, this.origin);
      return;
    }

    // Message has a `to` value, we act as Middleman and send to an outlet
    if (payload.to && !isShellHost) { // If to 
      this.debugger.traceEvent('outgoing', payload.type, payload.value, { to: payload.to }, true);
      this.outletsMap.forEach((value, key) => {
        if (value === payload.to) {
          key.postMessage({ type: payload.type, value: payload.value }, this.origin);
        }
      });
      return;
    }

    // We re are not shell-host and receive SET_VIEW_STATE we send to outlets with key
    if (payload.type == SHELL_EVENTS.Version1.SET_VIEW_STATE && !isShellHost) {
      this.outletsMap.forEach((value, key) => {
        key.postMessage({ type: payload.type, value: payload.value }, this.origin);
      });

      const subscribers = this.subscribersViewStateMap.get(payload.value.key);
      this.debugger.traceEvent('incoming', payload.type, payload.value, { from: payload.from }, !!subscribers);
      if (!!subscribers) {
        for (const subscriber of subscribers) {
          subscriber(payload.value.value);
        }
      }
      return;
    }

    // We propagate init_view_state
    if (payload.type == SHELL_EVENTS.Version1.INIT_VIEW_STATE && !isShellHost) {
      for (let key of Object.keys(payload.value)) {
        const subscribers = this.subscribersViewStateMap.get(`${key}`);
        if (!!subscribers) {
          for (const subscriber of subscribers) {
            subscriber(payload.value[key]);
          }
        }
      }
      return;
    } 

    // Generic case, this message is for me, I receive and handle it.
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
  }

}
