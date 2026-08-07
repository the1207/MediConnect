import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RendezVousService } from '../../../core/services/rendezvous.service';
import { PatientService } from '../../../core/services/patient.service';
import { AuthService } from '../../../core/services/auth.service';
import { RendezVous } from '../../../core/models';

interface RdvAffiche extends RendezVous {
  patientNom?: string;
  patientPrenom?: string;
}

@Component({
  selector: 'app-patients-jour',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Mes rendez-vous</h1>
          <p>Patients confirmés, triés par date et heure</p>
        </div>
        <button class="btn btn-secondary btn-md" (click)="refresh()">Actualiser</button>
      </div>

      @if (loading()) {
        <div class="card"><p>Chargement...</p></div>
      } @else if (rdvs().length === 0) {
        <div class="card">
          <div class="empty-state">
            <h3>Aucun rendez-vous confirmé</h3>
            <p>Les rendez-vous confirmés apparaîtront ici</p>
          </div>
        </div>
      } @else {
        <div class="queue-cards">
          @for (r of rdvs(); track r.id) {
            <div class="queue-card" (click)="consulter(r)">
              <div class="queue-card-top">
                <div>
                  <h3>{{ r.patientPrenom }} {{ r.patientNom }}</h3>
                  <p>{{ r.motif }}</p>
                </div>
                <div class="queue-card-meta">
                  <span class="badge badge-primary">{{ r.date | date:'dd/MM/yyyy' }}</span>
                  <span class="badge badge-info">{{ r.heure }}</span>
                </div>
              </div>
              <div class="queue-card-actions">
                <button class="btn btn-primary btn-sm" type="button">Consulter</button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 900px; }
    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
    .page-header h1 { font-size: 24px; font-weight: 700; color: var(--text-primary); }
    .page-header p { font-size: 14px; color: var(--text-secondary); margin-top: 4px; }
    .queue-cards { display: flex; flex-direction: column; gap: 12px; }
    .queue-card { background: var(--bg-card); border: 1px solid var(--border-default); border-radius: var(--radius-lg); padding: 20px 24px; box-shadow: var(--shadow-card); cursor: pointer; }
    .queue-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; }
    .queue-card-top h3 { font-size: 15px; font-weight: 600; color: var(--text-primary); }
    .queue-card-top p { font-size: 13px; color: var(--text-secondary); margin-top: 2px; }
    .queue-card-meta { display: flex; gap: 8px; }
    .queue-card-actions { display: flex; justify-content: flex-end; }
    .empty-state { padding: 32px; text-align: center; color: var(--text-secondary); }
  `]
})
export class PatientsJourComponent implements OnInit {
  private rendezVousService = inject(RendezVousService);
  private patientService = inject(PatientService);
  private authService = inject(AuthService);
  private router = inject(Router);

  rdvs = signal<RdvAffiche[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const medecinId = Number(this.authService.currentMedecinId());
    if (!medecinId) { this.loading.set(false); return; }

    this.loading.set(true);
    this.rendezVousService.getConfirmesByMedecin(medecinId).subscribe({
      next: (rdvs) => {
        const enriched: RdvAffiche[] = [...rdvs];
        let pending = enriched.length;
        if (pending === 0) { this.rdvs.set([]); this.loading.set(false); return; }

        enriched.forEach((r, i) => {
          this.patientService.getById(r.patientId).subscribe({
            next: (p) => {
              enriched[i].patientNom = p.nom;
              enriched[i].patientPrenom = p.prenom;
              pending -= 1;
              if (pending === 0) {
                this.rdvs.set(enriched);
                this.loading.set(false);
              }
            },
            error: () => {
              pending -= 1;
              if (pending === 0) {
                this.rdvs.set(enriched);
                this.loading.set(false);
              }
            }
          });
        });
      },
      error: () => {
        this.rdvs.set([]);
        this.loading.set(false);
      }
    });
  }

  refresh(): void {
    this.load();
  }

  consulter(r: RdvAffiche): void {
    this.router.navigate(['/medecin/consultation', r.patientId]);
  }
}
