import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RendezVous, RendezVousRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class RendezVousService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getByMedecin(medecinId: number): Observable<RendezVous[]> {
    return this.http.get<RendezVous[]>(`${this.apiUrl}/rendezVous/medecin/${medecinId}`);
  }

  getConfirmesByMedecin(medecinId: number): Observable<RendezVous[]> {
    return this.http.get<RendezVous[]>(`${this.apiUrl}/rendezVous/medecin/${medecinId}/confirmes`);
  }

  confirmer(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/rendezVous/confirmer/${id}`, {});
  }

  refuser(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/rendezVous/refuser/${id}`, {});
  }

  create(request: RendezVousRequest): Observable<RendezVous> {
    return this.http.post<RendezVous>(`${this.apiUrl}/medecin/ajouterRendezvous`, request);
  }
}
