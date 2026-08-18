import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SpecialiteService } from '../../../services/specialite.service';
import { MedecinService } from '../../../services/medecin.service';
import { DisponibiliteService } from '../../../services/disponibilite.service';
import { Specialite, Disponibilite } from '../../../models/mediconnect.models';

@Component({
  selector: 'app-choix-medecin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-header">
      <h2>Choisir un médecin disponible</h2>
      <p>Choisissez une spécialité, puis un médecin et réservez une place dans un créneau disponible.</p>
    </section>

    <div class="grid">
      <div class="card">
        <h3>1. Spécialité</h3>
        <select (change)="onSpecialiteChange($event)">
          <option value="">-- choisir --</option>
          <option *ngFor="let s of specialites()" [value]="s.id">{{ s.nom }}</option>
        </select>
      </div>

      <div class="card" *ngIf="medecins().length">
        <h3>2. Médecin</h3>
        <select (change)="onMedecinChange($event)">
          <option value="">-- choisir --</option>
          <option *ngFor="let m of medecins()" [value]="m.id">Dr. {{ m.nom }} {{ m.prenom }}</option>
        </select>
      </div>
    </div>

    <div *ngIf="medecinChoisi() && !creneauxLibres().length" class="empty-state">
      <p>Aucun créneau libre pour ce médecin actuellement.</p>
    </div>

    <div *ngIf="creneauxLibres().length" class="card card-full">
      <h3>3. Créneaux libres</h3>
      <div class="slot-list">
        <button type="button" *ngFor="let c of creneauxLibres()" class="slot-item" [class.active]="selectedCreneau()?.id === c.id" (click)="selectCreneau(c)">
          <div>
            <strong>{{ c.dateCreneau }}</strong>
            <div>{{ c.heureDebut }} → {{ c.heureFin }}</div>
            <div>{{ c.actif === false ? 'Désactivé par le médecin' : 'Disponibilité active' }}</div>
          </div>
          <span>Choisir</span>
        </button>
      </div>
    </div>

    <div *ngIf="selectedCreneau() as selected" class="card card-full selected-card">
      <h3>4. Réserver une place</h3>
      <div class="slot-preview">
        {{ selected.dateCreneau }} — {{ selected.heureDebut }} à {{ selected.heureFin }}
        <span> — Réservation illimitée </span>
      </div>
      <div class="actions">
        <button type="button" (click)="reserverSelection()">Réserver une place</button>
        <button type="button" class="secondary" (click)="cancelSelection()">Annuler</button>
      </div>
    </div>

    <div class="status">
      <p class="erreur" *ngIf="erreur()">{{ erreur() }}</p>
      <p class="succes" *ngIf="succes()">Rendez-vous créé avec succès.</p>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 20px;
      color: #111827;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .page-header {
      margin-bottom: 24px;
    }

    .page-header h2 {
      margin: 0 0 8px;
      font-size: 1.75rem;
      color: #111827;
    }

    .page-header p {
      margin: 0;
      color: #4b5563;
      max-width: 45rem;
      line-height: 1.6;
    }

    .grid {
      display: grid;
      gap: 16px;
      margin-bottom: 24px;
    }

    @media (min-width: 720px) {
      .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    .card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 18px;
      padding: 20px;
      box-shadow: 0 20px 55px rgba(15, 23, 42, 0.06);
    }

    .card-full {
      margin-bottom: 24px;
    }

    .card h3 {
      margin: 0 0 14px;
      font-size: 1.05rem;
      color: #111827;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #374151;
    }

    select,
    input[type="time"] {
      width: 100%;
      min-height: 44px;
      border: 1px solid #d1d5db;
      border-radius: 12px;
      padding: 10px 14px;
      background: #f9fafb;
      color: #111827;
      font-size: 0.98rem;
      transition: border-color 0.2s ease, background 0.2s ease;
    }

    select:focus,
    input[type="time"]:focus {
      outline: none;
      border-color: #2563eb;
      background: #fff;
    }

    .slot-list {
      display: grid;
      gap: 12px;
    }

    .slot-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 14px 18px;
      border: 1px solid #e5e7eb;
      border-radius: 14px;
      background: #f8fafc;
      color: #111827;
      cursor: pointer;
      text-align: left;
      transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
    }

    .slot-item:hover {
      transform: translateY(-1px);
      border-color: #3b82f6;
      background: #eff6ff;
    }

    .slot-item.active {
      border-color: #1d4ed8;
      background: #dbeafe;
    }

    .slot-item span {
      font-weight: 600;
      color: #1d4ed8;
    }

    .slot-preview {
      padding: 14px 16px;
      border-radius: 14px;
      background: #f8fafc;
      border: 1px solid #e5e7eb;
      margin-bottom: 16px;
      color: #111827;
    }

    .time-inputs {
      display: grid;
      gap: 16px;
    }

    @media (min-width: 640px) {
      .time-inputs {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 18px;
    }

    .actions button {
      min-width: 160px;
      padding: 12px 16px;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      font-weight: 600;
    }

    .actions button.secondary {
      background: #e5e7eb;
      color: #111827;
    }

    .actions button:not(.secondary) {
      background: #2563eb;
      color: white;
    }

    .status {
      margin-top: 18px;
    }

    .erreur {
      color: #b91c1c;
    }

    .succes {
      color: #047857;
    }

    .empty-state {
      padding: 18px 20px;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      background: #f9fafb;
      color: #374151;
    }
  `]
})
export class ChoixMedecinComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private specialiteService = inject(SpecialiteService);
  private medecinService = inject(MedecinService);
  private disponibiliteService = inject(DisponibiliteService);

  patientId = Number(this.route.snapshot.paramMap.get('patientId'));

  specialites = signal<Specialite[]>([]);
  medecins = signal<any[]>([]);
  creneauxLibres = signal<Disponibilite[]>([]);
  medecinChoisi = signal<number | null>(null);
  selectedCreneau = signal<Disponibilite | null>(null);
  // no more interval selection
  erreur = signal('');
  succes = signal(false);

  constructor() {
    this.specialiteService.getAll().subscribe(list => this.specialites.set(list));
  }

  onSpecialiteChange(event: Event) {
    const id = Number((event.target as HTMLSelectElement).value);
    this.medecins.set([]);
    this.creneauxLibres.set([]);
    this.medecinChoisi.set(null);
    if (!id) return;
    this.medecinService.getBySpecialite(id).subscribe(list => this.medecins.set(list));
  }

  onMedecinChange(event: Event) {
    const id = Number((event.target as HTMLSelectElement).value);
    this.medecinChoisi.set(id || null);
    this.creneauxLibres.set([]);
    this.cancelSelection();
    if (!id) return;
    this.disponibiliteService.getByMedecin(id).subscribe(list =>
      this.creneauxLibres.set(list.filter(c => c.actif !== false))
    );
  }

  selectCreneau(creneau: Disponibilite) {
    this.selectedCreneau.set(creneau);
    this.erreur.set('');
    this.succes.set(false);
  }

  cancelSelection() {
    this.selectedCreneau.set(null);
    // no interval state to reset
  }

  reserverSelection() {
    const selected = this.selectedCreneau();
    const medecinId = this.medecinChoisi();
    if (!selected || !medecinId) {
      this.erreur.set('Veuillez d’abord sélectionner un créneau.');
      return;
    }

    // Reserve a single place in the selected disponibilite (no interval)
    this.medecinService.ajouterRendezVous({
      date: selected.dateCreneau,
      heure: selected.heureDebut,
      motif: 'Consultation',
      patientId: this.patientId,
      medecinId,
      disponibiliteId: selected.id
    }).subscribe({
      next: () => {
        this.succes.set(true);
        this.cancelSelection();
        setTimeout(() => this.router.navigate(['/infirmier/patient-create']), 1500);
      },
      error: (err) => {
        const message = err?.error?.message || err?.message || 'Ce créneau vient peut-être d’être réservé, réessayez.';
        this.erreur.set(message);
      }
    });
  }

  private calculateDefaultEnd(start: string, maxEnd: string): string {
    const [h, m] = start.split(':').map(Number);
    const startMinutes = h * 60 + m + 30;
    const [maxH, maxM] = maxEnd.split(':').map(Number);
    const maxMinutes = maxH * 60 + maxM;
    const chosenMinutes = Math.min(startMinutes, maxMinutes);
    const hh = Math.floor(chosenMinutes / 60).toString().padStart(2, '0');
    const mm = (chosenMinutes % 60).toString().padStart(2, '0');
    return `${hh}:${mm}`;
  }

  private formatTimeForApi(time: string): string {
    const [h, m] = time.split(':').map(Number);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
  }

  private toHHmm(time: string): string {
    const [h, m] = time.split(':').map(Number);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  private normalizeTime(time: string): string {
    const [h, m] = time.split(':').map(Number);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
  }

  private isWithinSlot(slot: Disponibilite, start: string, end: string): boolean {
    const normalizedStart = this.normalizeTime(start);
    const normalizedEnd = this.normalizeTime(end);
    const slotStart = this.normalizeTime(slot.heureDebut);
    const slotEnd = this.normalizeTime(slot.heureFin);
    return normalizedStart >= slotStart && normalizedEnd <= slotEnd;
  }

  private isStartBeforeEnd(start: string, end: string): boolean {
    return this.normalizeTime(start) < this.normalizeTime(end);
  }
}
