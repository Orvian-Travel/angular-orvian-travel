import { Observable } from "rxjs";

export interface IPasswordResetService {
  requestPasswordReset(email: string): Observable<void>;
  resetPassword(token: string, newPassword: string): Observable<void>;
}