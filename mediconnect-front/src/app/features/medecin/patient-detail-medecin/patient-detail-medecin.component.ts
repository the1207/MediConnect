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
    <section class="patient-header" *ngIf="patient() as p">
      <div>
        <h2>{{ p.prenom }} {{ p.nom }}</h2>
        <p>{{ p.sexe }} · Né(e) le {{ p.dateNaissance | date:'dd/MM/yyyy' }}</p>
      </div>
      <button type="button" class="primary" (click)="commencerConsultation()">Commencer la consultation</button>
    </section>

    <section class="section-card patient-info">
      <h3>Informations du patient</h3>
      <div class="info-grid">
        <div class="info-item"><span>Contact</span><strong>{{ patient()?.contact }}</strong></div>
        <div class="info-item"><span>Allergies</span><strong>{{ patient()?.allergies || 'Aucune' }}</strong></div>
        <div class="info-item"><span>Antécédents</span><strong>{{ patient()?.antecedents || 'Aucun' }}</strong></div>
        <div class="info-item"><span>Groupe sanguin</span><strong>{{ patient()?.groupeSanguin || 'Non renseigné' }}</strong></div>
      </div>
    </section>

    <section class="section-card">
      <h3>Constantes relevées</h3>
      <div *ngIf="!constantes().length" class="empty-state">Aucune constante enregistrée pour le moment.</div>
      <div class="constant-list">
        <article *ngFor="let c of constantes()" [class.alerte]="c.alerte" class="constant-card">
          <div>
            <strong>{{ c.date | date:'dd/MM/yyyy' }}</strong>
            <p>Temp: {{ c.temperature }}°C · Poids: {{ c.poids }}kg · TA: {{ c.tensionArteriel }}</p>
            <p *ngIf="c.motifVisite">Motif : {{ c.motifVisite }}</p>
          </div>
          <span *ngIf="c.alerte" class="alert-chip">⚠ ALERTE</span>
        </article>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; padding: 20px; font-family: Inter, system-ui, sans-serif; color: #111827; }
    .patient-header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 24px; }
    .patient-header h2 { margin: 0; font-size: 1.8rem; }
    .patient-header p { margin: 6px 0 0; color: #64748b; }
    .primary { padding: 12px 18px; border: none; border-radius: 14px; background: #2563eb; color: white; cursor: pointer; }
    .section-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; margin-bottom: 24px; box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06); }
    .section-card h3 { margin-top: 0; font-size: 1.2rem; }
    .info-grid { display: grid; gap: 16px; grid-template-columns: repeat(2, minmax(0, 1fr)); margin-top: 18px; }
    .info-item { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px; }
    .info-item span { display: block; color: #64748b; margin-bottom: 6px; }
    .info-item strong { color: #111827; }
    .constant-list { display: grid; gap: 14px; margin-top: 16px; }
    .constant-card { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 18px 20px; border: 1px solid #e2e8f0; border-radius: 18px; background: #f8fafc; }
    .constant-card.alerte { border-color: #fca5a5; background: #ffebee; }
    .constant-card strong { display: block; margin-bottom: 6px; }
    .constant-card p { margin: 0; color: #475569; }
    .alert-chip { padding: 8px 12px; border-radius: 999px; background: #fecaca; color: #991b1b; font-weight: 700; }
    .empty-state { padding: 20px; text-align: center; color: #64748b; border: 1px dashed #cbd5e1; border-radius: 16px; }
    @media (max-width: 720px) { .info-grid { grid-template-columns: 1fr; } .constant-card { flex-direction: column; align-items: flex-start; } }
  `]
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
    this.constanteService.getByPatient(this.patientId).subscribe(list => {
      const sorted = [...list].sort((a, b) => new Date(b.date ?? '').getTime() - new Date(a.date ?? '').getTime());
      this.constantes.set(sorted);
    });
  }

  commencerConsultation() {
    this.router.navigate(['/medecin/consultation', this.patientId]);
  }
}
