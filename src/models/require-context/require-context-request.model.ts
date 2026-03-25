import { AuthRequest } from '../authentication/auth-request.model';
import { CloudStorageKey } from '../cloud-storage/cloud-storage-key.model';

export interface RequireContextRequest {
  clientIdentifier: string;
  clientSecret: string;
  cloudStorageKeys?: CloudStorageKey[];
  auth?: AuthRequest;
  targetOutletName?: string;
  targetExtensionAssignmentId?: string;
}
