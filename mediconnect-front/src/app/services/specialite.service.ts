import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Specialite } from '../models/mediconnect.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SpecialiteService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/specialite`;

  create(nom: string): Observable<Specialite> {
    return this.http.post<Specialite>(`${this.base}/create`, { nom });
  }

  getAll(): Observable<Specialite[]> {
    return this.http.get<Specialite[]>(`${this.base}/getAll`);
  }

  update(id: number, nom: string): Observable<Specialite> {
    return this.http.put<Specialite>(`${this.base}/update/${id}`, { nom });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/delete/${id}`);
  }
}
