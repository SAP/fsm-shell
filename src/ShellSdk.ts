
import { EventType } from './ShellEvents';
import { SHELL_VERSION_INFO } from './ShellVersionInfo';

export class ShellSdk {

  public static VERSION = SHELL_VERSION_INFO.VERSION;
  public static BUILD_TS =SHELL_VERSION_INFO.BUILD_TS;

  private static _instance: ShellSdk;

  private postMessageHandler: (<T>(type: EventType, value: T) => void) | undefined;

  private subscribersMap: Map<EventType, Function[]>

  private constructor(
    private target: Window,
    private origin: string,
    private winRef: Window
  ) {
    this.subscribersMap = new Map();
    this.initMessageApi();
  }

  public static init(target: Window, origin: string, winRef: Window = window): ShellSdk {
    ShellSdk._instance = new ShellSdk(target, origin, winRef);
    return ShellSdk._instance;
  }

  public static get instance(): ShellSdk {
    if (!ShellSdk._instance) {
      throw new Error('ShellSdk wasn\'t initialized.');
    }
    return ShellSdk._instance;
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

  public off = (type: EventType, subscriber: Function): void => {
    this.removeSubscriber(type, subscriber);
  }

  public emit<T>(type: EventType, value: T) {
    if (!this.postMessageHandler) {
      throw new Error('ShellSdk wasn\'t initialized, message handler not set.');
    }
    this.postMessageHandler(type, value);
  }


  private removeSubscriber(type: EventType, subscriber: Function) {
    const subscribers = this.subscribersMap.get(type);
    if (!!subscribers) {
      this.subscribersMap.set(type, subscribers.filter(it => it !== subscriber));
    }
  }

  private initMessageApi() {
    this.postMessageHandler = (<T>(type: EventType, value: T) => {
      if (!this.target) {
        throw new Error('ShellSdk wasn\'t initialized, target is missing.');
      }
      if (!this.origin) {
        throw new Error('ShellSdk wasn\'t initialized, origin is missing.');
      }
      this.target.postMessage({ type, value }, this.origin);
    });
    this.winRef.addEventListener('message', this.onMessage);
  }

  private onMessage = (event: MessageEvent) => {
    const payload = event.data as { type: EventType, value: any };
    const subscribers = this.subscribersMap.get(payload.type);
    if (!!subscribers) {
      for (const subscriber of subscribers) {
        subscriber(payload.value, event.origin);
      }
    }
  }

}
