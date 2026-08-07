import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Medecin, MedecinRequest, RendezVousRequest, RendezVous } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MedecinService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/medecin`;

  getAll(): Observable<Medecin[]> {
    return this.http.get<Medecin[]>(`${this.apiUrl}/all`);
  }

  getBySpecialite(specialiteId: number): Observable<Medecin[]> {
    return this.http.get<Medecin[]>(`${this.apiUrl}/specialite/${specialiteId}`);
  }

  create(medecin: MedecinRequest): Observable<Medecin> {
    return this.http.post<Medecin>(`${this.apiUrl}/create`, medecin);
  }

  ajouterRendezVous(request: RendezVousRequest): Observable<RendezVous> {
    return this.http.post<RendezVous>(`${this.apiUrl}/ajouterRendezvous`, request);
  }
}
