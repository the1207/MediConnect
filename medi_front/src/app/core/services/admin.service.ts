import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserRoleReponse, UserCreateRequest, HistoryEntry } from '../models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/v1`;

  getAllUsers(): Observable<UserRoleReponse[]> {
    return this.http.get<UserRoleReponse[]>(`${this.apiUrl}/users`);
  }

  createUser(user: UserCreateRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user);
  }

  deleteUser(publicId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${publicId}`);
  }

  enableUser(publicId: string): Observable<void> {
    return this.http.get<void>(`${this.apiUrl}/user-enable-true/${publicId}`);
  }

  getHistory(): Observable<HistoryEntry[]> {
    return this.http.get<HistoryEntry[]>(`${this.apiUrl}/history`);
  }
}
