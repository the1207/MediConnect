import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';
import { OrdonnanceService } from '../../../core/services/ordonnance.service';
import { AuthService } from '../../../core/services/auth.service';
import { Patient, Medicament } from '../../../core/models';

interface MedicamentDB {
  nom: string;
  forme: string;
}

const MEDICAMENTS_BASE: MedicamentDB[] = [
  { nom: 'Paracétamol 500mg', forme: 'Comprimé' },
  { nom: 'Paracétamol 1000mg', forme: 'Comprimé' },
  { nom: 'Ibuprofène 200mg', forme: 'Comprimé' },
  { nom: 'Ibuprofène 400mg', forme: 'Comprimé' },
  { nom: 'Amoxicilline 500mg', forme: 'Gélule' },
  { nom: 'Amoxicilline 1g', forme: 'Comprimé' },
  { nom: 'Azithromycine 250mg', forme: 'Comprimé' },
  { nom: 'Métronidazole 500mg', forme: 'Comprimé' },
  { nom: 'Oméprazole 20mg', forme: 'Gélule' },
  { nom: 'Lansoprazole 30mg', forme: 'Gélule' },
  { nom: 'Losartan 50mg', forme: 'Comprimé' },
  { nom: 'Amlodipine 5mg', forme: 'Comprimé' },
  { nom: 'Metformine 500mg', forme: 'Comprimé' },
  { nom: 'Metformine 850mg', forme: 'Comprimé' },
  { nom: 'Atorvastatine 10mg', forme: 'Comprimé' },
  { nom: 'Ciprofloxacine 500mg', forme: 'Comprimé' },
  { nom: 'Diclofénac 50mg', forme: 'Comprimé' },
  { nom: 'Tramadol 50mg', forme: 'Gélule' },
  { nom: 'Prednisolone 20mg', forme: 'Comprimé' },
  { nom: 'Salbutamol 100µg', forme: 'Inhalateur' },
  { nom: 'Cétirizine 10mg', forme: 'Comprimé' },
  { nom: 'Loratadine 10mg', forme: 'Comprimé' },
  { nom: 'Furosémide 40mg', forme: 'Comprimé' },
  { nom: 'Vitamine D3 1000UI', forme: 'Gouttes' },
  { nom: 'Fer (Tardyféron) 80mg', forme: 'Comprimé' },
];

