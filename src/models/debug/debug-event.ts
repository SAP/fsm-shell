
import { EventType } from '../../ShellEvents';

export type EventDirection = 'incoming' | 'outgoing';
export type EventHandledLabel = 'yes' | 'no' | 'n/a';

export interface DebugEvent<T> {
  timestamp: Date,
  component: string,
  direction: EventDirection,
  handled: EventHandledLabel,
  type: EventType,
  payload: T;
}
