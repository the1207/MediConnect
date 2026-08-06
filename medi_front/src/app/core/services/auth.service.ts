import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, AuthResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  private tokenSignal = signal<string | null>(localStorage.getItem('token'));
  private userSignal = signal<string | null>(localStorage.getItem('username'));
  private fullNameSignal = signal<string | null>(localStorage.getItem('fullName'));
  private rolesSignal = signal<string[]>(this.getRolesFromStorage());
  private userIdSignal = signal<string | null>(localStorage.getItem('userId'));
  private userNumericIdSignal = signal<string | null>(localStorage.getItem('userNumericId'));
  private medecinIdSignal = signal<string | null>(localStorage.getItem('medecinId'));

  token = computed(() => this.tokenSignal());
  username = computed(() => this.userSignal());
  fullName = computed(() => this.fullNameSignal());
  roles = computed(() => this.rolesSignal());
  isLoggedIn = computed(() => !!this.tokenSignal());
  currentUserId = computed(() => this.userIdSignal());
  currentUserNumericId = computed(() => this.userNumericIdSignal());
  currentMedecinId = computed(() => this.medecinIdSignal());

  private getRolesFromStorage(): string[] {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/v1/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('fullName', response.fullName);
        localStorage.setItem('roles', JSON.stringify(response.roles));
        localStorage.setItem('userId', response.id);
        localStorage.setItem('userNumericId', String(response.userId));
        this.tokenSignal.set(response.token);
        this.userSignal.set(response.username);
        this.fullNameSignal.set(response.fullName);
        this.rolesSignal.set(response.roles);
        this.userIdSignal.set(response.id);
        this.userNumericIdSignal.set(String(response.userId));

        if (response.medecinId !== null && response.medecinId !== undefined) {
          localStorage.setItem('medecinId', String(response.medecinId));
          this.medecinIdSignal.set(String(response.medecinId));
        } else {
          localStorage.removeItem('medecinId');
          this.medecinIdSignal.set(null);
        }
      })
    );
  }

  logout(): void {
    localStorage.clear();
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.fullNameSignal.set(null);
    this.rolesSignal.set([]);
    this.userIdSignal.set(null);
    this.userNumericIdSignal.set(null);
    this.medecinIdSignal.set(null);
    this.router.navigate(['/login']);
  }

  hasRole(role: string): boolean {
    return this.rolesSignal().includes(role) || this.rolesSignal().includes('ROLE_' + role);
  }

  isInfirmiere(): boolean {
    return this.hasRole('INFIRMIER') || this.hasRole('ROLE_INFIRMIER');
  }

  isMedecin(): boolean {
    return this.hasRole('MEDECIN') || this.hasRole('ROLE_MEDECIN');
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN') || this.hasRole('ROLE_ADMIN');
  }

  getRedirectUrl(): string {
    if (this.isInfirmiere()) return '/infirmiere';
    if (this.isMedecin()) return '/medecin';
    if (this.isAdmin()) return '/admin';
    return '/login';
  }
}
