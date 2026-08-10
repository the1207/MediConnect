import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDTO, UserRoleReponse, HistoryReponse } from '../models/mediconnect.models';
import { environment } from '../../environments/environment';

export interface RoleDTO { id: number; name: string; }

@Injectable({ providedIn: 'root' })
export class AdminUserService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/v1`;

  getAllRoles(): Observable<RoleDTO[]> {
    return this.http.get<RoleDTO[]>(`${this.base}/role`);
  }

  createUser(user: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.base}/users`, user);
  }

  getAllUsers(): Observable<UserRoleReponse[]> {
    return this.http.get<UserRoleReponse[]>(`${this.base}/users`);
  }

  getUserById(id: number): Observable<UserRoleReponse> {
    return this.http.get<UserRoleReponse>(`${this.base}/users/${id}`);
  }

  updateUser(publicId: string, user: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.base}/users/${publicId}`, user);
  }

  deleteUser(publicId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/users/${publicId}`);
  }

  enableUser(publicId: string): Observable<void> {
    return this.http.get<void>(`${this.base}/user-enable-true/${publicId}`);
  }

  getAllHistory(): Observable<HistoryReponse[]> {
    return this.http.get<HistoryReponse[]>(`${this.base}/history`);
  }
}
