import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminUserService } from '../../../services/admin-user.service';
import { MedecinService } from '../../../services/medecin.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Nouvel utilisateur</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="fullName" placeholder="Nom complet" />
      <input formControlName="username" placeholder="Identifiant (email)" />
      <input formControlName="password" type="password" placeholder="Mot de passe" />

      <select formControlName="roles">
        <option value="">-- rôle --</option>
        <option value="ADMIN">Admin</option>
        <option value="MEDECIN">Médecin</option>
        <option value="INFIRMIER">Infirmier(e)</option>
      </select>

      <div *ngIf="isMedecin()">
        <select formControlName="medecinId">
          <option value="">-- sélectionner un médecin existant --</option>
          <option *ngFor="let m of medecins()" [value]="m.id">Dr. {{ m.nom }} {{ m.prenom }}</option>
        </select>
        <p *ngIf="!medecins().length" class="hint">Aucun médecin disponible — créez-en un d'abord dans "Médecins".</p>
        <p *ngIf="medecins().length" class="hint">Le compte médecin doit être associé à un médecin existant créé via "Médecins". Ne créez pas un autre médecin ici juste pour le rôle.</p>
      </div>

      <p class="erreur" *ngIf="erreur()">{{ erreur() }}</p>

      <button type="submit" [disabled]="form.invalid || loading()">
        {{ loading() ? 'Création...' : 'Créer l'utilisateur' }}
      </button>
    </form>
  `,
  styles: [`.erreur { color: red; } .hint { color: #475569; } input, select { display: block; width: 100%; margin-bottom: 12px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; } button { padding: 12px 18px; border: none; border-radius: 8px; background: #2563eb; color: white; cursor: pointer; }`]
})
export class CreateUserComponent {
  private fb = inject(FormBuilder);
  private adminUserService = inject(AdminUserService);
  private medecinService = inject(MedecinService);
  private router = inject(Router);

  loading = signal(false);
  erreur = signal('');
  medecins = signal<any[]>([]);

  form = this.fb.group({
    fullName: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
    roles: ['', Validators.required],
    medecinId: ['']
  });

  isMedecin = computed(() => this.form.get('roles')?.value === 'MEDECIN');

  constructor() {
    this.medecinService.getAll().subscribe(list => this.medecins.set(list));
  }

  submit() {
    if (this.form.invalid) return;
    const raw = this.form.value;

    if (this.isMedecin() && !raw.medecinId) {
      this.erreur.set('Veuillez sélectionner un médecin existant pour un compte médecin.');
      return;
    }

    this.loading.set(true);
    this.erreur.set('');

    this.adminUserService.createUser({
      fullName: raw.fullName!,
      username: raw.username!,
      password: raw.password!,
      roles: raw.roles!,
      enable: true,
      medecinId: this.isMedecin() ? Number(raw.medecinId) : null
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/admin/utilisateurs']);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 409) this.erreur.set('Ce nom d\'utilisateur existe déjà.');
        else this.erreur.set('Erreur lors de la création.');
      }
    });
  }
}
