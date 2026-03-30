export interface PermissionRequestV2Payload {
  objectName: string;
  owners?: string[];
}

export type PermissionRequestV2 = PermissionRequestV2Payload | PermissionRequestV2Payload[];
