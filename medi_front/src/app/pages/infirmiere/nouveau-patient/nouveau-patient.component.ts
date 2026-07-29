import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';
import { PatientRequest } from '../../../core/models/patient.model';

@Component({
  selector: 'app-nouveau-patient',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">
      <!-- Page Header -->
      <div class="page-header">
        <button class="btn-back" (click)="goBack()">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
        </button>
        <div>
          <h1 class="page-title">Nouveau Patient</h1>
          <p class="page-subtitle">Enregistrer un nouveau patient dans le systeme</p>
        </div>
      </div>

      <!-- Success Alert -->
      @if (success()) {
        <div class="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>
          </svg>
          <span>Patient cree avec succes ! Redirection vers la prise de constantes...</span>
        </div>
      }

      <!-- Error Alert -->
      @if (error()) {
        <div class="alert alert-danger">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ error() }}</span>
        </div>
      }

      <!-- Form Card -->
      <div class="card">
        <form (ngSubmit)="onSubmit()">
          <!-- Section: Informations personnelles -->
          <div class="section">
            <div class="section-header">
              <div class="section-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h3 class="section-title">Informations personnelles</h3>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label" for="nom">Nom <span class="required">*</span></label>
                <input
                  type="text"
                  id="nom"
                  class="form-input"
                  [(ngModel)]="patient.nom"
                  name="nom"
                  placeholder="Entrez le nom"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="prenom">Prenom <span class="required">*</span></label>
                <input
                  type="text"
                  id="prenom"
                  class="form-input"
                  [(ngModel)]="patient.prenom"
                  name="prenom"
                  placeholder="Entrez le prenom"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="dateNaissance">Date de naissance <span class="required">*</span></label>
                <input
                  type="date"
                  id="dateNaissance"
                  class="form-input"
                  [(ngModel)]="patient.dateNaissance"
                  name="dateNaissance"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="sexe">Sexe <span class="required">*</span></label>
                <select
                  id="sexe"
                  class="form-select"
                  [(ngModel)]="patient.sexe"
                  name="sexe"
                  required
                >
                  <option value="M">Masculin</option>
                  <option value="F">Feminin</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="contact">Contact <span class="required">*</span></label>
                <input
                  type="tel"
                  id="contact"
                  class="form-input"
                  [(ngModel)]="patient.contact"
                  name="contact"
                  placeholder="+229 XX XX XX XX"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="groupeSanguin">Groupe sanguin</label>
                <select
                  id="groupeSanguin"
                  class="form-select"
                  [(ngModel)]="patient.groupeSanguin"
                  name="groupeSanguin"
                >
                  <option value="">-- Selectionner --</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Section: Informations medicales -->
          <div class="section">
            <div class="section-header">
              <div class="section-icon section-icon--info">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <h3 class="section-title">Informations medicales</h3>
            </div>

            <div class="form-grid form-grid--full">
              <div class="form-group">
                <label class="form-label" for="allergies">Allergies</label>
                <textarea
                  id="allergies"
                  class="form-textarea"
                  [(ngModel)]="patient.allergies"
                  name="allergies"
                  placeholder="Ex: Penicilline, Aspirine..."
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label" for="antecedents">Antecedents</label>
                <textarea
                  id="antecedents"
                  class="form-textarea"
                  [(ngModel)]="patient.antecedents"
                  name="antecedents"
                  placeholder="Ex: Diabete, Hypertension..."
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button type="button" class="btn btn-secondary btn-md" (click)="goBack()">
              Annuler
            </button>
            <button
              type="submit"
              class="btn btn-primary btn-md"
              [disabled]="loading() || !isFormValid()"
            >
              @if (loading()) {
                <span class="spinner spinner-sm"></span>
                Enregistrement...
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/>
                </svg>
                Enregistrer le patient
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-wrapper {
      max-width: 720px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .btn-back {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-card);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      cursor: pointer;
      color: var(--text-secondary);
      transition: all var(--transition-fast);
    }

    .btn-back:hover {
      background: var(--bg-page);
      color: var(--text-primary);
      border-color: var(--color-primary);
    }

    .page-title {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    .page-subtitle {
      font-size: 14px;
      color: var(--text-secondary);
    }

    .alert {
      margin-bottom: 20px;
    }

    .section {
      margin-bottom: 32px;
    }

    .section:last-of-type {
      margin-bottom: 24px;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border-default);
    }

    .section-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(60, 80, 224, 0.1);
      color: var(--color-primary);
    }

    .section-icon--info {
      background: var(--color-success-light);
      color: var(--color-success);
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .form-grid--full .form-group {
      grid-column: 1 / -1;
    }

    .required {
      color: var(--color-danger);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 24px;
      border-top: 1px solid var(--border-default);
    }

    @media (max-width: 640px) {
      .form-grid {
        grid-template-columns: 1fr;
      }

      .page-title {
        font-size: 20px;
      }

      .form-actions {
        flex-direction: column-reverse;
      }

      .form-actions .btn {
        width: 100%;
      }
    }
  `]
})
export class NouveauPatientComponent {
  private patientService = inject(PatientService);
  private router = inject(Router);

  patient: PatientRequest = {
    nom: '',
    prenom: '',
    dateNaissance: '',
    sexe: 'M',
    contact: '',
    allergies: '',
    antecedents: '',
    groupeSanguin: ''
  };

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  isFormValid(): boolean {
    return !!(
      this.patient.nom.trim() &&
      this.patient.prenom.trim() &&
      this.patient.dateNaissance &&
      this.patient.sexe &&
      this.patient.contact.trim()
    );
  }

  onSubmit(): void {
    if (!this.isFormValid()) return;

    this.loading.set(true);
    this.error.set(null);

    this.patientService.create(this.patient).subscribe({
      next: (createdPatient) => {
        this.success.set(true);
        this.loading.set(false);
        setTimeout(() => {
          this.router.navigate(['/infirmiere/constantes', createdPatient.id]);
        }, 1500);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Erreur lors de la creation du patient');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/infirmiere/recherche']);
  }
}
