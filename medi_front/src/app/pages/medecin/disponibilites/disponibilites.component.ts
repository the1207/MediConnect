import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DisponibiliteService } from '../../../core/services/disponibilite.service';
import { AuthService } from '../../../core/services/auth.service';
import { Disponibilite, DisponibiliteRequest } from '../../../core/models';

@Component({
  selector: 'app-disponibilites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Mes disponibilités</h1>
          <p>Ajoutez vos créneaux pour que les infirmières puissent y prendre rendez-vous</p>
        </div>
      </div>

      @if (error()) {
        <div class="alert alert-danger mb-6">{{ error() }}</div>
      }
      @if (success()) {
        <div class="alert alert-success mb-6">Créneau ajouté avec succès</div>
      }

      <div class="card" style="max-width: 560px; margin-bottom: 24px;">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" class="form-input" [(ngModel)]="form.dateCreneau" />
          </div>
          <div class="form-group">
            <label class="form-label">Heure début</label>
            <input type="time" class="form-input" [(ngModel)]="form.heureDebut" />
          </div>
          <div class="form-group">
            <label class="form-label">Heure fin</label>
            <input type="time" class="form-input" [(ngModel)]="form.heureFin" />
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-primary btn-md" [disabled]="loading() || !isFormValid()" (click)="onSubmit()">
            @if (loading()) { <span class="spinner spinner-sm"></span> Ajout... } @else { Ajouter le créneau }
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">Mes créneaux</span></div>
        @if (disponibilites().length === 0) {
          <p class="text-secondary">Aucun créneau enregistré.</p>
        } @else {
          <div class="table-container">
            <table class="table">
              <thead>
                <tr><th>Date</th><th>Début</th><th>Fin</th><th>Statut</th></tr>
              </thead>
              <tbody>
                @for (d of disponibilites(); track d.id) {
                  <tr>
                    <td>{{ d.dateCreneau | date:'dd/MM/yyyy' }}</td>
                    <td>{{ d.heureDebut }}</td>
                    <td>{{ d.heureFin }}</td>
                    <td>
                      @if (d.reservation) {
                        <span class="badge badge-danger">Réservé</span>
                      } @else {
                        <span class="badge badge-success">Libre</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 900px; }
    .page-header { margin-bottom: 20px; }
    .page-header h1 { font-size: 22px; font-weight: 700; color: var(--text-primary); }
    .page-header p { font-size: 14px; color: var(--text-secondary); margin-top: 4px; }
    .form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .form-actions { display: flex; justify-content: flex-end; margin-top: 16px; }
    .card-header { margin-bottom: 12px; }
    .card-title { font-size: 16px; font-weight: 600; color: var(--text-primary); }
    .mb-6 { margin-bottom: 24px; }
    @media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }
  `]
})
export class DisponibilitesComponent implements OnInit {
  private disponibiliteService = inject(DisponibiliteService);
  private authService = inject(AuthService);

  disponibilites = signal<Disponibilite[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  form = {
    dateCreneau: '',
    heureDebut: '',
    heureFin: ''
  };

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const medecinId = Number(this.authService.currentMedecinId());
    if (!medecinId) return;
    this.disponibiliteService.getByMedecin(medecinId).subscribe({
      next: (list) => this.disponibilites.set(list)
    });
  }

  isFormValid(): boolean {
    return !!(this.form.dateCreneau && this.form.heureDebut && this.form.heureFin);
  }

  onSubmit(): void {
    const medecinId = Number(this.authService.currentMedecinId());
    if (!medecinId || !this.isFormValid()) return;

    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    const request: DisponibiliteRequest = {
      dateCreneau: this.form.dateCreneau,
      heureDebut: this.form.heureDebut,
      heureFin: this.form.heureFin,
      medecinId
    };

    this.disponibiliteService.create(request).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
        this.form = { dateCreneau: '', heureDebut: '', heureFin: '' };
        this.load();
        setTimeout(() => this.success.set(false), 3000);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Erreur lors de l\'ajout du créneau');
      }
    });
  }
}
