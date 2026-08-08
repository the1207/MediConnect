import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="screen">
      <section class="hero">
        <span class="eyebrow eyebrow--light">MediConnect</span>
        <h1>Le dossier<br>patient, sans<br>friction.</h1>
        <svg class="ecg-line ecg-line--hero" viewBox="0 0 400 40" preserveAspectRatio="none">
          <path d="M0,20 L50,20 L64,4 L78,36 L92,20 L120,20 L134,8 L146,20 L400,20" />
        </svg>
        <p class="hero__caption">Constantes, rendez-vous, ordonnances — un seul flux, du triage à la prescription.</p>
      </section>

      <section class="panel">
        <div class="login-card">
          <span class="eyebrow">Connexion</span>
          <h2>Accéder à mon espace</h2>

          <form [formGroup]="form" (ngSubmit)="submit()">
            <label class="field-label">Identifiant</label>
            <input formControlName="username" placeholder="ex. j.dupont" />

            <label class="field-label">Mot de passe</label>
            <input formControlName="password" type="password" placeholder="••••••••" />

            <p class="erreur" *ngIf="erreur()">{{ erreur() }}</p>

            <button class="btn btn-primary btn-submit" type="submit" [disabled]="form.invalid || loading()">
              {{ loading() ? 'Connexion...' : 'Se connecter' }}
            </button>
          </form>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .screen { display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh; }

    .hero {
      background: var(--ink);
      color: #fff;
      padding: 64px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 24px;
    }
    .eyebrow--light { color: rgba(255,255,255,.55); }
    .hero h1 {
      color: #fff;
      font-size: 40px;
      line-height: 1.15;
      margin: 0;
    }
    .ecg-line--hero { height: 40px; }
    .ecg-line--hero path { stroke: var(--mint); }
    .hero__caption { color: rgba(255,255,255,.62); max-width: 380px; margin: 0; }

    .panel {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }
    .login-card { width: 100%; max-width: 360px; }
    .login-card h2 { margin-top: 6px; margin-bottom: 28px; }

    .field-label {
      display: block;
      font-size: 12px;
      color: var(--ink-soft);
      margin-bottom: 6px;
      margin-top: 14px;
    }
    .field-label:first-of-type { margin-top: 0; }

    .erreur { color: var(--pulse); font-size: 13px; margin: 12px 0 0; }
    .btn-submit { width: 100%; margin-top: 22px; }

    @media (max-width: 860px) {
      .screen { grid-template-columns: 1fr; }
      .hero { padding: 40px 28px; min-height: 260px; }
      .hero h1 { font-size: 30px; }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  erreur = signal('');

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.erreur.set('');

    this.auth.login(this.form.value as any).subscribe({
      next: () => {
        this.loading.set(false);
        const role = this.auth.role();
        if (role === 'ADMIN') this.router.navigate(['/admin']);
        else if (role === 'MEDECIN') this.router.navigate(['/medecin']);
        else if (role === 'INFIRMIER') this.router.navigate(['/infirmier']);
        else this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 403) this.erreur.set('Compte désactivé. Contactez l\'administrateur.');
        else if (err.status === 401) this.erreur.set('Identifiant ou mot de passe incorrect.');
        else this.erreur.set('Erreur de connexion au serveur.');
      }
    });
  }
}
