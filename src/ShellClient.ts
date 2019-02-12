
export class ShellClient {

  private static _instance: ShellClient;

  private postMessageHandler: ((type: string, value: any) => void) | undefined;

  private subscribersMap: Map<string, Function[]>

  private constructor(
    private target: Window,
    private origin: string
  ) {
    this.subscribersMap = new Map();
    this.initMessageApi();
  }

  public static init(target: Window, origin: string): ShellClient {
    if (!ShellClient._instance) {
      ShellClient._instance = new ShellClient(target, origin);
    }
    return ShellClient.instance;
  }

  public static get instance(): ShellClient {
    if (!ShellClient._instance) {
      throw new Error('ShellClient wasn\'t initialized.');
    }
    return ShellClient._instance;
  }

  public setTarget(target: Window, origin: string) {
    const targetChanged = this.target !== target || this.origin !== origin;
    if (targetChanged) {
      this.target = target;
      this.origin = origin;
    }
  }


  public on = (type: string, subscriber: Function): Function => {
    if (!this.subscribersMap.has(type)) {
      this.subscribersMap.set(type, []);
    }
    const subscribers = this.subscribersMap.get(type) as Function[];
    subscribers.push(subscriber);
    return () => {
      this.removeSubscriber(type, subscriber);
    };
  }

  public off = (type: string, subscriber: Function): void => {
    this.removeSubscriber(type, subscriber);
  }

  public emit<T>(type: string, value: T) {
    if (!this.postMessageHandler) {
      throw new Error('ShellClient wasn\'t initialized, message handler not set.');
    }
    this.postMessageHandler(type, value);
  }


  private removeSubscriber(type: string, subscriber: Function) {
    const subscribers = this.subscribersMap.get(type);
    if (!!subscribers) {
      this.subscribersMap.set(type, subscribers.filter(it => it !== subscriber));
    }
  }

  private initMessageApi() {
    this.postMessageHandler = (type: string, value: string) => {
      if (!this.target || !this.origin) {
        throw new Error('ShellClient wasn\'t initialized, target is missing.');
      }
      this.target.postMessage({ type, value }, this.origin);
    }
    window.addEventListener('message', this.onMessage);
  }

  private onMessage = (event: MessageEvent) => {
    const payload = event.data as { type: string, value: any };
    const subscribers = this.subscribersMap.get(payload.type);
    if (!!subscribers) {
      for (const subscriber of subscribers) {
        subscriber(payload.value);
      }
    }
  }

}
