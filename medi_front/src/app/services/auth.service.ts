import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthenticationResponse, LoginRequest, AppRole } from '../models/auth.models';

const STORAGE_KEY = 'mediconnect_auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private authData = signal<AuthenticationResponse | null>(this.readFromStorage());

  currentUserId = computed(() => this.authData()?.userId ?? null);
  publicId = computed(() => this.authData()?.id ?? null);
  fullName = computed(() => this.authData()?.fullName ?? '');
  username = computed(() => this.authData()?.username ?? '');
  medecinId = computed(() => this.authData()?.medecinId ?? null);
  roles = computed(() => this.authData()?.roles ?? []);
  token = computed(() => this.authData()?.token ?? null);
  isLoggedIn = computed(() => !!this.authData());

  role = computed<AppRole | null>(() => {
    const roles = this.roles();
    if (roles.includes('ROLE_ADMIN')) return 'ADMIN';
    if (roles.includes('ROLE_MEDECIN')) return 'MEDECIN';
    if (roles.includes('ROLE_INFIRMIER')) return 'INFIRMIER';
    return null;
  });

  login(credentials: LoginRequest) {
    return this.http.post<AuthenticationResponse>(`${environment.apiUrl}/api/v1/login`, credentials).pipe(
      tap(response => {
        this.authData.set(response);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(response));
      })
    );
  }

  logout() {
    this.authData.set(null);
    localStorage.removeItem(STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  private readFromStorage(): AuthenticationResponse | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthenticationResponse;
    } catch {
      return null;
    }
  }

  hasRole(role: AppRole): boolean {
    return this.role() === role;
  }
}
