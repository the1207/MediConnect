import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RendezVous, RendezVousRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class RendezVousService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/v1`;

  getByMedecin(medecinId: number): Observable<RendezVous[]> {
    return this.http.get<RendezVous[]>(`${this.apiUrl}/medecin/${medecinId}`);
  }

  confirmer(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/rendezvous/${id}/confirmer`, {});
  }

  refuser(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/rendezvous/${id}/refuser`, {});
  }

  create(request: RendezVousRequest): Observable<RendezVous> {
    return this.http.post<RendezVous>(`${this.apiUrl}/rendezvous`, request);
  }
}
