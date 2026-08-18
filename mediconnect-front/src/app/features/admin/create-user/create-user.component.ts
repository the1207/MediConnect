import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminUserService } from '../../../services/admin-user.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Nouvel utilisateur</h2>

    <div class="status-box" *ngIf="message()" [ngClass]="messageType()">
      {{ message() }}
    </div>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="fullName" placeholder="Nom complet" />
      <input formControlName="username" placeholder="Identifiant (email)" />
      <input formControlName="password" type="password" placeholder="Mot de passe" />

      <select formControlName="roles">
        <option value="">-- rôle --</option>
        <option value="ADMIN">Admin</option>
        <option value="INFIRMIER">Infirmier(e)</option>
      </select>

      <p class="erreur" *ngIf="erreur()">{{ erreur() }}</p>

      <button type="submit" [disabled]="form.invalid || loading()">
        {{ submitButtonLabel() }}
      </button>
    </form>
  `,
  styles: [`.status-box { margin-bottom: 12px; padding: 12px 14px; border-radius: 10px; font-weight: 600; } .status-box.success { background:#dcfce7; color:#166534; border:1px solid #86efac; } .status-box.error { background:#fee2e2; color:#991b1b; border:1px solid #fca5a5; } .status-box.info { background:#dbeafe; color:#1d4ed8; border:1px solid #93c5fd; } .erreur { color: red; } .hint { color: #475569; } input, select { display: block; width: 100%; margin-bottom: 12px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; } button { padding: 12px 18px; border: none; border-radius: 8px; background: #2563eb; color: white; cursor: pointer; }`]
})
export class CreateUserComponent {
  private fb = inject(FormBuilder);
  private adminUserService = inject(AdminUserService);
  private router = inject(Router);

  loading = signal(false);
  erreur = signal('');
  message = signal('');
  messageType = signal<'success' | 'error' | 'info'>('info');

  submitButtonLabel = computed(() => this.loading() ? 'Enregistrement...' : 'Créer l’utilisateur');

  form = this.fb.group({
    fullName: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
    roles: ['', Validators.required],
    medecinId: ['']
  });

  submit() {
    if (this.form.invalid) return;
    const raw = this.form.value;

    this.loading.set(true);
    this.erreur.set('');
    this.message.set('');

    this.adminUserService.createUser({
      fullName: raw.fullName!,
      username: raw.username!,
      password: raw.password!,
      roles: raw.roles!,
      enable: true,
      medecinId: null
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.message.set('Utilisateur créé avec succès.');
        this.messageType.set('success');
        this.router.navigate(['/admin/utilisateurs']);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 409) {
          this.erreur.set('Ce nom d\'utilisateur existe déjà.');
          this.message.set('Ce nom d\'utilisateur existe déjà.');
        } else {
          this.erreur.set('Erreur lors de la création.');
          this.message.set('Erreur lors de la création.');
        }
        this.messageType.set('error');
      }
    });
  }
}
