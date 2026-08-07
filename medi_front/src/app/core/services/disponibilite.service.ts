import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Disponibilite, DisponibiliteRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DisponibiliteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/disponibilite`;

  getByMedecin(medecinId: number): Observable<Disponibilite[]> {
    return this.http.get<Disponibilite[]>(`${this.apiUrl}/medecin/${medecinId}`);
  }

  create(disponibilite: DisponibiliteRequest): Observable<Disponibilite> {
    return this.http.post<Disponibilite>(`${this.apiUrl}/create`, disponibilite);
  }

  marquerOccupe(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/reserver/${id}`, {});
  }

  liberer(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/liberer/${id}`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
