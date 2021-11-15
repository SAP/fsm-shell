export interface OutletsRequestContextRequest<T> {
  target: string;
  showMocks?: boolean;
  outletSettings?: { [name: string]: any };
}
