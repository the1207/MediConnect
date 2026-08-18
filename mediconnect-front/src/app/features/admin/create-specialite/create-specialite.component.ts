import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpecialiteService } from '../../../services/specialite.service';
import { ActionButtonComponent } from '../../../shared/components/ui/action-button/action-button.component';
import { Specialite } from '../../../models/mediconnect.models';

@Component({
  selector: 'app-create-specialite',
  standalone: true,
  imports: [CommonModule, FormsModule, ActionButtonComponent],
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

      <div class="status-box" *ngIf="message()" [ngClass]="messageType()">
        {{ message() }}
      </div>

      <div class="controls-panel">
        <div class="alpha-filter">
          <label for="initialFilter">Filtrer :</label>
          <select id="initialFilter" (change)="onSelect($event)" [value]="selectedLetter() ?? ''">
            <option value="">Tous</option>
            <option *ngFor="let l of letters" [value]="l">{{ l }}</option>
          </select>
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
            <tr *ngIf="!filteredSpecialites().length">
              <td colspan="3" class="empty-state">Aucune spécialité enregistrée.</td>
            </tr>
            <tr *ngFor="let s of filteredSpecialites(); let i = index">
              <td>{{ i + 1 }}</td>
              <td>{{ s.nom }}</td>
              <td>
                <div class="action-buttons">
                  <app-action-button variant="edit" ariaLabel="Modifier" (action)="edit(s)"></app-action-button>
                  <app-action-button variant="delete" ariaLabel="Supprimer" (action)="supprimer(s.id)"></app-action-button>
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
    .controls-panel { background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; padding:18px; margin-bottom:18px; box-shadow:0 18px 40px rgba(15,23,42,.06); }
    .alpha-filter { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
    .alpha-filter label { font-weight:600; color:#334155; }
    .alpha-filter select { padding:10px 12px; border:1px solid #cbd5e1; border-radius:10px; background:#f8fafc; }
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
    .status-box { margin-bottom: 16px; padding: 12px 14px; border-radius: 12px; font-weight: 600; }
    .status-box.success { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
    .status-box.error { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
    .status-box.info { background: #dbeafe; color: #1d4ed8; border: 1px solid #93c5fd; }
  `]
})
export class CreateSpecialiteComponent {
  private specialiteService = inject(SpecialiteService);

  nom = '';
  editingId: number | null = null;
  loading = signal(false);
  message = signal('');
  messageType = signal<'success' | 'error' | 'info'>('info');
  specialites = signal<Specialite[]>([]);
  letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  selectedLetter = signal<string | null>(null);

  constructor() {
    this.charger();
  }

  charger() {
    this.specialiteService.getAll().subscribe(list => {
      const sorted = [...list].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
      this.specialites.set(sorted);
    });
  }

  setFilter(letter: string | null) {
    this.selectedLetter.set(letter);
  }

  onSelect(event: Event) {
    const v = (event.target as HTMLSelectElement).value;
    this.setFilter(v === '' ? null : v);
  }

  filteredSpecialites() {
    const letter = this.selectedLetter();
    const all = [...this.specialites()].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    if (!letter) return all;
    const lower = letter.toLowerCase();
    return all.filter(s => (s.nom || '').toLowerCase().startsWith(lower));
  }

  edit(specialite: Specialite) {
    this.editingId = specialite.id;
    this.nom = specialite.nom;
  }

  cancelEdit() {
    this.editingId = null;
    this.nom = '';
    this.message.set('');
  }

  creer() {
    if (!this.nom) return;
    this.loading.set(true);
    this.message.set('');

    if (this.editingId !== null) {
      this.specialiteService.update(this.editingId, this.nom).subscribe({
        next: () => {
          this.nom = '';
          this.editingId = null;
          this.loading.set(false);
          this.message.set('Spécialité modifiée avec succès.');
          this.messageType.set('success');
          this.charger();
        },
        error: () => {
          this.loading.set(false);
          this.message.set('Erreur lors de la modification de la spécialité.');
          this.messageType.set('error');
        }
      });
      return;
    }

    this.specialiteService.create(this.nom).subscribe({
      next: () => {
        this.nom = '';
        this.loading.set(false);
        this.message.set('Spécialité créée avec succès.');
        this.messageType.set('success');
        this.charger();
      },
      error: () => {
        this.loading.set(false);
        this.message.set('Erreur lors de la création de la spécialité.');
        this.messageType.set('error');
      }
    });
  }

  supprimer(id: number) {
    if (!confirm('Supprimer cette spécialité ?')) return;
    this.loading.set(true);
    this.message.set('');
    this.specialiteService.delete(id).subscribe({
      next: () => {
        this.loading.set(false);
        this.message.set('Spécialité supprimée avec succès.');
        this.messageType.set('success');
        this.charger();
      },
      error: () => {
        this.loading.set(false);
        this.message.set('Impossible de supprimer cette spécialité.');
        this.messageType.set('error');
      }
    });
  }
}
