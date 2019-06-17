
import { ActionType } from '../ShellActions';

export interface Action<T> {
  id: string;
  type: ActionType;
  payload: T;
};
