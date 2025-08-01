import { Injectable } from '@angular/core';
import { IUserService } from './user-service.interface';
import { map, Observable } from 'rxjs';
import {
  UserDetail,
  SaveUserRequest,
  SaveUserResponse,
  UpdateUserRequest
} from '../../entities/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PagedResponse } from '../../entities/paged-response.model';
import { transformPagedResponse } from '../../../shared/utils/transform-page-utils';

@Injectable({
  providedIn: 'root'
})
export class UserService implements IUserService {
  constructor(private http: HttpClient) { }

  private readonly baseUrl = `${environment.apiUrl}/users`;

  getAllUsers(): Observable<UserDetail[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(response => transformPagedResponse<UserDetail>(response, 'userSearchResultDTOList')),
      map(pagedResponse => pagedResponse._embedded.DTOList)
    );
  }

  getAllUsersWithPagination(pageNumber: number, pageSize: number): Observable<PagedResponse<UserDetail>> {
    const url = `${this.baseUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<any>(url).pipe(
      map(response => transformPagedResponse<UserDetail>(response, 'userSearchResultDTOList'))
    );
  }

  getUserById(id: string): Observable<UserDetail> {
    return this.http.get<UserDetail>(`${this.baseUrl}/${id}`);
  }

  createUser(saveUserRequest: SaveUserRequest): Observable<SaveUserResponse> {
    return this.http.post<SaveUserResponse>(this.baseUrl, saveUserRequest);
  }

  updateUser(id: string, UpdateUserRequest: UpdateUserRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, UpdateUserRequest);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}
