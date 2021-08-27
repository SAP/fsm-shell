import { AuthRequest } from '../authentication/auth-request.model';

export interface RequireContextRequest {
  clientIdentifier: string;
  clientSecret: string;
  cloudStorageKeys?: string[];
  auth?: AuthRequest;
  targetOutletName?: string;
}
