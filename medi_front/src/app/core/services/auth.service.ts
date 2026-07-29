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

  token = computed(() => this.tokenSignal());
  username = computed(() => this.userSignal());
  fullName = computed(() => this.fullNameSignal());
  roles = computed(() => this.rolesSignal());
  isLoggedIn = computed(() => !!this.tokenSignal());
  currentUserId = computed(() => this.userIdSignal());

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
        this.tokenSignal.set(response.token);
        this.userSignal.set(response.username);
        this.fullNameSignal.set(response.fullName);
        this.rolesSignal.set(response.roles);
        this.userIdSignal.set(response.id);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('fullName');
    localStorage.removeItem('roles');
    localStorage.removeItem('userId');
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.fullNameSignal.set(null);
    this.rolesSignal.set([]);
    this.userIdSignal.set(null);
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
    if (this.isInfirmiere()) {
      return '/infirmiere';
    } else if (this.isMedecin()) {
      return '/medecin';
    } else if (this.isAdmin()) {
      return '/admin';
    }
    return '/login';
  }
}
