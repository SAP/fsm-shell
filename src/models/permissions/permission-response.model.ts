
import { Permission } from './permission.model';

export interface PermissionResponse {
  objectName: string;
  owners?: string[];
  permission: Permission;
}
