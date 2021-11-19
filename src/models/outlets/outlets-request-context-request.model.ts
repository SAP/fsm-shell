export interface OutletsRequestContextRequest {
  target: string;
  assignmentId?: string;
  showMocks?: boolean;
  outletSettings?: { [name: string]: any };
}
