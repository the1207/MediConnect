import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { ConstanteService } from '../../../services/constante.service';
import { Patient, Constante } from '../../../models/mediconnect.models';

@Component({
  selector: 'app-patient-detail-medecin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section *ngIf="patient() as p">
      <h2>{{ p.prenom }} {{ p.nom }}</h2>
      <p>Né(e) le {{ p.dateNaissance }} — {{ p.sexe }}</p>
      <p>Contact : {{ p.contact }}</p>
      <p>Allergies : {{ p.allergies || 'Aucune' }}</p>
      <p>Antécédents : {{ p.antecedents || 'Aucun' }}</p>
      <p>Groupe sanguin : {{ p.groupeSanguin || 'Non renseigné' }}</p>
    </section>

    <h3>Constantes relevées</h3>
    <ul>
      <li *ngFor="let c of constantes()" [class.alerte]="c.alerte">
        {{ c.date }} — Temp: {{ c.temperature }}°C, Poids: {{ c.poids }}kg, TA: {{ c.tensionArteriel }}
        <span *ngIf="c.motifVisite"> — Motif : {{ c.motifVisite }}</span>
        <strong *ngIf="c.alerte"> ⚠ ALERTE</strong>
      </li>
    </ul>

    <button (click)="commencerConsultation()">Commencer la consultation</button>
  `,
  styles: [`.alerte { color: red; } button { margin-top: 18px; padding: 10px 14px; border: none; border-radius: 8px; background: #2563eb; color: white; cursor: pointer; }`]
})
export class PatientDetailMedecinComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private patientService = inject(PatientService);
  private constanteService = inject(ConstanteService);

  patientId = Number(this.route.snapshot.paramMap.get('id'));
  patient = signal<Patient | null>(null);
  constantes = signal<Constante[]>([]);

  constructor() {
    this.patientService.getById(this.patientId).subscribe(p => this.patient.set(p));
    this.constanteService.getByPatient(this.patientId).subscribe(list => this.constantes.set(list));
  }

  commencerConsultation() {
    this.router.navigate(['/medecin/consultation', this.patientId]);
  }
}
