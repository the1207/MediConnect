import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ordonnance } from '../models/mediconnect.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrdonnanceService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/ordonnance`;

  create(ordonnance: Ordonnance): Observable<any> {
    return this.http.post(`${this.base}/create`, ordonnance);
  }

  valider(id: number): Observable<any> {
    return this.http.put(`${this.base}/valider/${id}`, {});
  }

  marquerImprimee(id: number): Observable<any> {
    return this.http.put(`${this.base}/imprimer/${id}`, {});
  }

  imprimer(id: number): Observable<string> {
    return this.http.get(`${this.base}/print/${id}`, { responseType: 'text' });
  }
}
