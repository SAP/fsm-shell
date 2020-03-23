
import { EventType, ALL_SHELL_EVENTS_ARRAY } from './ShellEvents';
import { EventDirection, DebugEvent } from './models/debug/debug-event';
import { MessageLogger } from './MessageLogger';

interface DebuggableWindow extends Window {
  fsmShellMessageLogger: MessageLogger | undefined;
}

interface Routing {
  to?: string[];
  from?: string[];
}

const FSM_SHELL_DEBUG_KEY = 'cs.fsm-shell.debug';

export class Debugger {

  private debugMode: boolean = false;

  constructor(
    private winRef: Window,
    private debugId: string
  ) {
    if (this.debugId) {
      const win = this.winRef as DebuggableWindow;
      const localStorageValue = win.localStorage.getItem(FSM_SHELL_DEBUG_KEY);
      if (!!localStorageValue && localStorageValue.split(',').some(it => it === debugId)) {
        this.debugMode = true;
      }
    }
  }

  public traceEvent(direction: EventDirection, type: EventType, payload: any, routing: Routing, hasHandler: boolean) {
    if (this.debugMode && ALL_SHELL_EVENTS_ARRAY.some(it => it === type)) {
      const debugEvent: DebugEvent<any> = {
        timestamp: new Date(),
        component: this.debugId,
        direction,
        type,
        handled: direction === 'incoming' ? (hasHandler ? 'yes' : 'no') : 'n/a',
        to: routing.to,
        from: routing.from,
        payload
      }
      this.logEvent(debugEvent);
    }
  }

  private logEvent(debugEvent: DebugEvent<any>) {
    const win = this.winRef as DebuggableWindow;
    if (!win.fsmShellMessageLogger) {
      win.fsmShellMessageLogger = new MessageLogger();
    }
    win.fsmShellMessageLogger.push(debugEvent, this.debugId);
  }

}
