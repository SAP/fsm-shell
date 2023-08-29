export interface Permission {
  CREATE: boolean;
  READ: boolean;
  UPDATE: boolean;
  DELETE: boolean;
  UI_PERMISSIONS: number[];
}
