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
    <div class="login-container">
      <h1>MediConnect</h1>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <input formControlName="username" placeholder="Identifiant" />
        <input formControlName="password" type="password" placeholder="Mot de passe" />

        <p class="erreur" *ngIf="erreur()">{{ erreur() }}</p>

        <button type="submit" [disabled]="form.invalid || loading()">
          {{ loading() ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>
    </div>
  `,
  styles: [
    `.login-container { max-width: 360px; margin: 80px auto; display: flex; flex-direction: column; gap: 12px; padding: 24px; background: #fff; border-radius: 12px; box-shadow: 0 12px 32px rgba(0,0,0,.08); }
      input { width: 100%; padding: 12px; font-size: 1rem; border: 1px solid #cbd5e1; border-radius: 8px; }
      button { width: 100%; padding: 12px; border: none; border-radius: 8px; background: #2563eb; color: white; font-weight: 600; cursor: pointer; }
      .erreur { color: #b91c1c; margin: 0; }
    `
  ]
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
