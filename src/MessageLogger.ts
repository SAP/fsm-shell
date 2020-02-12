
import { DebugEvent, EventDirection } from './models/debug/debug-event';
import { EventType } from './ShellEvents';

interface FilterOptions {
  type?: EventType[] | EventType,
  direction?: EventDirection,
  component: string | string[],
  handled: boolean,
  from: Date,
  to: Date
}

export class MessageLogger {

  public messages: DebugEvent<any>[] = [];

  public push(event: DebugEvent<any>, debugId: string) {
    let action: string;
    if (event.direction === 'incoming') {
      if (event.handled === 'yes') {
        action = 'received and handled';
      } else {
        action = 'received and skipped';
      }
    } else {
      action = 'sending';
    }
    console.log(`${debugId} ${action} message: `, event);
    this.messages.push(event);
  }

  public all() {
    return this.messages;
  }

  public allTable() {
    console.table(this.all());
  }

  public filter(options: FilterOptions) {
    return this.messages.filter(message => {

      if (options.type) {
        if (Array.isArray(options.type) && !options.type.some(type => new RegExp(type).test(message.type))) {
          return false;
        } else if (typeof options.type === 'string' && !RegExp(options.type as string).test(message.type)) {
          return false;
        }
      }

      if (options.component) {
        if (Array.isArray(options.component) && !options.component.some(it => it === message.component)) {
          return false;
        } else if (options.component !== message.component) {
          return false;
        }
      }

      if (options.direction && options.direction !== message.direction) {
        return false;
      }

      if (
        options.direction &&
        options.direction === 'incoming' &&
        typeof options.handled !== 'undefined' &&
        options.handled !== (message.handled === 'yes')
      ) {
        return false;
      }

      if (options.from && options.from > message.timestamp) {
        return false;
      }

      if (options.to && options.to < message.timestamp) {
        return false;
      }

      return true;
    });
  }

  public filterTable(options: FilterOptions) {
    console.table(this.filter(options));
  }

}
