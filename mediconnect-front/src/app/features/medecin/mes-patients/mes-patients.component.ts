import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RendezVousService } from '../../../services/rendez-vous.service';
import { PatientService } from '../../../services/patient.service';
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

    <section class="section-card">
      <h3>Demandes en attente</h3>
      <p class="section-subtitle">Répondez rapidement aux demandes de rendez-vous.</p>
      <div *ngIf="!filteredPending().length" class="empty-state">Aucune demande en attente.</div>
      <div class="card-list">
        <article *ngFor="let rdv of filteredPending()" class="item-card pending">
          <div>
            <strong>{{ rdv.date | date:'dd/MM/yyyy' }} · {{ rdv.heure }}</strong>
            <p>{{ patientName(rdv.patientId) }}</p>
          </div>
          <div class="button-group">
            <button class="confirm" type="button" (click)="confirmer(rdv)">Confirmer</button>
            <button class="decline" type="button" (click)="refuser(rdv)">Refuser</button>
          </div>
        </article>
      </div>
    </section>

    <section class="section-card">
      <h3>Patients confirmés</h3>
      <p class="section-subtitle">Rendez-vous déjà validés et à suivre.</p>
      <div *ngIf="!filteredConfirmed().length" class="empty-state">Aucun patient confirmé pour le moment.</div>
      <div class="card-list">
        <article *ngFor="let rdv of filteredConfirmed()" class="item-card">
          <div>
            <strong>{{ rdv.date | date:'dd/MM/yyyy' }} · {{ rdv.heure }}</strong>
            <p>{{ patientName(rdv.patientId) }}</p>
          </div>
          <button class="primary" type="button" (click)="voirPatient(rdv)">Ouvrir le dossier</button>
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
    .status-box { margin-bottom: 16px; padding: 12px 14px; border-radius: 12px; font-weight: 600; }
    .status-box.success { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
    .status-box.error { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
    .status-box.info { background: #dbeafe; color: #1d4ed8; border: 1px solid #93c5fd; }
    .controls-panel { background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; padding:18px; margin-bottom:18px; box-shadow:0 18px 40px rgba(15,23,42,.06); }
    .alpha-filter { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
    .alpha-filter label { font-weight:600; color:#334155; }
    .alpha-filter select { padding:10px 12px; border:1px solid #cbd5e1; border-radius:10px; background:#f8fafc; }
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
export class MesPatientsComponent implements OnDestroy {
  private auth = inject(AuthService);
  private router = inject(Router);
  private rendezVousService = inject(RendezVousService);
  private patientService = inject(PatientService);

  medecinId = this.auth.medecinId();
  rendezVousList = signal<RendezVous[]>([]);
  enAttente = signal<RendezVous[]>([]);
  patientNames = signal<Record<number, string>>({});
  letters = Array.from({length:26}, (_,i)=> String.fromCharCode(65+i));
  selectedLetter = signal<string | null>(null);
  message = signal('');
  messageType = signal<'success' | 'error' | 'info'>('info');

  constructor() {
    this.charger();
    // polling to auto-refresh new requests made by infirmier
    this.pollId = setInterval(() => this.charger(), 8000);
  }

  pollId: any = null;

  ngOnDestroy(): void {
    if (this.pollId) clearInterval(this.pollId);
  }

  charger() {
    if (!this.medecinId) return;
    this.rendezVousService.getConfirmesByMedecin(this.medecinId).subscribe(list => {
      const sorted = [...list].sort((a, b) => this.dateToTimestamp(b.date, b.heure) - this.dateToTimestamp(a.date, a.heure));
      this.rendezVousList.set(sorted);
      const ids = Array.from(new Set(sorted.map(r => r.patientId)));
      this.loadPatientNames(ids);
    });
    this.rendezVousService.getByMedecin(this.medecinId).subscribe(list => {
      const en = [...list.filter(r => r.statut === 'En_ATTENTE')].sort((a, b) => this.dateToTimestamp(b.date, b.heure) - this.dateToTimestamp(a.date, a.heure));
      this.enAttente.set(en);
      const ids = Array.from(new Set(en.map(r => r.patientId)));
      this.loadPatientNames(ids);
    });
  }

  loadPatientNames(ids: number[]) {
    const map = this.patientNames();
    ids.forEach(id => {
      if (!map[id]) {
        this.patientService.getById(id).subscribe(p => {
          this.patientNames.update(m => ({ ...m, [id]: `${p.nom} ${p.prenom}` }));
        }, () => {
          this.patientNames.update(m => ({ ...m, [id]: `Patient #${id}` }));
        });
      }
    });
  }

  setFilter(letter: string | null) {
    this.selectedLetter.set(letter);
  }

  onSelect(event: Event) {
    const v = (event.target as HTMLSelectElement).value;
    this.setFilter(v === '' ? null : v);
  }

  filteredPending() {
    const letter = this.selectedLetter();
    const all = [...this.enAttente()].sort((a, b) => this.dateToTimestamp(b.date, b.heure) - this.dateToTimestamp(a.date, a.heure));
    if (!letter) return all;
    const lower = letter.toLowerCase();
    return all.filter(r => (this.patientName(r.patientId) || '').toLowerCase().startsWith(lower));
  }

  filteredConfirmed() {
    const letter = this.selectedLetter();
    const all = [...this.rendezVousList()].sort((a, b) => this.dateToTimestamp(b.date, b.heure) - this.dateToTimestamp(a.date, a.heure));
    if (!letter) return all;
    const lower = letter.toLowerCase();
    return all.filter(r => (this.patientName(r.patientId) || '').toLowerCase().startsWith(lower));
  }

  private dateToTimestamp(date: string, time: string): number {
    const fullDate = `${date}T${time || '00:00:00'}`;
    return new Date(fullDate).getTime();
  }

  patientName(id: number) {
    return this.patientNames()[id] ?? `Patient #${id}`;
  }

  voirPatient(rdv: RendezVous) {
    this.router.navigate(['/medecin/patient', rdv.patientId], { queryParams: { rdvId: rdv.id } });
  }

  confirmer(rdv: RendezVous) {
    if (!rdv.id) return;
    this.message.set('');
    this.messageType.set('success');
    this.rendezVousService.confirmer(rdv.id).subscribe({
      next: () => {
        this.message.set('Demande confirmée avec succès.');
        this.messageType.set('success');
        this.charger();
      },
      error: () => {
        this.message.set('Impossible de confirmer cette demande.');
        this.messageType.set('error');
      }
    });
  }

  refuser(rdv: RendezVous) {
    if (!rdv.id) return;
    this.message.set('');
    this.messageType.set('success');
    this.rendezVousService.refuser(rdv.id).subscribe({
      next: () => {
        this.message.set('Demande refusée avec succès.');
        this.messageType.set('success');
        this.charger();
      },
      error: () => {
        this.message.set('Impossible de refuser cette demande.');
        this.messageType.set('error');
      }
    });
  }
}
