import { EventType } from '../../ShellEvents';

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
  payload: T;
}
