import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-container">
        <div class="login-left">
          <div class="login-left-content">
            <div class="logo-area">
              <div class="logo-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <h1>MediConnect</h1>
            </div>
            <p class="login-description">
              Plateforme de gestion médicale intégrée pour le suivi des patients,
              la prise de constantes et la prescription d'ordonnances.
            </p>
            <div class="features-list">
              <div class="feature-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span>Suivi des constantes en temps réel</span>
              </div>
              <div class="feature-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span>Alertes automatiques sur les seuils</span>
              </div>
              <div class="feature-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span>Prescription et ordonnances numériques</span>
              </div>
              <div class="feature-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span>Planification de rendez-vous</span>
              </div>
            </div>
          </div>
        </div>

        <div class="login-right">
          <div class="login-form-wrapper">
            <h2>Connexion</h2>
            <p class="form-subtitle">Entrez vos identifiants pour accéder à votre espace</p>

            @if (error()) {
              <div class="alert alert-danger">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{{ error() }}</span>
              </div>
            }

            <form (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label class="form-label">Email</label>
                <input
                  type="email"
                  class="form-input"
                  [(ngModel)]="username"
                  name="username"
                  placeholder="Entrez votre email"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">Mot de passe</label>
                <input
                  type="password"
                  class="form-input"
                  [(ngModel)]="password"
                  name="password"
                  placeholder="Entrez votre mot de passe"
                  required
                />
              </div>

              <button
                type="submit"
                class="btn btn-primary btn-submit"
                [disabled]="loading()"
              >
                @if (loading()) {
                  <span class="spinner spinner-sm"></span>
                  Connexion...
                } @else {
                  Se connecter
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-page);
      padding: 24px;
    }

    .login-container {
      display: flex;
      width: 100%;
      max-width: 1040px;
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-card);
      border: 1px solid var(--border-default);
      overflow: hidden;
      min-height: 600px;
    }

    .login-left {
      flex: 1;
      background: var(--bg-sidebar);
      padding: 48px;
      display: flex;
      align-items: center;
    }

    .login-left-content {
      color: white;
    }

    .logo-area {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }

    .logo-icon {
      width: 48px;
      height: 48px;
      background: rgba(60, 80, 224, 0.2);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #80CAEE;
    }

    .logo-area h1 {
      font-size: 24px;
      font-weight: 700;
      color: white;
    }

    .login-description {
      font-size: 15px;
      color: var(--text-sidebar);
      line-height: 1.6;
      margin-bottom: 32px;
    }

    .features-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--text-sidebar);
      font-size: 14px;
    }

    .feature-item svg {
      color: #10B981;
      flex-shrink: 0;
    }

    .login-right {
      flex: 1;
      padding: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .login-form-wrapper {
      width: 100%;
      max-width: 380px;
    }

    .login-form-wrapper h2 {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    .form-subtitle {
      font-size: 14px;
      color: var(--text-secondary);
      margin-bottom: 24px;
    }

    .alert {
      margin-bottom: 20px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .btn-submit {
      width: 100%;
      height: 48px;
      font-size: 15px;
      margin-top: 4px;
    }

    @media (max-width: 768px) {
      .login-container {
        flex-direction: column;
        min-height: auto;
      }

      .login-left {
        padding: 32px;
      }

      .login-right {
        padding: 32px;
      }

      .features-list {
        display: none;
      }
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.error.set('Veuillez remplir tous les champs');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate([this.authService.getRedirectUrl()]);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Identifiants incorrects');
      }
    });
  }
}
