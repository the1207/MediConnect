import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Disponibilite } from '../models/mediconnect.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DisponibiliteService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/disponibilite`;

  create(payload: { dateCreneau: string; heureDebut: string; heureFin: string; medecinId: number; capacity?: number }): Observable<Disponibilite> {
    return this.http.post<Disponibilite>(`${this.base}/create`, payload);
  }

  getByMedecin(medecinId: number): Observable<Disponibilite[]> {
    return this.http.get<Disponibilite[]>(`${this.base}/medecin/${medecinId}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/delete/${id}`);
  }
}
