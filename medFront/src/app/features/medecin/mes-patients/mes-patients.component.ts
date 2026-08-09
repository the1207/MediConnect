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
    <h2>Mes patients (rendez-vous confirmés)</h2>
    <ul>
      <li *ngFor="let rdv of rendezVousList()">
        {{ rdv.date }} {{ rdv.heure }} — Patient #{{ rdv.patientId }}
        <button (click)="voirPatient(rdv)">Ouvrir le dossier</button>
      </li>
      <li *ngIf="!rendezVousList().length">Aucun patient confirmé pour le moment.</li>
    </ul>

    <h3>Demandes en attente</h3>
    <ul>
      <li *ngFor="let rdv of enAttente()">
        {{ rdv.date }} {{ rdv.heure }} — Patient #{{ rdv.patientId }}
        <button (click)="confirmer(rdv)">Confirmer</button>
        <button (click)="refuser(rdv)">Refuser</button>
      </li>
      <li *ngIf="!enAttente().length">Aucune demande en attente.</li>
    </ul>
  `,
  styles: [`button { margin-left: 8px; padding: 6px 10px; border: none; border-radius: 8px; color: white; cursor: pointer; } button:first-of-type { background: #16a34a; } button:last-of-type { background: #dc2626; }`]
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
