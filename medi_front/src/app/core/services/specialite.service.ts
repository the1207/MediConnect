import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Specialite, SpecialiteRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class SpecialiteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/specialite`;

  getAll(): Observable<Specialite[]> {
    return this.http.get<Specialite[]>(`${this.apiUrl}/getAll`);
  }

  create(specialite: SpecialiteRequest): Observable<Specialite> {
    return this.http.post<Specialite>(`${this.apiUrl}/create`, specialite);
  }
}
