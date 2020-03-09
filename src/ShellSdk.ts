
import { EventType, SHELL_EVENTS } from './ShellEvents';
import { SHELL_VERSION_INFO } from './ShellVersionInfo';

import { Debugger } from './Debugger';

function findGetParameter(parameterName: string) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

export class ShellSdk {

  public static VERSION = SHELL_VERSION_INFO.VERSION;
  public static BUILD_TS =SHELL_VERSION_INFO.BUILD_TS;

  private static _instance: ShellSdk;

  private clientId: string | null; // Client ID from outlet stuff

  private postMessageHandler: (<T>(type: EventType, value: T, to?: string) => void) | undefined;

  private subscribersMap: Map<EventType, Function[]>
  private subscribersViewStateMap: Map<string, Function[]>

  private debugger: Debugger;
  private outletsMap: Map<string, Window>;

  private constructor(
    private target: Window,
    private origin: string,
    private winRef: Window,
    private debugId: string
  ) {
    this.subscribersMap = new Map();
    this.subscribersViewStateMap = new Map();
    this.outletsMap = new Map();
    this.clientId = findGetParameter('id');
    this.initMessageApi();
    this.debugger = new Debugger(winRef, debugId == '' ? this.clientId || 'mainApp' : debugId);
  }

  public static init(target: Window, origin: string, winRef: Window = window, debugId: string = ''): ShellSdk {
    ShellSdk._instance = new ShellSdk(target, origin, winRef, debugId);
    // TODO :  Need to register as an outlet to set clientId
    // ShellSdk._instance.emit(SHELL_EVENTS.Version1.INIT_VIEW_STATE, {});
    return ShellSdk._instance;
  }

  public static get instance(): ShellSdk {
    if (!ShellSdk._instance) {
      throw new Error('ShellSdk wasn\'t initialized.');
    }
    return ShellSdk._instance;
  }

  public setOutlet(id: string, frame: Window) {
    this.outletsMap.set(id, frame);
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

      if (to) {
        this.target.postMessage({ type, value, to }, this.origin);
      } else {
        this.target.postMessage({ type, value, from: this.clientId }, this.origin);
      }
    });
    this.winRef.addEventListener('message', this.onMessage);
  }

  private onMessage = (event: MessageEvent) => {

    if (!event.data || typeof event.data.type !== 'string') {
      return;
    }
    const payload = event.data as { type: EventType, value: any, from?: string, to?: string };

    if (payload.from && this.target && this.debugId != 'shell-host') { // If from someone else and I'm not shellhost, we send to parent
      this.debugger.traceEvent('outgoing', payload.type, payload.value, { from: payload.from }, true);
      this.target.postMessage({ type: payload.type, value: payload.value, from: payload.from }, this.origin);
    } else if (payload.to && payload.to !== this.clientId) { // If to 
      this.debugger.traceEvent('outgoing', payload.type, payload.value, { to: payload.to }, true);
      const outlet = this.outletsMap.get(payload.to);
      if (outlet) {
        outlet.postMessage({ type: payload.type, value: payload.value, to: payload.to }, this.origin);
      }
    } else {
      // We re are not shell-host and receive SET_VIEW_STATE we send to outlets with key
      if (payload.type == SHELL_EVENTS.Version1.SET_VIEW_STATE && this.debugId != 'shell-host') {
        for (let outlet of Array.from(this.outletsMap.values())) {
          outlet.postMessage({ type: payload.type, value: payload.value, from: payload.from }, this.origin);        
        }
        const subscribers = this.subscribersViewStateMap.get(payload.value.key);
        this.debugger.traceEvent('incoming', payload.type, payload.value, { from: payload.from }, !!subscribers);
        if (!!subscribers) {
          for (const subscriber of subscribers) {
            subscriber(payload.value.value);
          }
        }
      } else if (payload.type == SHELL_EVENTS.Version1.INIT_VIEW_STATE && this.debugId != 'shell-host') {
        for (let key of Object.keys(payload.value)) {
          const subscribers = this.subscribersViewStateMap.get(`${key}`);
          if (!!subscribers) {
            for (const subscriber of subscribers) {
              subscriber(payload.value[key]);
            }
          }
        }
      } else {

        const subscribers = this.subscribersMap.get(payload.type);

        this.debugger.traceEvent('incoming', payload.type, payload.value, { from: payload.from }, !!subscribers);
        // console.log('Sending to local subscribers', payload);

        if (!!subscribers) {
          for (const subscriber of subscribers) {
            subscriber(payload.value, event.origin, payload.from);
          }
        }
      }
    }
  }

}
