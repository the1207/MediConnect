import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';
import { ConstanteService } from '../../../core/services/constante.service';
import { FileAttenteService } from '../../../core/services/file-attente.service';
import { SeuilAlerteService } from '../../../core/services/seuil-alerte.service';
import { AuthService } from '../../../core/services/auth.service';
import { Patient, Constante, SeuilAlerte, ConstanteRequest, FileAttenteRequest } from '../../../core/models';

@Component({
  selector: 'app-prise-constantes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Loading state -->
    @if (!patient()) {
      <div class="loading-container">
        <div class="spinner spinner-lg"></div>
        <p class="loading-text">Chargement du patient...</p>
      </div>
    }

    @if (patient()) {
      <!-- Page Header -->
      <div class="page-header">
        <button class="btn-back" (click)="goBack()" title="Retour">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
        </button>
        <div class="page-header-content">
          <h1 class="page-title">Prise de Constantes</h1>
          <div class="patient-info-header">
            <div class="avatar">
              {{ patient()!.prenom.charAt(0) }}{{ patient()!.nom.charAt(0) }}
            </div>
            <div>
              <span class="patient-name">{{ patient()!.prenom }} {{ patient()!.nom }}</span>
              <span class="patient-meta">
                Ne(e) le {{ formatDate(patient()!.dateNaissance) }} ({{ calculateAge(patient()!.dateNaissance) }} ans)
                @if (patient()!.sexe) {
                  <span class="separator-dot"></span> {{ patient()!.sexe === 'M' ? 'Masculin' : 'Feminin' }}
                }
                @if (patient()!.groupeSanguin) {
                  <span class="separator-dot"></span> Groupe {{ patient()!.groupeSanguin }}
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Alerts: Success / Error -->
      @if (success()) {
        <div class="alert alert-success mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>
          </svg>
          <span>Constantes enregistrees et patient ajoute a la file d'attente avec succes !</span>
        </div>
      }

      @if (error()) {
        <div class="alert alert-danger mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ error() }}</span>
        </div>
      }

      <!-- Patient Allergies / Antecedents Card -->
      @if (patient()!.allergies || patient()!.antecedents) {
        <div class="alert-card-medical">
          <div class="alert-card-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span class="alert-card-title">Informations medicales importantes</span>
          </div>
          <div class="alert-card-body">
            @if (patient()!.allergies) {
              <div class="alert-item">
                <span class="alert-item-label">Allergies :</span>
                <span class="alert-item-value alert-item-value--danger">{{ patient()!.allergies }}</span>
              </div>
            }
            @if (patient()!.antecedents) {
              <div class="alert-item">
                <span class="alert-item-label">Antecedents :</span>
                <span class="alert-item-value">{{ patient()!.antecedents }}</span>
              </div>
            }
          </div>
        </div>
      }

      <!-- Main Form Card -->
      <div class="card form-card">
        <div class="card-header">
          <h2 class="card-title">Prise de constantes</h2>
          @if (hasAnyAlert()) {
            <span class="badge badge-danger">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Alertes detectees
            </span>
          }
        </div>

        <!-- Constantes Inputs Grid -->
        <div class="form-grid">
          <!-- Temperature -->
          <div class="form-group">
            <label class="form-label" for="temperature">
              Temperature
              @if (alerteTemperature()) {
                <span class="badge badge-danger badge-sm">Hors seuil</span>
              }
            </label>
            <div class="input-with-unit" [class.input-alert-border]="alerteTemperature()">
              <input
                type="number"
                id="temperature"
                class="form-input input-no-border"
                [(ngModel)]="formData.temperature"
                (ngModelChange)="checkAlertes()"
                step="0.1"
                min="30"
                max="45"
                placeholder="37.0"
              />
              <span class="input-unit">&#176;C</span>
            </div>
            @if (seuilTemperature()) {
              <span class="form-hint">
                Seuil normal : {{ seuilTemperature()!.valeurMin }} - {{ seuilTemperature()!.valeurMax }} &#176;C
              </span>
            }
          </div>

          <!-- Poids -->
          <div class="form-group">
            <label class="form-label" for="poids">
              Poids
              @if (alertePoids()) {
                <span class="badge badge-danger badge-sm">Hors seuil</span>
              }
            </label>
            <div class="input-with-unit" [class.input-alert-border]="alertePoids()">
              <input
                type="number"
                id="poids"
                class="form-input input-no-border"
                [(ngModel)]="formData.poids"
                (ngModelChange)="checkAlertes()"
                step="0.1"
                min="0"
                max="300"
                placeholder="70.0"
              />
              <span class="input-unit">kg</span>
            </div>
            @if (seuilPoids()) {
              <span class="form-hint">
                Seuil normal : {{ seuilPoids()!.valeurMin }} - {{ seuilPoids()!.valeurMax }} kg
              </span>
            }
          </div>

          <!-- Tension Arterielle -->
          <div class="form-group">
            <label class="form-label" for="tension">
              Tension arterielle
              @if (alerteTension()) {
                <span class="badge badge-danger badge-sm">Hors seuil</span>
              }
            </label>
            <div class="input-with-unit" [class.input-alert-border]="alerteTension()">
              <input
                type="text"
                id="tension"
                class="form-input input-no-border"
                [(ngModel)]="formData.tensionArteriel"
                (ngModelChange)="checkAlerteTension()"
                placeholder="12/8"
              />
              <span class="input-unit">mmHg</span>
            </div>
            @if (seuilTension()) {
              <span class="form-hint">
                Seuil systolique : {{ seuilTension()!.valeurMin }} - {{ seuilTension()!.valeurMax }} mmHg
              </span>
            }
          </div>

          <!-- Motif de visite -->
          <div class="form-group">
            <label class="form-label" for="motif">Motif de visite</label>
            <input
              type="text"
              id="motif"
              class="form-input"
              [(ngModel)]="formData.motifVisite"
              placeholder="Ex: toux, douleur, controle..."
            />
          </div>

          <!-- Priorite -->
          <div class="form-group">
            <label class="form-label" for="priorite">
              Priorite
              @if (hasAnyAlert() && formData.priorite !== 'URGENTE') {
                <span class="badge badge-warning badge-sm">Auto: URGENTE</span>
              }
            </label>
            <select
              id="priorite"
              class="form-select"
              [(ngModel)]="formData.priorite"
            >
              <option value="NORMALE">NORMALE</option>
              <option value="HAUTE">HAUTE</option>
              <option value="URGENTE">URGENTE</option>
            </select>
          </div>
        </div>

        <!-- Alert Banner -->
        @if (hasAnyAlert()) {
          <div class="alert-banner">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div>
              <strong>Attention !</strong> Une ou plusieurs constantes depassent les seuils normaux.
              La priorite sera automatiquement passee a <strong>URGENTE</strong> lors de l'enregistrement.
            </div>
          </div>
        }
      </div>

      <!-- Comparaison derniere mesure -->
      @if (lastConstante()) {
        <div class="card comparison-card">
          <div class="card-header">
            <h2 class="card-title">Comparaison derniere mesure</h2>
            <span class="comparison-date">{{ formatDateTime(lastConstante()!.date) }}</span>
          </div>
          <div class="comparison-grid">
            <!-- Temperature comparison -->
            <div class="comparison-item">
              <span class="comparison-label">Temperature</span>
              <div class="comparison-values">
                <span class="comparison-old">{{ lastConstante()!.temperature }} &#176;C</span>
                @if (formData.temperature) {
                  <span class="trend" [class]="getTrendClass(formData.temperature, lastConstante()!.temperature)">
                    {{ getTrendArrow(formData.temperature, lastConstante()!.temperature) }}
                    {{ formData.temperature }} &#176;C
                  </span>
                } @else {
                  <span class="comparison-pending">--</span>
                }
              </div>
            </div>

            <!-- Poids comparison -->
            <div class="comparison-item">
              <span class="comparison-label">Poids</span>
              <div class="comparison-values">
                <span class="comparison-old">{{ lastConstante()!.poids }} kg</span>
                @if (formData.poids) {
                  <span class="trend" [class]="getTrendClass(formData.poids, lastConstante()!.poids)">
                    {{ getTrendArrow(formData.poids, lastConstante()!.poids) }}
                    {{ formData.poids }} kg
                  </span>
                } @else {
                  <span class="comparison-pending">--</span>
                }
              </div>
            </div>

            <!-- Tension comparison -->
            <div class="comparison-item">
              <span class="comparison-label">Tension arterielle</span>
              <div class="comparison-values">
                <span class="comparison-old">{{ lastConstante()!.tensionArteriel }} mmHg</span>
                @if (formData.tensionArteriel) {
                  <span class="trend" [class]="getTensionTrendClass()">
                    {{ getTensionTrendArrow() }}
                    {{ formData.tensionArteriel }} mmHg
                  </span>
                } @else {
                  <span class="comparison-pending">--</span>
                }
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Form Actions -->
      <div class="form-actions">
        <button type="button" class="btn btn-secondary btn-md" (click)="reset()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          Reinitialiser
        </button>
        <button
          class="btn btn-primary btn-md"
          [disabled]="loading() || !isFormValid()"
          (click)="onSubmit()"
        >
          @if (loading()) {
            <span class="spinner spinner-sm"></span>
            Enregistrement...
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/>
            </svg>
            Enregistrer et ajouter a la file
          }
        </button>
      </div>
    }
  `,
  styles: [`
    /* Page Header */
    .page-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 24px;
    }

    .btn-back {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-card);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      cursor: pointer;
      color: var(--text-secondary);
      transition: all var(--transition-fast);
      flex-shrink: 0;
    }

    .btn-back:hover {
      background: var(--bg-page);
      color: var(--text-primary);
      border-color: var(--color-primary);
    }

    .page-header-content {
      flex: 1;
    }

    .page-title {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 12px;
    }

    .patient-info-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .patient-name {
      display: block;
      font-size: 15px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .patient-meta {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: var(--text-secondary);
      margin-top: 2px;
    }

    .separator-dot {
      display: inline-block;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--text-muted);
      margin: 0 4px;
    }

    /* Medical Alert Card */
    .alert-card-medical {
      background: var(--color-warning-light);
      border: 1px solid #FDE68A;
      border-radius: var(--radius-lg);
      padding: 16px 20px;
      margin-bottom: 24px;
    }

    .alert-card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
      color: #92400E;
    }

    .alert-card-title {
      font-size: 14px;
      font-weight: 600;
    }

    .alert-card-body {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-left: 30px;
    }

    .alert-item {
      display: flex;
      align-items: baseline;
      gap: 8px;
      font-size: 14px;
    }

    .alert-item-label {
      font-weight: 500;
      color: #92400E;
      white-space: nowrap;
    }

    .alert-item-value {
      color: #78350F;
    }

    .alert-item-value--danger {
      font-weight: 600;
      color: var(--color-danger);
    }

    /* Form Card */
    .form-card {
      margin-bottom: 24px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .form-group {
      margin-bottom: 0;
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    .badge-sm {
      padding: 2px 8px;
      font-size: 11px;
    }

    /* Input with unit */
    .input-with-unit {
      display: flex;
      align-items: center;
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      background: var(--bg-input);
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
      overflow: hidden;
    }

    .input-with-unit:focus-within {
      border-color: var(--border-focus);
      box-shadow: 0 0 0 3px rgba(60, 80, 224, 0.12);
    }

    .input-with-unit.input-alert-border {
      border-color: var(--color-danger);
      background: var(--color-danger-light);
    }

    .input-with-unit.input-alert-border:focus-within {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
    }

    .input-no-border {
      border: none !important;
      box-shadow: none !important;
      background: transparent !important;
      flex: 1;
    }

    .input-no-border:focus {
      border: none !important;
      box-shadow: none !important;
    }

    .input-unit {
      padding: 0 14px;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
      background: var(--bg-table-header);
      height: var(--input-height);
      display: flex;
      align-items: center;
      border-left: 1px solid var(--border-default);
      white-space: nowrap;
    }

    .form-hint {
      display: block;
      margin-top: 6px;
      font-size: 12px;
      color: var(--text-muted);
    }

    /* Alert Banner */
    .alert-banner {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 16px;
      background: var(--color-danger-light);
      border: 1px solid #FECACA;
      border-radius: var(--radius-md);
      margin-top: 20px;
      color: #991B1B;
      font-size: 14px;
    }

    .alert-banner svg {
      flex-shrink: 0;
      margin-top: 1px;
    }

    /* Comparison Card */
    .comparison-card {
      margin-bottom: 24px;
    }

    .comparison-date {
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 400;
    }

    .comparison-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .comparison-item {
      padding: 14px;
      background: var(--bg-page);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-default);
    }

    .comparison-label {
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.025em;
      margin-bottom: 8px;
    }

    .comparison-values {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .comparison-old {
      font-size: 14px;
      color: var(--text-muted);
      text-decoration: line-through;
    }

    .comparison-pending {
      font-size: 14px;
      color: var(--text-muted);
    }

    .trend {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
      font-weight: 600;
    }

    .trend--up {
      color: var(--color-danger);
    }

    .trend--down {
      color: var(--color-success);
    }

    .trend--stable {
      color: var(--text-muted);
    }

    /* Form Actions */
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 8px;
    }

    /* Loading */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 24px;
    }

    .loading-text {
      margin-top: 16px;
      font-size: 14px;
      color: var(--text-secondary);
    }

    /* Utility */
    .mb-6 {
      margin-bottom: 24px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }

      .comparison-grid {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column-reverse;
      }

      .form-actions .btn {
        width: 100%;
      }

      .patient-meta {
        flex-wrap: wrap;
      }
    }
  `]
})
export class PriseConstantesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private patientService = inject(PatientService);
  private constanteService = inject(ConstanteService);
  private fileAttenteService = inject(FileAttenteService);
  private seuilAlerteService = inject(SeuilAlerteService);
  private authService = inject(AuthService);

  // Signals
  patient = signal<Patient | null>(null);
  lastConstante = signal<Constante | null>(null);
  seuils = signal<SeuilAlerte[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  // Alert signals
  alerteTemperature = signal(false);
  alertePoids = signal(false);
  alerteTension = signal(false);

  // Computed seuils
  seuilTemperature = computed(() =>
    this.seuils().find(s => s.typeConstante === 'TEMPERATURE') || null
  );
  seuilPoids = computed(() =>
    this.seuils().find(s => s.typeConstante === 'POIDS') || null
  );
  seuilTension = computed(() =>
    this.seuils().find(s => s.typeConstante === 'TENSION_ARTERIELLE') || null
  );

  // Form data
  formData = {
    temperature: null as number | null,
    poids: null as number | null,
    tensionArteriel: '',
    motifVisite: '',
    priorite: 'NORMALE' as 'NORMALE' | 'HAUTE' | 'URGENTE'
  };

  ngOnInit(): void {
    const patientId = Number(this.route.snapshot.paramMap.get('patientId'));
    if (patientId) {
      this.loadPatient(patientId);
      this.loadLastConstante(patientId);
      this.loadSeuils();
    } else {
      this.error.set('Identifiant patient manquant');
    }
  }

  private loadPatient(id: number): void {
    this.patientService.getById(id).subscribe({
      next: (patient) => this.patient.set(patient),
      error: () => {
        this.error.set('Patient non trouve');
        setTimeout(() => this.router.navigate(['/infirmiere/recherche']), 2000);
      }
    });
  }

  private loadLastConstante(patientId: number): void {
    this.constanteService.getByPatient(patientId).subscribe({
      next: (constantes) => {
        if (constantes && constantes.length > 0) {
          // Sort by date descending and take the most recent
          const sorted = constantes.sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          this.lastConstante.set(sorted[0]);
        }
      },
      error: () => {
        // No previous constantes - this is fine
      }
    });
  }

  private loadSeuils(): void {
    this.seuilAlerteService.getAll().subscribe({
      next: (seuils) => this.seuils.set(seuils),
      error: () => {
        // Seuils not available - continue without threshold checks
      }
    });
  }

  checkAlertes(): void {
    // Check temperature
    const seuilTemp = this.seuilTemperature();
    if (seuilTemp && this.formData.temperature !== null) {
      this.alerteTemperature.set(
        this.formData.temperature < seuilTemp.valeurMin ||
        this.formData.temperature > seuilTemp.valeurMax
      );
    } else {
      this.alerteTemperature.set(false);
    }

    // Check poids
    const seuilP = this.seuilPoids();
    if (seuilP && this.formData.poids !== null) {
      this.alertePoids.set(
        this.formData.poids < seuilP.valeurMin ||
        this.formData.poids > seuilP.valeurMax
      );
    } else {
      this.alertePoids.set(false);
    }
  }

  checkAlerteTension(): void {
    const seuilT = this.seuilTension();
    if (seuilT && this.formData.tensionArteriel) {
      const parts = this.formData.tensionArteriel.split('/');
      if (parts.length === 2) {
        const systolique = parseFloat(parts[0]);
        const diastolique = parseFloat(parts[1]);
        if (!isNaN(systolique) && !isNaN(diastolique)) {
          this.alerteTension.set(
            systolique < seuilT.valeurMin ||
            systolique > seuilT.valeurMax ||
            diastolique < 60 ||
            diastolique > 90
          );
          return;
        }
      }
    }
    this.alerteTension.set(false);
  }

  hasAnyAlert(): boolean {
    return this.alerteTemperature() || this.alertePoids() || this.alerteTension();
  }

  isFormValid(): boolean {
    return !!(
      this.formData.temperature !== null &&
      this.formData.poids !== null &&
      this.formData.tensionArteriel &&
      this.formData.tensionArteriel.includes('/')
    );
  }

  onSubmit(): void {
    if (!this.isFormValid() || !this.patient()) return;

    this.loading.set(true);
    this.error.set(null);

    // Auto-escalate priority if alerts detected
    const effectivePriorite = this.hasAnyAlert() ? 'URGENTE' : this.formData.priorite;

    const constanteRequest: ConstanteRequest = {
      temperature: this.formData.temperature!,
      poids: this.formData.poids!,
      tensionArteriel: this.formData.tensionArteriel,
      patientId: this.patient()!.id,
      infirmiereId: Number(this.authService.currentUserNumericId()),
      motifVisite: this.formData.motifVisite || undefined,
      priorite: effectivePriorite
    };

    // Step 1: Create constante
    this.constanteService.create(constanteRequest).subscribe({
      next: (createdConstante) => {
        // Step 2: Add to file d'attente
        const fileAttenteRequest: FileAttenteRequest = {
          patientId: this.patient()!.id,
          motifVisite: this.formData.motifVisite || 'Consultation',
          priorite: effectivePriorite,
          constanteId: createdConstante.id
        };

        this.fileAttenteService.create(fileAttenteRequest).subscribe({
          next: () => {
            this.loading.set(false);
            this.success.set(true);
            // Navigate back after short delay
            setTimeout(() => {
              this.router.navigate(['/infirmiere/file-attente']);
            }, 2000);
          },
          error: (err) => {
            this.loading.set(false);
            this.error.set(
              err.error?.message || 'Constantes enregistrees mais erreur lors de l\'ajout a la file d\'attente'
            );
          }
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Erreur lors de l\'enregistrement des constantes');
      }
    });
  }

  reset(): void {
    this.formData = {
      temperature: null,
      poids: null,
      tensionArteriel: '',
      motifVisite: '',
      priorite: 'NORMALE'
    };
    this.alerteTemperature.set(false);
    this.alertePoids.set(false);
    this.alerteTension.set(false);
    this.error.set(null);
    this.success.set(false);
  }

  goBack(): void {
    this.router.navigate(['/infirmiere/recherche']);
  }

  // Trend helpers
  getTrendArrow(current: number, previous: number): string {
    if (current > previous) return '↑';
    if (current < previous) return '↓';
    return '=';
  }

  getTrendClass(current: number, previous: number): string {
    if (current > previous) return 'trend trend--up';
    if (current < previous) return 'trend trend--down';
    return 'trend trend--stable';
  }

  getTensionTrendArrow(): string {
    const last = this.lastConstante();
    if (!last || !this.formData.tensionArteriel) return '=';

    const currentParts = this.formData.tensionArteriel.split('/');
    const lastParts = last.tensionArteriel.split('/');

    if (currentParts.length === 2 && lastParts.length === 2) {
      const currentSys = parseFloat(currentParts[0]);
      const lastSys = parseFloat(lastParts[0]);
      if (!isNaN(currentSys) && !isNaN(lastSys)) {
        if (currentSys > lastSys) return '↑';
        if (currentSys < lastSys) return '↓';
      }
    }
    return '=';
  }

  getTensionTrendClass(): string {
    const arrow = this.getTensionTrendArrow();
    if (arrow === '↑') return 'trend trend--up';
    if (arrow === '↓') return 'trend trend--down';
    return 'trend trend--stable';
  }

  // Utility
  calculateAge(dateNaissance: Date): number {
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatDateTime(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
