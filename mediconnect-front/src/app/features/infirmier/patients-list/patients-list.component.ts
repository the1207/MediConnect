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
    <section class="page-shell">
      <div class="header-row">
        <h2>Mes patients</h2>
      </div>

      <div class="controls-panel">
        <div class="alpha-filter">
          <label for="initialFilter">Filtrer :</label>
          <select id="initialFilter" (change)="onSelect($event)" [value]="selectedLetter() ?? ''">
            <option value="">Tous</option>
            <option *ngFor="let l of letters" [value]="l">{{ l }}</option>
          </select>
        </div>
        <div class="search-bar">
          <input [(ngModel)]="query" placeholder="Rechercher par nom" />
          <button (click)="search()">Rechercher</button>
          <button class="secondary" (click)="chargerTous()">Voir tous</button>
        </div>
      </div>

      <ul>
        <li *ngFor="let patient of filteredPatients()">
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
    </section>
  `,
  styles: [
    `
      :host { display:block; padding:20px; color:#111827; font-family: Inter, system-ui, sans-serif; }
      .page-shell { display:grid; gap:18px; }
      .header-row h2 { margin:0; font-size:1.8rem; }
      .controls-panel { background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; padding:18px; box-shadow:0 18px 40px rgba(15,23,42,.06); }
      .search-bar { display:flex; gap:12px; margin-top:14px; flex-wrap:wrap; }
      .alpha-filter { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
      .alpha-filter label { font-weight:600; color:#334155; }
      .alpha-filter select { padding:10px 12px; border:1px solid #cbd5e1; border-radius:10px; background:#f8fafc; }
      input { flex:1; min-width:220px; padding:10px 12px; border:1px solid #cbd5e1; border-radius:10px; }
      button { padding:10px 14px; border:none; border-radius:10px; background:#2563eb; color:white; cursor:pointer; }
      button.secondary { background:#e2e8f0; color:#0f172a; }
      ul { list-style:none; padding:0; margin:0; display:grid; gap:12px; }
      li { padding:16px; border:1px solid #e2e8f0; border-radius:16px; background:#ffffff; box-shadow:0 12px 28px rgba(15,23,42,.04); }
      .actions { margin-top:10px; display:flex; gap:12px; flex-wrap:wrap; }
      a { color:#2563eb; text-decoration:none; font-weight:600; }
    `
  ]
})
export class PatientsListComponent {
  private patientService = inject(PatientService);

  patients = signal<Patient[]>([]);
  query = '';
  letters = Array.from({length:26}, (_,i)=> String.fromCharCode(65+i));
  selectedLetter = signal<string | null>(null);

  constructor() {
    this.chargerTous();
    this.setFilter(null);
  }

  chargerTous() {
    this.patientService.rechercher('').subscribe(list => {
      const sorted = [...list].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
      this.patients.set(sorted);
    });
  }

  search() {
    this.patientService.rechercher(this.query).subscribe(list => {
      const sorted = [...list].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
      this.patients.set(sorted);
    });
  }

  setFilter(letter: string | null) {
    this.selectedLetter.set(letter);
  }

  onSelect(event: Event) {
    const v = (event.target as HTMLSelectElement).value;
    this.setFilter(v === '' ? null : v);
  }

  filteredPatients() {
    const letter = this.selectedLetter();
    const all = [...this.patients()].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    if (!letter) return all;
    const lower = letter.toLowerCase();
    return all.filter(p => (p.nom || '').toLowerCase().startsWith(lower));
  }
}
