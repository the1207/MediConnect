import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminUserService } from '../services/admin-user.service';
import { MedecinService } from '../services/medecin.service';
import { PatientService } from '../services/patient.service';
import { Consultatio nService } from '../services/consultation.service';
import { OrdonnanceService } from '../services/ordonnance.service';
import { DisponibiliteService } from '../services/disponibilite.service';
import { ConstanteService } from '../services/constante.service';
import { RendezVousService } from '../services/rendez-vous.service';
import { AuthService } from '../services/auth.service';
import {
  Patient,
  Specialite,
  Disponibilite,
  UserRoleReponse,
  HistoryReponse,
  Consultation,
  Ordonnance,
  Constante,
  RendezVous,
} from '../models/mediconnect.models';

@Component({
  selector: 'app-admin-specialites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-4">
      <h2 class="text-2xl font-semibold">Spécialités</h2>
      <form class="grid gap-2 sm:grid-cols-[1fr_auto]" (ngSubmit)="creer()">
        <input
          [(ngModel)]="nom"
          name="nom"
          class="input"
          placeholder="Nom de la spécialité"
          required
        />
        <button class="btn-primary" type="submit" [disabled]="!nom || loading()">
          {{ loading() ? 'Création...' : 'Créer' }}
        </button>
      </form>

      <ul class="space-y-2">
        <li *ngFor="let item of specialites()" class="card">
          {{ item.nom }}
        </li>
        <li *ngIf="!specialites().length" class="text-muted">Aucune spécialité enregistrée.</li>
      </ul>
    </div>
  `,
  styles: [
    ".input { width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.75rem; }",
    ".btn-primary { background: #2563eb; color: white; padding: 0.75rem 1.2rem; border-radius: 0.75rem; }",
    ".card { padding: 1rem; border: 1px solid #e5e7eb; border-radius: 1rem; background: white; }",
    ".text-muted { color: #6b7280; }",
  ],
})
export class AdminSpecialitesComponent {
  private specialiteService = inject(MedecinService);
  nom = '';
  loading = signal(false);
  specialites = signal<Specialite[]>([]);

  constructor() {
    this.charger();
  }

  charger() {
    this.specialiteService.getAll().subscribe(list => this.specialites.set(list));
  }

  creer() {
    if (!this.nom) return;
    this.loading.set(true);
    this.specialiteService.create(this.nom).subscribe({
      next: () => {
        this.nom = '';
        this.loading.set(false);
        this.charger();
      },
      error: () => this.loading.set(false),
    });
  }
}
