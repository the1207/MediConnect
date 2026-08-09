import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RendezVous } from '../models/mediconnect.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RendezVousService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/rendezVous`;

  get(id: number): Observable<RendezVous> {
    return this.http.get<RendezVous>(`${this.base}/get/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/delete/${id}`);
  }

  refuser(id: number): Observable<void> {
    return this.http.put<void>(`${this.base}/refuser/${id}`, {});
  }

  confirmer(id: number): Observable<void> {
    return this.http.put<void>(`${this.base}/confirmer/${id}`, {});
  }

  getByMedecin(medecinId: number): Observable<RendezVous[]> {
    return this.http.get<RendezVous[]>(`${this.base}/medecin/${medecinId}`);
  }

  getConfirmesByMedecin(medecinId: number): Observable<RendezVous[]> {
    return this.http.get<RendezVous[]>(`${this.base}/medecin/${medecinId}/confirmes`);
  }
}
