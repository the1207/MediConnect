import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consultation, RendezVous } from '../models/mediconnect.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MedecinService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/medecin`;

  create(medecin: { nom: string; prenom: string; specialiteId: number }): Observable<any> {
    return this.http.post(`${this.base}/create`, medecin);
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/all`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.base}/get/${id}`);
  }

  getBySpecialite(specialiteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/specialite/${specialiteId}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/delete/${id}`);
  }

  ajouterRendezVous(payload: {
    date: string; heure: string; motif: string;
    patientId: number; medecinId: number; disponibiliteId: number;
  }): Observable<RendezVous> {
    return this.http.post<RendezVous>(`${this.base}/ajouterRendezvous`, { ...payload, statut: null });
  }

  consulterHistorique(id: number): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.base}/historique/${id}`);
  }
}
