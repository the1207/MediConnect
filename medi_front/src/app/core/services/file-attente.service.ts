import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FileAttente, FileAttenteRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FileAttenteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/file-attente`;

  getAll(): Observable<FileAttente[]> {
    return this.http.get<FileAttente[]>(`${this.apiUrl}/all`);
  }

  getEnAttente(): Observable<FileAttente[]> {
    return this.http.get<FileAttente[]>(`${this.apiUrl}/en-attente`);
  }

  create(request: FileAttenteRequest): Observable<FileAttente> {
    return this.http.post<FileAttente>(`${this.apiUrl}/create`, request);
  }

  passerEnConsultation(id: number): Observable<FileAttente> {
    return this.http.put<FileAttente>(`${this.apiUrl}/en-consultation/${id}`, {});
  }

  terminer(id: number): Observable<FileAttente> {
    return this.http.put<FileAttente>(`${this.apiUrl}/terminer/${id}`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
