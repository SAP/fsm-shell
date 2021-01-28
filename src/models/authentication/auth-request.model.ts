export type AuthResponseType = 'token' | 'code';

export interface AuthRequest {
  response_type: AuthResponseType;
}
