import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpecialiteService } from '../../../core/services/specialite.service';
import { Specialite } from '../../../core/models';

@Component({
  selector: 'app-create-specialite',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header"><h1>Spécialités</h1></div>

    @if (error()) { <div class="alert alert-danger">{{ error() }}</div> }
    @if (success()) { <div class="alert alert-success">Spécialité créée avec succès.</div> }

    <div class="card" style="max-width: 480px; margin-bottom: 24px;">
      <div class="form-group">
        <label class="form-label">Nom de la spécialité</label>
        <input class="form-input" [(ngModel)]="nom" placeholder="Ex: Cardiologie" (keyup.enter)="onSubmit()" />
      </div>
      <div class="form-actions">
        <button class="btn btn-primary btn-md" [disabled]="loading() || !nom.trim()" (click)="onSubmit()">
          @if (loading()) { <span class="spinner spinner-sm"></span> Création... } @else { Créer la spécialité }
        </button>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">Spécialités existantes</span></div>
      @if (specialites().length === 0) {
        <p class="text-secondary">Aucune spécialité pour le moment.</p>
      } @else {
        <div class="table-container">
          <table class="table">
            <thead><tr><th>ID</th><th>Nom</th></tr></thead>
            <tbody>
              @for (s of specialites(); track s.id) {
                <tr><td>{{ s.id }}</td><td>{{ s.nom }}</td></tr>
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
export class CreateSpecialiteComponent implements OnInit {
  private specialiteService = inject(SpecialiteService);

  nom = '';
  specialites = signal<Specialite[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.specialiteService.getAll().subscribe({
      next: (list) => this.specialites.set(list)
    });
  }

  onSubmit(): void {
    if (!this.nom.trim()) return;
    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    this.specialiteService.create({ nom: this.nom.trim() }).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
        this.nom = '';
        this.load();
        setTimeout(() => this.success.set(false), 3000);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || err.error || 'Erreur lors de la création');
      }
    });
  }
}
