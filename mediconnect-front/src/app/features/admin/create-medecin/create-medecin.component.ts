import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MedecinService } from '../../../services/medecin.service';
import { SpecialiteService } from '../../../services/specialite.service';
import { AdminUserService } from '../../../services/admin-user.service';
import { Specialite } from '../../../models/mediconnect.models';

@Component({
  selector: 'app-create-medecin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="section-card">
      <div class="section-header">
        <div>
          <h2>Créer un médecin</h2>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="form-grid">
        <input formControlName="nom" placeholder="Nom" />
        <input formControlName="prenom" placeholder="Prénom" />
        <select formControlName="specialiteId">
          <option value="">-- spécialité --</option>
          <option *ngFor="let s of specialites()" [value]="s.id">{{ s.nom }}</option>
        </select>
        <input formControlName="username" placeholder="Identifiant" />
        <input formControlName="password" type="password" placeholder="Mot de passe" />
        <button type="submit" [disabled]="form.invalid || loading()">
          {{ editingId !== null ? (loading() ? 'Enregistrement...' : 'Enregistrer les modifications') : (loading() ? 'Création...' : 'Créer le médecin') }}
        </button>
        <button *ngIf="editingId !== null" type="button" class="secondary" (click)="cancelEdit()">Annuler</button>
      </form>

      <div class="table-card">
        <div class="table-header">
          <h3>Médecins existants</h3>
          <span class="table-count">{{ medecins().length }} médecin(s)</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nom complet</th>
              <th>Spécialité</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="!medecins().length">
              <td colspan="4" class="empty-state">Aucun médecin enregistré.</td>
            </tr>
            <tr *ngFor="let m of medecins(); let i = index">
              <td>{{ i + 1 }}</td>
              <td>Dr. {{ m.nom }} {{ m.prenom }}</td>
              <td>{{ m.specialite?.nom || 'N/A' }}</td>
              <td>
                <div class="action-buttons">
                  <button class="secondary" type="button" (click)="edit(m)">Modifier</button>
                  <button class="danger" type="button" (click)="supprimer(m.id)">Supprimer</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="erreur" *ngIf="erreur()">{{ erreur() }}</p>
    </section>
  `,
  styles: [`
    .section-card { padding: 24px; background: #fff; border-radius: 16px; box-shadow: 0 16px 44px rgba(15, 23, 42, 0.08); }
    .section-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 24px; }
    .section-header h2 { margin: 0; font-size: 1.4rem; font-weight: 700; }
    .subtitle { margin: 8px 0 0; color: #64748b; }
    .form-grid { display: grid; gap: 16px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .form-grid input,
    .form-grid select { width: 100%; padding: 12px 14px; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 1rem; }
    .form-grid button { grid-column: span 2; padding: 14px 18px; border: none; border-radius: 12px; background: #2563eb; color: white; font-weight: 600; cursor: pointer; }
    .form-grid button:disabled { opacity: 0.6; cursor: not-allowed; }
    .table-card { margin-top: 32px; overflow-x: auto; }
    .table-header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 16px; }
    .table-header h3 { margin: 0; font-size: 1.1rem; font-weight: 600; }
    .table-count { color: #64748b; font-size: 0.95rem; }
    .table-topbar { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 12px; }
    .table-note { color: #475569; font-size: 0.95rem; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 16px; overflow: hidden; }
    thead { background: #f8fafc; }
    th, td { padding: 14px 16px; text-align: left; border-bottom: 1px solid #e2e8eb; }
    th { color: #475569; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.02em; }
    tbody tr:hover { background: #f8fafc; }
    .action-buttons { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .action-buttons button { min-width: auto; padding: 8px 12px; font-size: 0.9rem; }
    .secondary { background: #64748b; color: white; border: none; border-radius: 10px; }
    .danger { background: #dc2626; color: white; border: none; border-radius: 10px; }
    thead th { color: #374151; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.02em; }
    tbody tr { border-top: 1px solid #e5e7eb; }
    tbody tr:first-child { border-top: none; }
    td { color: #334155; }
    .empty-state { text-align: center; color: #64748b; padding: 24px 0; }
    .hint { margin-top: 24px; color: #475569; }
    .erreur { margin-top: 16px; color: #b91c1c; }
  `]
})
export class CreateMedecinComponent {
  private fb = inject(FormBuilder);
  private medecinService = inject(MedecinService);
  private specialiteService = inject(SpecialiteService);
  private adminUserService = inject(AdminUserService);

  loading = signal(false);
  erreur = signal('');
  specialites = signal<Specialite[]>([]);
  medecins = signal<any[]>([]);

  form = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    specialiteId: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  editingId: number | null = null;

  constructor() {
    this.specialiteService.getAll().subscribe(list => this.specialites.set(list));
    this.enableCreateValidators();
    this.charger();
  }

  private enableCreateValidators() {
    this.form.get('username')?.setValidators([Validators.required]);
    this.form.get('password')?.setValidators([Validators.required]);
    this.form.get('username')?.updateValueAndValidity({ onlySelf: true });
    this.form.get('password')?.updateValueAndValidity({ onlySelf: true });
  }

  private enableEditValidators() {
    this.form.get('username')?.clearValidators();
    this.form.get('password')?.clearValidators();
    this.form.get('username')?.updateValueAndValidity({ onlySelf: true });
    this.form.get('password')?.updateValueAndValidity({ onlySelf: true });
  }

  edit(medecin: any) {
    this.editingId = medecin.id;
    this.form.patchValue({
      nom: medecin.nom,
      prenom: medecin.prenom,
      specialiteId: medecin.specialite?.id ?? '',
      username: '',
      password: ''
    });
    this.enableEditValidators();
  }

  cancelEdit() {
    this.editingId = null;
    this.form.reset();
    this.enableCreateValidators();
  }

  charger() {
    this.medecinService.getAll().subscribe(list => this.medecins.set(list));
  }

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.erreur.set('');

    const nom = this.form.value.nom!;
    const prenom = this.form.value.prenom!;
    const specialiteId = Number(this.form.value.specialiteId);
    const username = this.form.value.username!;
    const password = this.form.value.password!;

    if (this.editingId !== null) {
      this.medecinService.update(this.editingId, { nom, prenom, specialiteId }).subscribe({
        next: () => {
          this.loading.set(false);
          this.editingId = null;
          this.form.reset();
          this.enableCreateValidators();
        }
      });
      return;
    }

    this.medecinService.create({ nom, prenom, specialiteId }).subscribe({
      next: (medecin) => {
        if (!medecin || medecin.id == null) {
          this.loading.set(false);
          this.erreur.set('Impossible de créer le médecin.');
          return;
        }

        this.adminUserService.createUser({
          fullName: `${nom} ${prenom}`,
          username,
          password,
          roles: 'MEDECIN',
          enable: true,
          medecinId: medecin.id
        }).subscribe({
          next: () => {
            this.loading.set(false);
            this.form.reset();
            this.charger();
          },
          error: () => {
            this.medecinService.delete(medecin.id).subscribe({
              next: () => {
                this.loading.set(false);
                this.erreur.set('Le compte utilisateur n\'a pas pu être créé. Le médecin a été supprimé.');
              },
              error: () => {
                this.loading.set(false);
                this.erreur.set('Erreur critique lors de la création. Contactez l\'administrateur.');
              }
            });
          }
        });
      },
      error: () => {
        this.loading.set(false);
        this.erreur.set('Erreur lors de la création du médecin.');
      }
    });
  }

  supprimer(id: number) {
    if (!confirm('Supprimer ce médecin ?')) return;
    this.loading.set(true);
    this.medecinService.delete(id).subscribe({
      next: () => {
        this.loading.set(false);
        this.charger();
      },
      error: () => {
        this.loading.set(false);
        this.erreur.set('Impossible de supprimer le médecin.');
      }
    });
  }
}
