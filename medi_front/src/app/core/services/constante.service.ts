import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Constante, ConstanteRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ConstanteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/constante`;

  getAll(): Observable<Constante[]> {
    return this.http.get<Constante[]>(`${this.apiUrl}/all`);
  }

  getById(id: number): Observable<Constante> {
    return this.http.get<Constante>(`${this.apiUrl}/get/${id}`);
  }

  getByPatient(patientId: number): Observable<Constante[]> {
    return this.http.get<Constante[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  getLatestByPatient(patientId: number): Observable<Constante> {
    return this.http.get<Constante>(`${this.apiUrl}/patient/${patientId}/latest`);
  }

  create(constante: ConstanteRequest): Observable<Constante> {
    return this.http.post<Constante>(`${this.apiUrl}/create`, constante);
  }

  update(id: number, constante: ConstanteRequest): Observable<Constante> {
    return this.http.put<Constante>(`${this.apiUrl}/update/${id}`, constante);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
