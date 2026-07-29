import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Ordonnance, OrdonnanceRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrdonnanceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ordonnance`;

  getAll(): Observable<Ordonnance[]> {
    return this.http.get<Ordonnance[]>(`${this.apiUrl}/all`);
  }

  getById(id: number): Observable<Ordonnance> {
    return this.http.get<Ordonnance>(`${this.apiUrl}/get/${id}`);
  }

  getByPatient(patientId: number): Observable<Ordonnance[]> {
    return this.http.get<Ordonnance[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  getByMedecin(medecinId: number): Observable<Ordonnance[]> {
    return this.http.get<Ordonnance[]>(`${this.apiUrl}/medecin/${medecinId}`);
  }

  create(ordonnance: OrdonnanceRequest): Observable<Ordonnance> {
    return this.http.post<Ordonnance>(`${this.apiUrl}/create`, ordonnance);
  }

  update(id: number, ordonnance: OrdonnanceRequest): Observable<Ordonnance> {
    return this.http.put<Ordonnance>(`${this.apiUrl}/update/${id}`, ordonnance);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  valider(id: number): Observable<Ordonnance> {
    return this.http.put<Ordonnance>(`${this.apiUrl}/valider/${id}`, {});
  }

  marquerImprimee(id: number): Observable<Ordonnance> {
    return this.http.put<Ordonnance>(`${this.apiUrl}/imprimer/${id}`, {});
  }

  getPrintContent(id: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/print/${id}`, { responseType: 'text' });
  }
}
