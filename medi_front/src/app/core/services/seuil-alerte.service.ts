import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SeuilAlerte, TypeConstante } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SeuilAlerteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/seuil-alerte`;

  getAll(): Observable<SeuilAlerte[]> {
    return this.http.get<SeuilAlerte[]>(`${this.apiUrl}/all`);
  }

  getByType(type: TypeConstante): Observable<SeuilAlerte> {
    return this.http.get<SeuilAlerte>(`${this.apiUrl}/type/${type}`);
  }
}
