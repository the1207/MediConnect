import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constante } from '../models/mediconnect.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConstanteService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/constante`;

  create(constante: Constante): Observable<Constante> {
    return this.http.post<Constante>(`${this.base}/create`, constante);
  }

  getByPatient(patientId: number): Observable<Constante[]> {
    return this.http.get<Constante[]>(`${this.base}/patient/${patientId}`);
  }
}
