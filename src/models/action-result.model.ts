
export interface ActionResult<T> {
  id: string;
  payload?: T;
  error?: any;
};
