import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpecialiteService } from '../../../services/specialite.service';
import { Specialite } from '../../../models/mediconnect.models';

@Component({
  selector: 'app-create-specialite',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="section-card">
      <div class="section-header">
        <h2>Spécialités</h2>
        <div class="form-row">
          <input [(ngModel)]="nom" placeholder="Nom de la spécialité" />
          <button (click)="creer()" [disabled]="!nom || loading()">
            {{ loading() ? (editingId !== null ? 'Enregistrement...' : 'Création...') : (editingId !== null ? 'Enregistrer' : 'Créer') }}
          </button>
          <button *ngIf="editingId !== null" class="secondary" type="button" (click)="cancelEdit()">Annuler</button>
        </div>
      </div>

      <div class="table-card">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Spécialité</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="!specialites().length">
              <td colspan="3" class="empty-state">Aucune spécialité enregistrée.</td>
            </tr>
            <tr *ngFor="let s of specialites(); let i = index">
              <td>{{ i + 1 }}</td>
              <td>{{ s.nom }}</td>
              <td>
                <div class="action-buttons">
                  <button class="secondary" type="button" (click)="edit(s)">Modifier</button>
                  <button class="danger" type="button" (click)="supprimer(s.id)">Supprimer</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [`
    .section-card { padding: 24px; background: #fff; border-radius: 16px; box-shadow: 0 16px 44px rgba(15, 23, 42, 0.08); }
    .section-header { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
    .section-header h2 { margin: 0; font-size: 1.3rem; font-weight: 700; }
    .form-row { display: grid; gap: 12px; grid-template-columns: 1fr auto; }
    input { width: 100%; padding: 12px 14px; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 1rem; }
    button { min-width: 140px; padding: 12px 16px; border: none; border-radius: 12px; background: #2563eb; color: white; font-weight: 600; cursor: pointer; }
    button:disabled { opacity: 0.6; cursor: not-allowed; }
    .table-card { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 14px 16px; text-align: left; }
    .action-buttons { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .action-buttons button { min-width: auto; padding: 8px 12px; font-size: 0.9rem; }
    .secondary { background: #64748b; color: white; border: none; border-radius: 10px; }
    .danger { background: #dc2626; color: white; border: none; border-radius: 10px; }
    thead th { color: #374151; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.02em; }
    tbody tr { border-top: 1px solid #e5e7eb; }
    tbody tr:first-child { border-top: none; }
    td { color: #334155; }
    .empty-state { text-align: center; color: #64748b; padding: 24px 0; }
  `]
})
export class CreateSpecialiteComponent {
  private specialiteService = inject(SpecialiteService);

  nom = '';
  editingId: number | null = null;
  loading = signal(false);
  specialites = signal<Specialite[]>([]);

  constructor() {
    this.charger();
  }

  charger() {
    this.specialiteService.getAll().subscribe(list => this.specialites.set(list));
  }

  edit(specialite: Specialite) {
    this.editingId = specialite.id;
    this.nom = specialite.nom;
  }

  cancelEdit() {
    this.editingId = null;
    this.nom = '';
  }

  creer() {
    if (!this.nom) return;
    this.loading.set(true);

    if (this.editingId !== null) {
      this.specialiteService.update(this.editingId, this.nom).subscribe({
        next: () => {
          this.nom = '';
          this.editingId = null;
          this.loading.set(false);
          this.charger();
        },
        error: () => this.loading.set(false)
      });
      return;
    }

    this.specialiteService.create(this.nom).subscribe({
      next: () => { this.nom = ''; this.loading.set(false); this.charger(); },
      error: () => this.loading.set(false)
    });
  }

  supprimer(id: number) {
    if (!confirm('Supprimer cette spécialité ?')) return;
    this.loading.set(true);
    this.specialiteService.delete(id).subscribe({
      next: () => { this.loading.set(false); this.charger(); },
      error: () => this.loading.set(false)
    });
  }
}
