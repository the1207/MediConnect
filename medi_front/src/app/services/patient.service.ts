import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient, Consultation } from '../models/mediconnect.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/patient`;

  create(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(`${this.base}/create`, patient);
  }

  getById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.base}/get/${id}`);
  }

  rechercher(nom: string): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.base}/recherche`, { params: { nom } });
  }

  consulterHistorique(id: number): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.base}/historique/${id}`);
  }
}
