import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Consultation, ConsultationRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class ConsultationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/consultation`;

  create(request: ConsultationRequest): Observable<Consultation> {
    return this.http.post<Consultation>(`${this.apiUrl}/create`, request);
  }

  getByPatient(patientId: number): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${environment.apiUrl}/patient/historique/${patientId}`);
  }
}
