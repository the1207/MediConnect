import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RendezVousService } from '../../../core/services/rendezvous.service';
import { PatientService } from '../../../core/services/patient.service';
import { AuthService } from '../../../core/services/auth.service';
import { RendezVous } from '../../../core/models';

interface RdvAffiche extends RendezVous {
  patientNom?: string;
  patientPrenom?: string;
}

@Component({
  selector: 'app-demandes-rendezvous',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header"><h1>Demandes de rendez-vous</h1></div>
    <div class="card">
      @if (loading()) {
        <p>Chargement...</p>
      } @else if (rdvs().length === 0) {
        <p>Aucune demande en attente.</p>
      } @else {
        <div class="table-container">
          <table class="table">
            <thead>
              <tr><th>Patient</th><th>Date</th><th>Heure</th><th>Motif</th><th>Statut</th><th>Actions</th></tr>
            </thead>
            <tbody>
              @for (r of rdvs(); track r.id) {
                <tr>
                  <td>{{ r.patientPrenom }} {{ r.patientNom }}</td>
                  <td>{{ r.date | date:'dd/MM/yyyy' }}</td>
                  <td>{{ r.heure }}</td>
                  <td>{{ r.motif }}</td>
                  <td><span class="badge badge-warning">{{ r.statut }}</span></td>
                  <td>
                    @if (r.statut === 'En_ATTENTE') {
                      <div class="flex gap-2">
                        <button class="btn btn-success btn-sm" (click)="confirmer(r)">Confirmer</button>
                        <button class="btn btn-danger btn-sm" (click)="refuser(r)">Refuser</button>
                      </div>
                    }
                  </td>
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
  `]
})
export class DemandesRendezvousComponent implements OnInit {
  private rendezVousService = inject(RendezVousService);
  private patientService = inject(PatientService);
  private authService = inject(AuthService);

  rdvs = signal<RdvAffiche[]>([]);
  loading = signal(true);

  ngOnInit(): void { this.load(); }

  load(): void {
    const medecinId = Number(this.authService.currentMedecinId());
    if (!medecinId) { this.loading.set(false); return; }

    this.loading.set(true);
    this.rendezVousService.getByMedecin(medecinId).subscribe({
      next: (rdvs) => {
        const enriched: RdvAffiche[] = [...rdvs];
        let pending = enriched.length;
        if (pending === 0) { this.rdvs.set([]); this.loading.set(false); return; }

        enriched.forEach((r, i) => {
          this.patientService.getById(r.patientId).subscribe({
            next: (p) => {
              enriched[i].patientNom = p.nom;
              enriched[i].patientPrenom = p.prenom;
              pending--;
              if (pending === 0) { this.rdvs.set(enriched); this.loading.set(false); }
            },
            error: () => { pending--; if (pending === 0) { this.rdvs.set(enriched); this.loading.set(false); } }
          });
        });
      },
      error: () => this.loading.set(false)
    });
  }

  confirmer(r: RendezVous): void {
    this.rendezVousService.confirmer(r.id).subscribe({ next: () => this.load() });
  }

  refuser(r: RendezVous): void {
    this.rendezVousService.refuser(r.id).subscribe({ next: () => this.load() });
  }
}
