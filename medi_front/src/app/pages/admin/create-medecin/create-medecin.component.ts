import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MedecinService } from '../../../core/services/medecin.service';
import { SpecialiteService } from '../../../core/services/specialite.service';
import { Medecin, Specialite } from '../../../core/models';

@Component({
  selector: 'app-create-medecin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-header"><h1>Médecins</h1></div>

    @if (error()) { <div class="alert alert-danger">{{ error() }}</div> }
    @if (success()) { <div class="alert alert-success">Médecin créé avec succès.</div> }

    <div class="card" style="max-width: 520px; margin-bottom: 24px;">
      <div class="form-group">
        <label class="form-label">Nom</label>
        <input class="form-input" [(ngModel)]="form.nom" placeholder="Nom du médecin" />
      </div>
      <div class="form-group">
        <label class="form-label">Prénom</label>
        <input class="form-input" [(ngModel)]="form.prenom" placeholder="Prénom du médecin" />
      </div>
      <div class="form-group">
        <label class="form-label">Spécialité</label>
        @if (specialites().length === 0) {
          <p class="text-secondary" style="margin-bottom: 8px;">
            Aucune spécialité disponible. <a routerLink="/admin/specialites/nouvelle">Créer une spécialité</a> d'abord.
          </p>
        } @else {
          <select class="form-select" [(ngModel)]="form.specialiteId">
            <option [ngValue]="undefined">-- Choisir une spécialité --</option>
            @for (s of specialites(); track s.id) {
              <option [ngValue]="s.id">{{ s.nom }}</option>
            }
          </select>
        }
      </div>
      <div class="form-actions">
        <button class="btn btn-primary btn-md" [disabled]="loading() || !isFormValid()" (click)="onSubmit()">
          @if (loading()) { <span class="spinner spinner-sm"></span> Création... } @else { Créer le médecin }
        </button>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">Médecins existants</span></div>
      @if (medecins().length === 0) {
        <p class="text-secondary">Aucun médecin pour le moment.</p>
      } @else {
        <div class="table-container">
          <table class="table">
            <thead><tr><th>Nom</th><th>Prénom</th><th>Spécialité</th></tr></thead>
            <tbody>
              @for (m of medecins(); track m.id) {
                <tr>
                  <td>{{ m.nom }}</td>
                  <td>{{ m.prenom }}</td>
                  <td>{{ m.specialite?.nom || '-' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 20px; }
    .page-header h1 { font-size: 22px; font-weight: 700; color: var(--text-primary); }
    .form-actions { display: flex; justify-content: flex-end; margin-top: 12px; }
    .card-header { margin-bottom: 12px; }
    .card-title { font-size: 16px; font-weight: 600; color: var(--text-primary); }
  `]
})
export class CreateMedecinComponent implements OnInit {
  private medecinService = inject(MedecinService);
  private specialiteService = inject(SpecialiteService);

  specialites = signal<Specialite[]>([]);
  medecins = signal<Medecin[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  form: { nom: string; prenom: string; specialiteId: number | undefined } = {
    nom: '', prenom: '', specialiteId: undefined
  };

  ngOnInit(): void {
    this.specialiteService.getAll().subscribe({ next: (s) => this.specialites.set(s) });
    this.loadMedecins();
  }

  loadMedecins(): void {
    this.medecinService.getAll().subscribe({ next: (m) => this.medecins.set(m) });
  }

  isFormValid(): boolean {
    return !!(this.form.nom.trim() && this.form.prenom.trim() && this.form.specialiteId);
  }

  onSubmit(): void {
    if (!this.isFormValid()) return;
    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    this.medecinService.create({
      nom: this.form.nom.trim(),
      prenom: this.form.prenom.trim(),
      specialiteId: this.form.specialiteId!
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
        this.form = { nom: '', prenom: '', specialiteId: undefined };
        this.loadMedecins();
        setTimeout(() => this.success.set(false), 3000);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || err.error || 'Erreur lors de la création');
      }
    });
  }
}
