import { Observable } from "rxjs";
import { TokenModel } from "../../entities/token-model";

export interface IAuthService {
    login(username: string, password: string): Observable<TokenModel>;
}