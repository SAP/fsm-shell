
import { EventType, SHELL_EVENTS } from './ShellEvents';
import { ActionType } from './ShellActions';

import {
  Deferred,
  Action,
  ActionResult
} from './models/index';

export class ShellSdk {

  private static _instance: ShellSdk;

  private postMessageHandler: (<T>(type: EventType, value: T) => void) | undefined;

  private subscribersMap: Map<EventType, Function[]>;
  private defferedMap: Map<string, Deferred>;

  private constructor(
    private target: Window,
    private origin: string,
    private winRef: Window
  ) {
    this.subscribersMap = new Map();
    this.defferedMap = new Map();
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

  public action<T>(type: ActionType, value: T): Promise<any> {
    const actionId = this.generateUUID();
    return new Promise((resolve, reject) => {
      this.defferedMap.set(actionId, {
        resolve,
        reject
      });
      this.sendAction<T>({
        id: actionId,
        type,
        payload: value
      });
    });
  }

  public actionSuccess<T>(actionId: string, value: T) {
    this.sendActionResult({
      id: actionId,
      payload: value
    });
  }

  public actionFail(actionId: string, error: any) {
    this.sendActionResult({
      id: actionId,
      error
    });
  }

  private removeSubscriber(type: EventType, subscriber: Function) {
    const subscribers = this.subscribersMap.get(type);
    if (!!subscribers) {
      this.subscribersMap.set(type, subscribers.filter(it => it !== subscriber));
    }
  }

  private sendAction<T>(action: Action<T>) {
    if (!this.postMessageHandler) {
      throw new Error('ShellSdk wasn\'t initialized, message handler not set.');
    }
    this.postMessageHandler(SHELL_EVENTS.Version1.SEND_ACTION, action);
  }

  private sendActionResult<T>(result: ActionResult<T>) {
    if (!this.postMessageHandler) {
      throw new Error('ShellSdk wasn\'t initialized, message handler not set.');
    }
    this.postMessageHandler(SHELL_EVENTS.Version1.SEND_ACTION_RESULT, result);
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
        subscriber(payload.value);
      }
    }
    if (payload.type === SHELL_EVENTS.Version1.SEND_ACTION_RESULT) {
      this.onActionDone(payload.value as ActionResult<any>);
    }
  }

  private onActionDone(result: ActionResult<any>) {
    const deferred = this.defferedMap.get(result.id);
    if (!!deferred) {
      if (!!result.error) {
        deferred.reject(result.error);
      } else {
        deferred.resolve(result.payload);
      }
      this.defferedMap.delete(result.id);
    }
  }

  private generateUUID(): string {
    const pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return pattern.replace(/[xy]/g, source => {
      // tslint:disable
      const random = Math.random() * 16 | 0;
      const digit = source === 'x' ? random : (random & 0x3 | 0x8);
      // tslint:enable
      return digit.toString(16);
    });
  }

}
