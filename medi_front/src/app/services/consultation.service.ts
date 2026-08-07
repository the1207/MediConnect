import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consultation } from '../models/mediconnect.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConsultationService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/consultation`;

  create(payload: { motif: string; actionsRequis?: string; medecinId: number; patientId: number }): Observable<Consultation> {
    return this.http.post<Consultation>(`${this.base}/create`, payload);
  }

  update(id: number, payload: { motif: string; actionsRequis?: string; ordonnanceId?: number }): Observable<Consultation> {
    return this.http.put<Consultation>(`${this.base}/update/${id}`, payload);
  }

  get(id: number): Observable<Consultation> {
    return this.http.get<Consultation>(`${this.base}/get/${id}`);
  }
}
