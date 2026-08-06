import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { MedecinService } from '../../../core/services/medecin.service';
import { UserCreateRequest, Medecin } from '../../../core/models';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header"><h1>Nouvel utilisateur</h1></div>
    @if (error()) { <div class="alert alert-danger">{{ error() }}</div> }
    <div class="card">
      <div class="form-group">
        <label class="form-label">Nom complet</label>
        <input class="form-input" [(ngModel)]="form.fullName" />
      </div>
      <div class="form-group">
        <label class="form-label">Identifiant (email)</label>
        <input class="form-input" [(ngModel)]="form.username" />
      </div>
      <div class="form-group">
        <label class="form-label">Mot de passe</label>
        <input type="password" class="form-input" [(ngModel)]="form.password" />
      </div>
      <div class="form-group">
        <label class="form-label">Rôle</label>
        <select class="form-select" [(ngModel)]="form.roles" (ngModelChange)="onRoleChange()">
          <option value="ADMIN">ADMIN</option>
          <option value="MEDECIN">MEDECIN</option>
          <option value="INFIRMIER">INFIRMIER</option>
        </select>
      </div>
      @if (form.roles === 'MEDECIN') {
        <div class="form-group">
          <label class="form-label">Lier à un médecin existant (optionnel)</label>
          <select class="form-select" [(ngModel)]="form.medecinId">
            <option [ngValue]="undefined">-- Aucun --</option>
            @for (m of medecins(); track m.id) {
              <option [ngValue]="m.id">Dr. {{ m.prenom }} {{ m.nom }}</option>
            }
          </select>
        </div>
      }
      <div class="form-actions">
        <button class="btn btn-secondary btn-md" (click)="goBack()">Annuler</button>
        <button class="btn btn-primary btn-md" [disabled]="loading()" (click)="onSubmit()">
          @if (loading()) { <span class="spinner spinner-sm"></span> Création... } @else { Créer }
        </button>
      </div>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 20px; }
    .page-header h1 { font-size: 22px; font-weight: 700; color: var(--text-primary); }
    .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; }
  `]
})
export class CreateUserComponent {
  private adminService = inject(AdminService);
  private medecinService = inject(MedecinService);
  private router = inject(Router);

  medecins = signal<(Medecin & { id: number })[]>([]);

  form: UserCreateRequest = { fullName: '', username: '', password: '', roles: 'INFIRMIER', enable: true };
  loading = signal(false);
  error = signal<string | null>(null);

  onRoleChange(): void {
    if (this.form.roles === 'MEDECIN' && this.medecins().length === 0) {
      this.medecinService.getAll().subscribe({ next: (m) => this.medecins.set(m as (Medecin & { id: number })[]) });
    }
  }

  onSubmit(): void {
    if (!this.form.fullName || !this.form.username || !this.form.password) {
      this.error.set('Veuillez remplir tous les champs obligatoires');
      return;
    }
    this.loading.set(true);
    this.error.set(null);

    this.adminService.createUser(this.form).subscribe({
      next: () => { this.loading.set(false); this.router.navigate(['/admin/utilisateurs']); },
      error: (err) => { this.loading.set(false); this.error.set(err.error?.message || err.error || 'Erreur lors de la création'); }
    });
  }

  goBack(): void { this.router.navigate(['/admin/utilisateurs']); }
}
