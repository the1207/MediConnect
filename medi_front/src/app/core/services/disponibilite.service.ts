import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Disponibilite } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DisponibiliteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/disponibilite`;

  getByMedecin(medecinId: number): Observable<Disponibilite[]> {
    return this.http.get<Disponibilite[]>(`${this.apiUrl}/medecin/${medecinId}`);
  }
}
