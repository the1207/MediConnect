import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RendezVousService } from '../../../services/rendez-vous.service';
import { RendezVous } from '../../../models/mediconnect.models';

@Component({
  selector: 'app-mes-patients',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-header">
      <div>
        <h2>Mes patients</h2>
        <p>Gérez les rendez-vous confirmés et les demandes en attente.</p>
      </div>
      <button class="refresh" type="button" (click)="charger()">Rafraîchir</button>
    </section>

    <section class="section-card">
      <h3>Patients confirmés</h3>
      <p class="section-subtitle">Rendez-vous déjà validés et à suivre.</p>
      <div *ngIf="!rendezVousList().length" class="empty-state">Aucun patient confirmé pour le moment.</div>
      <div class="card-list">
        <article *ngFor="let rdv of rendezVousList()" class="item-card">
          <div>
            <strong>{{ rdv.date | date:'dd/MM/yyyy' }} · {{ rdv.heure }}</strong>
            <p>Patient #{{ rdv.patientId }}</p>
          </div>
          <button class="primary" type="button" (click)="voirPatient(rdv)">Ouvrir le dossier</button>
        </article>
      </div>
    </section>

    <section class="section-card">
      <h3>Demandes en attente</h3>
      <p class="section-subtitle">Répondez rapidement aux demandes de rendez-vous.</p>
      <div *ngIf="!enAttente().length" class="empty-state">Aucune demande en attente.</div>
      <div class="card-list">
        <article *ngFor="let rdv of enAttente()" class="item-card pending">
          <div>
            <strong>{{ rdv.date | date:'dd/MM/yyyy' }} · {{ rdv.heure }}</strong>
            <p>Patient #{{ rdv.patientId }}</p>
          </div>
          <div class="button-group">
            <button class="confirm" type="button" (click)="confirmer(rdv)">Confirmer</button>
            <button class="decline" type="button" (click)="refuser(rdv)">Refuser</button>
          </div>
        </article>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; padding: 20px; font-family: Inter, system-ui, sans-serif; color: #111827; }
    .page-header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 24px; }
    .page-header h2 { margin: 0; font-size: 1.8rem; }
    .page-header p { margin: 0; color: #64748b; }
    .refresh { padding: 10px 16px; border: none; border-radius: 12px; background: #2563eb; color: white; cursor: pointer; }
    .section-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; margin-bottom: 24px; box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06); }
    .section-card h3 { margin-top: 0; font-size: 1.2rem; }
    .section-subtitle { color: #475569; margin-top: 6px; margin-bottom: 18px; }
    .empty-state { padding: 24px; text-align: center; color: #64748b; border: 1px dashed #cbd5e1; border-radius: 16px; }
    .card-list { display: grid; gap: 14px; }
    .item-card { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 18px 20px; border: 1px solid #e2e8f0; border-radius: 18px; background: #f8fafc; }
    .item-card.pending { background: #fef3c7; }
    .item-card strong { display: block; color: #0f172a; margin-bottom: 6px; }
    .item-card p { margin: 0; color: #475569; }
    .button-group { display: flex; gap: 10px; flex-wrap: wrap; }
    button { border: none; border-radius: 12px; padding: 10px 16px; cursor: pointer; font-weight: 600; }
    .primary { background: #2563eb; color: white; }
    .confirm { background: #16a34a; color: white; }
    .decline { background: #dc2626; color: white; }
    @media (max-width: 640px) { .item-card { flex-direction: column; align-items: stretch; } .button-group { width: 100%; justify-content: stretch; } .button-group button { width: 100%; } }
  `]
})
export class MesPatientsComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private rendezVousService = inject(RendezVousService);

  medecinId = this.auth.medecinId();
  rendezVousList = signal<RendezVous[]>([]);
  enAttente = signal<RendezVous[]>([]);

  constructor() {
    this.charger();
  }

  charger() {
    if (!this.medecinId) return;
    this.rendezVousService.getConfirmesByMedecin(this.medecinId).subscribe(list => this.rendezVousList.set(list));
    this.rendezVousService.getByMedecin(this.medecinId).subscribe(list =>
      this.enAttente.set(list.filter(r => r.statut === 'En_ATTENTE'))
    );
  }

  voirPatient(rdv: RendezVous) {
    this.router.navigate(['/medecin/patient', rdv.patientId], { queryParams: { rdvId: rdv.id } });
  }

  confirmer(rdv: RendezVous) {
    if (!rdv.id) return;
    this.rendezVousService.confirmer(rdv.id).subscribe(() => this.charger());
  }

  refuser(rdv: RendezVous) {
    if (!rdv.id) return;
    this.rendezVousService.refuser(rdv.id).subscribe(() => this.charger());
  }
}
