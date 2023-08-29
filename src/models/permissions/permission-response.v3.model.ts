import { Permission } from './permission.model';

export interface PermissionResponseV3 {
  objectName: string;
  permission: Permission;
}
