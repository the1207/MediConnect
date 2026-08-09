import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../models/mediconnect.models';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h2>Mes patients</h2>

    <div class="search-bar">
      <input [(ngModel)]="query" placeholder="Rechercher par nom" />
      <button (click)="search()">Rechercher</button>
      <button (click)="chargerTous()">Voir tous</button>
    </div>

    <ul>
      <li *ngFor="let patient of patients()">
        <strong>{{ patient.nom }} {{ patient.prenom }}</strong>
        <div>
          <span>{{ patient.dateNaissance }}</span>
          <span>{{ patient.sexe }}</span>
        </div>
        <div class="actions">
          <a [routerLink]="['/infirmier/constantes', patient.id]">Constantes</a>
          <a [routerLink]="['/infirmier/choix-medecin', patient.id]">Nouvelle consultation</a>
        </div>
      </li>
      <li *ngIf="!patients().length">Aucun patient trouvé.</li>
    </ul>
  `,
  styles: [
    `
      .search-bar { display: flex; gap: 12px; margin-bottom: 16px; }
      input { flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; }
      button { padding: 10px 14px; border: none; border-radius: 8px; background: #2563eb; color: white; cursor: pointer; }
      ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
      li { padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; }
      .actions { margin-top: 10px; display: flex; gap: 12px; flex-wrap: wrap; }
      a { color: #2563eb; text-decoration: none; font-weight: 600; }
    `
  ]
})
export class PatientsListComponent {
  private patientService = inject(PatientService);

  patients = signal<Patient[]>([]);
  query = '';

  constructor() {
    this.chargerTous();
  }

  chargerTous() {
    this.patientService.rechercher('').subscribe(list => this.patients.set(list));
  }

  search() {
    this.patientService.rechercher(this.query).subscribe(list => this.patients.set(list));
  }
}