@Component({
  selector: 'app-prescription',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      @if (patient()) {
        <div class="page-header">
          <button class="btn-back" (click)="goBack()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15,18 9,12 15,6"/>
            </svg>
          </button>
          <div>
            <h1>Nouvelle Ordonnance</h1>
            <p>{{ patient()!.prenom }} {{ patient()!.nom }}</p>
          </div>
        </div>

        @if (allergyWarning()) {
          <div class="alert alert-danger">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div>
              <strong>Attention - Allergies connues :</strong>
              <span>{{ patient()!.allergies }}</span>
            </div>
          </div>
        }

        @if (error()) {
          <div class="alert alert-danger">
            <span>{{ error() }}</span>
          </div>
        }

        <div class="prescription-form">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Médicaments</h3>
              <span class="badge badge-primary">{{ medicaments().length }}</span>
            </div>

            <div class="medicaments-list">
              @for (med of medicaments(); track $index; let i = $index) {
                <div class="medicament-row" [class.medicament-row--alert]="isMedAllergyRisk(med)">
                  @if (isMedAllergyRisk(med)) {
                    <div class="med-allergy-warning">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      </svg>
                      Risque allergie détecté
                    </div>
                  }
                  <div class="medicament-fields">
                    <div class="form-group autocomplete-wrapper">
                      <label class="form-label">Médicament</label>
                      <input
                        type="text"
                        class="form-input"
                        [(ngModel)]="med.nom"
                        [ngModelOptions]="{standalone: true}"
                        placeholder="Tapez pour chercher..."
                        (input)="onMedSearch(i, med.nom)"
                        (focus)="onMedFocus(i)"
                        (blur)="onMedBlur(i)"
                      />
                      @if (activeAutocomplete() === i && suggestions().length > 0) {
                        <div class="autocomplete-dropdown">
                          @for (s of suggestions(); track s.nom) {
                            <div class="autocomplete-item" (mousedown)="selectMed(i, s)">
                              <span class="autocomplete-item-name">{{ s.nom }}</span>
                              <span class="autocomplete-item-forme">{{ s.forme }}</span>
                            </div>
                          }
                        </div>
                      }
                    </div>
                    <div class="form-group">
                      <label class="form-label">Posologie</label>
                      <input
                        type="text"
                        class="form-input"
                        [(ngModel)]="med.posologie"
                        [ngModelOptions]="{standalone: true}"
                        placeholder="Ex: 1cp 3x/jour"
                      />
                    </div>
                    <div class="form-group form-group-small">
                      <label class="form-label">Durée (j)</label>
                      <input
                        type="number"
                        class="form-input"
                        [(ngModel)]="med.dureeTraitement"
                        [ngModelOptions]="{standalone: true}"
                        min="1"
                      />
                    </div>
                  </div>
                  <button
                    class="btn-remove"
                    (click)="removeMedicament(i)"

                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                    </svg>
                  </button>
                </div>
              }
            </div>

            <button class="btn btn-secondary btn-md w-full" (click)="addMedicament()">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Ajouter un médicament
            </button>
          </div>

          <div class="card">
            <h3 class="card-title" style="margin-bottom: 12px;">Observations</h3>
            <textarea
              class="form-textarea"
              [(ngModel)]="commentaire"
              placeholder="Observations, recommandations, instructions particulières..."
              rows="4"
            ></textarea>
          </div>

          <div class="form-actions">
            <button class="btn btn-secondary btn-md" (click)="goBack()">Annuler</button>
            <button
              class="btn btn-primary btn-md"
              [disabled]="loading() || !isFormValid()"
              (click)="onSubmit()"
            >
              @if (loading()) {
                <span class="spinner spinner-sm"></span>
                Enregistrement...
              } @else {
                Enregistrer l'ordonnance
              }
            </button>
          </div>
        </div>
      } @else {
        <div class="loading-state">
          <span class="spinner"></span>
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 800px; margin: 0 auto; }

    .page-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
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

    .btn-back:hover { background: var(--bg-page); }

    .page-header h1 {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .page-header p {
      font-size: 14px;
      color: var(--text-secondary);
    }

    .alert { margin-bottom: 16px; }

    .prescription-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .medicaments-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }

    .medicament-row {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: var(--bg-page);
      border-radius: var(--radius-md);
      position: relative;
    }

    .medicament-row--alert {
      background: #FEF2F2;
      border: 1px solid #FECACA;
    }

    .med-allergy-warning {
      position: absolute;
      top: -8px;
      left: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      background: #EF4444;
      color: white;
      font-size: 11px;
      font-weight: 500;
      border-radius: var(--radius-full);
    }

    .medicament-fields {
      flex: 1;
      display: grid;
      grid-template-columns: 2fr 2fr 80px;
      gap: 12px;
    }

    .form-group-small { max-width: 80px; }

    .autocomplete-wrapper { position: relative; }

    .autocomplete-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--bg-card);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-dropdown);
      max-height: 200px;
      overflow-y: auto;
      z-index: 50;
    }

    .autocomplete-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 14px;
      cursor: pointer;
      transition: background var(--transition-fast);
    }

    .autocomplete-item:hover { background: var(--bg-page); }

    .autocomplete-item-name {
      font-size: 14px;
      color: var(--text-primary);
    }

    .autocomplete-item-forme {
      font-size: 12px;
      color: var(--text-muted);
    }

    .btn-remove {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-card);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      cursor: pointer;
      color: var(--text-muted);
      transition: all var(--transition-fast);
      align-self: flex-end;
    }

    .btn-remove:hover:not(:disabled) {
      background: #FEF2F2;
      border-color: #FECACA;
      color: #EF4444;
    }

    .btn-remove:disabled { opacity: 0.3; cursor: not-allowed; }

    .w-full { width: 100%; }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .loading-state {
      display: flex;
      justify-content: center;
      padding: 64px;
    }

    @media (max-width: 768px) {
      .medicament-fields {
        grid-template-columns: 1fr;
      }
      .form-group-small { max-width: none; }
    }
  `]
})
export class PrescriptionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private patientService = inject(PatientService);
  private ordonnanceService = inject(OrdonnanceService);
  private authService = inject(AuthService);

  patient = signal<Patient | null>(null);
  medicaments = signal<Medicament[]>([{ nom: '', posologie: '', dureeTraitement: 7 }]);
  commentaire = '';
  loading = signal(false);
  error = signal<string | null>(null);
  allergyWarning = signal(false);
  suggestions = signal<MedicamentDB[]>([]);
  activeAutocomplete = signal<number>(-1);

  ngOnInit(): void {
    const patientId = Number(this.route.snapshot.paramMap.get('patientId'));
    this.loadPatient(patientId);

    const renewId = this.route.snapshot.queryParamMap.get('renew');
    if (renewId) {
      this.loadRenewal(Number(renewId));
    }
  }

  loadPatient(id: number): void {
    this.patientService.getById(id).subscribe({
      next: (patient) => {
        this.patient.set(patient);
        if (patient.allergies && patient.allergies.trim()) {
          this.allergyWarning.set(true);
        }
      }
    });
  }

  loadRenewal(ordonnanceId: number): void {
    this.ordonnanceService.getById(ordonnanceId).subscribe({
      next: (ord) => {
        this.medicaments.set(ord.medicaments.map(m => ({
          nom: m.nom,
          posologie: m.posologie,
          dureeTraitement: m.dureeTraitement
        })));
        this.commentaire = ord.commentaire || '';
      }
    });
  }

  addMedicament(): void {
    this.medicaments.update(meds => [...meds, { nom: '', posologie: '', dureeTraitement: 7 }]);
  }

  removeMedicament(index: number): void {

    this.medicaments.update(meds => meds.filter((_, i) => i !== index));

  }

  onMedSearch(index: number, query: string): void {
    if (query.length < 2) {
      this.suggestions.set([]);
      return;
    }
    const lower = query.toLowerCase();
    this.suggestions.set(
      MEDICAMENTS_BASE.filter(m => m.nom.toLowerCase().includes(lower)).slice(0, 8)
    );
  }

  onMedFocus(index: number): void {
    this.activeAutocomplete.set(index);
  }

  onMedBlur(index: number): void {
    setTimeout(() => {
      if (this.activeAutocomplete() === index) {
        this.activeAutocomplete.set(-1);
        this.suggestions.set([]);
      }
    }, 200);
  }

  selectMed(index: number, med: MedicamentDB): void {
    this.medicaments.update(meds => {
      const updated = [...meds];
      updated[index] = { ...updated[index], nom: med.nom };
      return updated;
    });
    this.suggestions.set([]);
    this.activeAutocomplete.set(-1);
  }

  isMedAllergyRisk(med: Medicament): boolean {
    if (!this.patient()?.allergies || !med.nom) return false;
    const allergies = this.patient()!.allergies!.toLowerCase();
    const medName = med.nom.toLowerCase();
    const allergyList = allergies.split(/[,;]/);
    return allergyList.some(a => {
      const trimmed = a.trim();
      return trimmed && medName.includes(trimmed);
    });
  }

  isFormValid(): boolean {
    return this.medicaments().every(med =>
      med.nom?.trim() || (med.posologie?.trim() && med.dureeTraitement > 0)
    );
  }

  onSubmit(): void {
    if (!this.patient()) return;
    const medicamentsValides = this.medicaments().filter(med => med.nom?.trim() && med.posologie?.trim()
    );

    this.loading.set(true);
    this.error.set(null);

    const request = {
      patientId: this.patient()!.id,
      medecinId: Number(this.authService.currentMedecinId()),
      commentaire: this.commentaire,
      medicaments: this.medicaments()
    };

    this.ordonnanceService.create(request).subscribe({
      next: (ordonnance) => {
        this.loading.set(false);
        this.router.navigate(['/medecin/ordonnance', ordonnance.id]);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Erreur lors de la création');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/medecin/consultation', this.patient()!.id]);
  }
}
