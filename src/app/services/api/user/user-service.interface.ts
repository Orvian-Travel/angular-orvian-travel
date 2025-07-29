import { Observable } from "rxjs";
import {
  UserDetail,
  SaveUserRequest,
  SaveUserResponse,
  UpdateUserRequest
} from "../../entities/user.model";
import { PagedResponse } from "../../entities/paged-response.model";

export interface IUserService {
  getAllUsers(): Observable<UserDetail[]>;

  getAllUsersWithPagination(pageNumber: number, pageSize: number): Observable<PagedResponse<UserDetail>>;

  getUserById(id: string): Observable<UserDetail>;

  createUser(SaveUserRequest: SaveUserRequest): Observable<SaveUserResponse>;

  updateUser(id: string, UpdateUserRequest: UpdateUserRequest): Observable<void>;

  deleteUser(id: string): Observable<void>;
}
