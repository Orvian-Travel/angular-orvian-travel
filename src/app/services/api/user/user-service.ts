import { Injectable } from '@angular/core';
import { IUserService } from './user-service.interface';
import { Observable } from 'rxjs';
import { UserDetail, SaveUserRequest, SaveUserResponse, UpdateUserRequest } from '../../entities/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService implements IUserService {
  constructor(private http: HttpClient) { }

  private readonly baseUrl = `${environment.apiUrl}/users`;

  getAllUsers(pageNumber: number, pageSize: number): Observable<UserDetail[]> {
    throw new Error('Method not implemented.');
  }

  getAllUsersWithPagination(pageNumber: number, pageSize: number): Observable<void> {
    throw new Error('Method not implemented.');
  }

  getUserById(id: string): Observable<UserDetail> {
    throw new Error('Method not implemented.');
  }

  createUser(SaveUserRequest: SaveUserRequest): Observable<SaveUserResponse> {
    throw new Error('Method not implemented.');
  }

  updateUser(id: string, UpdateUserRequest: UpdateUserRequest): Observable<void> {
    throw new Error('Method not implemented.');
  }

  deleteUser(id: string): Observable<void> {
    throw new Error('Method not implemented.');
  }

}
