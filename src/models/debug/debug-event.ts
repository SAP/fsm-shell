import { EventType } from '../../ShellEvents';
import { TraceEntry } from '../trace/trace-entry.model';

export type EventDirection = 'incoming' | 'outgoing' | 'blocked';
export type EventHandledLabel = 'yes' | 'no' | 'n/a';

export interface DebugEvent<T> {
  timestamp: Date;
  component: string;
  direction: EventDirection;
  handled: EventHandledLabel;
  type: EventType;
  to?: string[];
  from?: string[];
  trace?: TraceEntry[];
  payload: T;
}
