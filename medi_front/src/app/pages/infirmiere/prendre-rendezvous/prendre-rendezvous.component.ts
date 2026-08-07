import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DisponibiliteService } from '../../../core/services/disponibilite.service';
import { MedecinService } from '../../../core/services/medecin.service';
import { PatientService } from '../../../core/services/patient.service';
import { RendezVousService } from '../../../core/services/rendezvous.service';
import { SpecialiteService } from '../../../core/services/specialite.service';
import { Disponibilite, Medecin, Patient, RendezVousRequest, Specialite } from '../../../core/models';

@Component({
  selector: 'app-prendre-rendezvous',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">Prendre un rendez-vous</h1>
          <p class="page-subtitle">Sélectionnez une spécialité, un médecin puis un créneau.</p>
        </div>
        <div class="header-right">
          <a routerLink="/infirmiere/recherche" class="btn-secondary">Retour</a>
        </div>
      </div>

      <ng-container *ngIf="loading(); else formContent">
        <p>Chargement des données...</p>
      </ng-container>

      <ng-template #formContent>
        <div class="card form-card">
          <form (ngSubmit)="submit()">
            <div class="form-group">
              <label for="specialite">Spécialité</label>
              <select id="specialite" [(ngModel)]="selectedSpecialiteId" name="specialite" (change)="onSpecialiteChange()">
                <option [ngValue]="null">-- Sélectionner --</option>
                <option *ngFor="let specialite of specialites()" [ngValue]="specialite.id">{{ specialite.nom }}</option>
              </select>
            </div>

            <div class="form-group">
              <label for="medecin">Médecin</label>
              <select id="medecin" [(ngModel)]="selectedMedecinId" name="medecin" (change)="onMedecinChange()" [disabled]="!medecins().length">
                <option [ngValue]="null">-- Sélectionner --</option>
                <option *ngFor="let medecin of medecins()" [ngValue]="medecin.id">Dr {{ medecin.prenom }} {{ medecin.nom }}</option>
              </select>
            </div>

            <div class="form-group">
              <label for="creneau">Créneau disponible</label>
              <select id="creneau" [(ngModel)]="selectedDisponibiliteId" name="creneau" [disabled]="!disponibilites().length">
                <option [ngValue]="null">-- Sélectionner --</option>
                <option *ngFor="let dispo of disponibilites()" [ngValue]="dispo.id">{{ dispo.dateCreneau | date:'dd/MM/yyyy' }} - {{ dispo.heureDebut }} / {{ dispo.heureFin }}</option>
              </select>
            </div>

            <div class="form-group">
              <label for="motif">Motif</label>
              <textarea id="motif" rows="3" [(ngModel)]="motif" name="motif" required></textarea>
            </div>

            <div class="actions">
              <button type="submit" class="btn btn-primary" [disabled]="!canSubmit()">Enregistrer</button>
              <button type="button" class="btn btn-secondary" (click)="cancel()">Annuler</button>
            </div>
          </form>

          <div *ngIf="successMessage()" class="alert alert-success">{{ successMessage() }}</div>
          <div *ngIf="errorMessage()" class="alert alert-danger">{{ errorMessage() }}</div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
      .page-title { margin: 0; font-size: 24px; }
      .form-card { padding: 20px; }
      .form-group { margin-bottom: 16px; }
      label { display: block; margin-bottom: 8px; font-weight: 600; }
      select, textarea { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; }
      .actions { display: flex; gap: 12px; margin-top: 18px; }
    `
  ]
})
export class PrendreRendezvousComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private specialiteService = inject(SpecialiteService);
  private medecinService = inject(MedecinService);
  private disponibiliteService = inject(DisponibiliteService);
  private rendezVousService = inject(RendezVousService);
  private patientService = inject(PatientService);

  specialites = signal<Specialite[]>([]);
  medecins = signal<Medecin[]>([]);
  disponibilites = signal<Disponibilite[]>([]);
  patient = signal<Patient | null>(null);
  selectedSpecialiteId = signal<number | null>(null);
  selectedMedecinId = signal<number | null>(null);
  selectedDisponibiliteId = signal<number | null>(null);
  motif = signal('');
  loading = signal(true);
  successMessage = signal('');
  errorMessage = signal('');

  ngOnInit(): void {
    const patientId = Number(this.activatedRoute.snapshot.paramMap.get('patientId'));
    if (!patientId) {
      this.errorMessage.set('Patient introuvable.');
      this.loading.set(false);
      return;
    }

    this.loadPatient(patientId);
    this.loadSpecialites();
  }

  private loadPatient(patientId: number): void {
    this.patientService.getById(patientId).subscribe({
      next: (p) => this.patient.set(p),
      error: () => {
        this.errorMessage.set('Impossible de charger le patient.');
        this.loading.set(false);
      }
    });
  }

  private loadSpecialites(): void {
    this.specialiteService.getAll().subscribe({
      next: (list) => {
        this.specialites.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger les spécialités.');
        this.loading.set(false);
      }
    });
  }

  onSpecialiteChange(): void {
    this.medecins.set([]);
    this.disponibilites.set([]);
    this.selectedMedecinId.set(null);
    this.selectedDisponibiliteId.set(null);
    this.motif.set('');

    const specialiteId = this.selectedSpecialiteId();
    if (!specialiteId) {
      return;
    }

    this.medecinService.getBySpecialite(specialiteId).subscribe({
      next: (list) => this.medecins.set(list),
      error: () => this.errorMessage.set('Impossible de charger les médecins.')
    });
  }

  onMedecinChange(): void {
    this.disponibilites.set([]);
    this.selectedDisponibiliteId.set(null);
    this.motif.set('');

    const medecinId = this.selectedMedecinId();
    if (!medecinId) {
      return;
    }

    this.disponibiliteService.getByMedecin(medecinId).subscribe({
      next: (list) => this.disponibilites.set(list.filter(d => !d.reservation)),
      error: () => this.errorMessage.set('Impossible de charger les disponibilités.')
    });
  }

  canSubmit(): boolean {
    return !!(this.patient() && this.selectedSpecialiteId() && this.selectedMedecinId() && this.selectedDisponibiliteId() && this.motif().trim());
  }

  submit(): void {
    if (!this.canSubmit() || !this.patient()) {
      return;
    }

    const selectedDispo = this.disponibilites().find(d => d.id === this.selectedDisponibiliteId());
    if (!selectedDispo) {
      this.errorMessage.set('Veuillez choisir un créneau valide.');
      return;
    }

    const request: RendezVousRequest = {
      date: selectedDispo.dateCreneau,
      heure: selectedDispo.heureDebut,
      statut: 'En_ATTENTE',
      motif: this.motif().trim(),
      patientId: this.patient()!.id,
      medecinId: this.selectedMedecinId()!,
      disponibiliteId: this.selectedDisponibiliteId()!
    };

    this.rendezVousService.create(request).subscribe({
      next: () => {
        this.successMessage.set('Rendez-vous enregistré avec succès.');
        setTimeout(() => this.router.navigate(['/infirmiere/recherche']), 1200);
      },
      error: () => this.errorMessage.set('Impossible de créer le rendez-vous.')
    });
  }

  cancel(): void {
    this.router.navigate(['/infirmiere/recherche']);
  }
}
