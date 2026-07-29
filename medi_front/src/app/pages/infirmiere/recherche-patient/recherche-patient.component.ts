import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';
import { Patient } from '../../../core/models';

@Component({
  selector: 'app-recherche-patient',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">Recherche Patient</h1>
          <p class="page-subtitle">Recherchez un patient par nom ou prenom pour acceder a ses constantes vitales</p>
        </div>
        <div class="header-right">
          <a routerLink="/infirmiere/nouveau-patient" class="btn-nouveau">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="16" y1="11" x2="22" y2="11"/>
            </svg>
            Nouveau patient
          </a>
        </div>
      </div>

      <!-- Search Section -->
      <div class="search-section">
        <div class="search-wrapper">
          <div class="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <input
            type="text"
            class="search-input"
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
            placeholder="Rechercher par nom ou prenom..."
            autofocus
          />
          @if (loading()) {
            <div class="search-spinner">
              <span class="spinner"></span>
            </div>
          }
          @if (searchQuery && !loading()) {
            <button class="search-clear" (click)="clearSearch()">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          }
        </div>
      </div>

      <!-- Results Count -->
      @if (patients().length > 0) {
        <div class="results-meta">
          <span class="results-count">{{ patients().length }} patient{{ patients().length > 1 ? 's' : '' }} trouve{{ patients().length > 1 ? 's' : '' }}</span>
        </div>
      }

      <!-- Patient Cards Grid -->
      @if (patients().length > 0) {
        <div class="patients-grid">
          @for (patient of patients(); track patient.id) {
            <div class="patient-card" (click)="selectPatient(patient)">
              <div class="card-top">
                <div class="patient-avatar" [class.avatar-male]="patient.sexe === 'M'" [class.avatar-female]="patient.sexe !== 'M'">
                  <svg *ngIf="patient.sexe === 'M'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="7" r="4"/>
                    <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2"/>
                  </svg>
                  <svg *ngIf="patient.sexe !== 'M'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="7" r="4"/>
                    <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2"/>
                  </svg>
                </div>
                <div class="patient-identity">
                  <h3 class="patient-name">{{ patient.prenom }} {{ patient.nom }}</h3>
                  <span class="patient-age">{{ calculateAge(patient.dateNaissance) }} ans - {{ patient.sexe === 'M' ? 'Homme' : 'Femme' }}</span>
                </div>
                <div class="card-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9,18 15,12 9,6"/>
                  </svg>
                </div>
              </div>

              <div class="card-details">
                <!-- Date de naissance -->
                <div class="detail-row">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span>{{ formatDate(patient.dateNaissance) }}</span>
                </div>

                <!-- Contact -->
                <div class="detail-row">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <span>{{ patient.contact }}</span>
                </div>

                <!-- Groupe sanguin -->
                @if (patient.groupeSanguin) {
                  <div class="detail-row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                    </svg>
                    <span class="badge-sanguin">{{ patient.groupeSanguin }}</span>
                  </div>
                }

                <!-- Allergies -->
                @if (patient.allergies) {
                  <div class="detail-row allergies-row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    <span class="allergies-text">{{ truncateAllergies(patient.allergies) }}</span>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }

      <!-- Empty State: no results found -->
      @if (searchQuery && patients().length === 0 && !loading()) {
        <div class="empty-state-card">
          <div class="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
          <h3 class="empty-title">Aucun patient trouve</h3>
          <p class="empty-text">Aucun resultat pour "<strong>{{ searchQuery }}</strong>". Verifiez l'orthographe ou creez un nouveau patient.</p>
          <a routerLink="/infirmiere/nouveau-patient" class="btn-nouveau">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="16" y1="11" x2="22" y2="11"/>
            </svg>
            Creer un nouveau patient
          </a>
        </div>
      }

      <!-- Empty State: initial -->
      @if (!searchQuery && patients().length === 0 && !loading()) {
        <div class="empty-state-card">
          <div class="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <h3 class="empty-title">Rechercher un patient</h3>
          <p class="empty-text">Commencez a taper le nom ou le prenom d'un patient pour afficher les resultats.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container {
      padding: 1.5rem;
      background: var(--bg-page);
      min-height: 100%;
    }

    /* ===== Page Header ===== */
    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.75rem;
    }

    .header-left {
      flex: 1;
    }

    .page-title {
      font-size: 1.625rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.375rem 0;
      line-height: 1.3;
    }

    .page-subtitle {
      font-size: 0.9375rem;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.5;
    }

    .header-right {
      flex-shrink: 0;
    }

    .btn-nouveau {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      background: var(--color-primary);
      color: #ffffff;
      border: none;
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      transition: var(--transition-fast);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .btn-nouveau:hover {
      opacity: 0.9;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    /* ===== Search Section ===== */
    .search-section {
      margin-bottom: 1.5rem;
    }

    .search-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      background: var(--bg-card);
      border: 1.5px solid var(--border-default);
      border-radius: var(--radius-lg);
      padding: 0;
      box-shadow: var(--shadow-card);
      transition: var(--transition-fast);
    }

    .search-wrapper:focus-within {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb, 59, 130, 246), 0.1);
    }

    .search-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-left: 1.25rem;
      color: var(--text-muted);
    }

    .search-input {
      flex: 1;
      border: none;
      background: transparent;
      font-size: 1.0625rem;
      color: var(--text-primary);
      padding: 1rem 1rem 1rem 0.75rem;
      outline: none;
      line-height: 1.5;
    }

    .search-input::placeholder {
      color: var(--text-muted);
    }

    .search-spinner {
      display: flex;
      align-items: center;
      padding-right: 1rem;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2.5px solid var(--border-default);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .search-clear {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      margin-right: 0.75rem;
      border: none;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
      border-radius: var(--radius-md);
      transition: var(--transition-fast);
    }

    .search-clear:hover {
      color: var(--text-primary);
      background: var(--bg-page);
    }

    /* ===== Results Meta ===== */
    .results-meta {
      margin-bottom: 1rem;
    }

    .results-count {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    /* ===== Patient Cards Grid ===== */
    .patients-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    @media (max-width: 768px) {
      .patients-grid {
        grid-template-columns: 1fr;
      }

      .page-header {
        flex-direction: column;
      }
    }

    .patient-card {
      background: var(--bg-card);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-lg);
      padding: 1.25rem;
      cursor: pointer;
      transition: var(--transition-fast);
      box-shadow: var(--shadow-card);
    }

    .patient-card:hover {
      border-color: var(--color-primary);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .card-top {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-default);
    }

    .patient-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .avatar-male {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    .avatar-female {
      background: rgba(236, 72, 153, 0.1);
      color: #ec4899;
    }

    .patient-identity {
      flex: 1;
      min-width: 0;
    }

    .patient-name {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.125rem 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .patient-age {
      font-size: 0.8125rem;
      color: var(--text-secondary);
    }

    .card-arrow {
      color: var(--text-muted);
      flex-shrink: 0;
      transition: var(--transition-fast);
    }

    .patient-card:hover .card-arrow {
      color: var(--color-primary);
      transform: translateX(2px);
    }

    /* ===== Card Details ===== */
    .card-details {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
    }

    .detail-row {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      font-size: 0.8125rem;
      color: var(--text-secondary);
    }

    .detail-row svg {
      color: var(--text-muted);
      flex-shrink: 0;
    }

    .badge-sanguin {
      display: inline-flex;
      align-items: center;
      padding: 0.125rem 0.5rem;
      background: rgba(239, 68, 68, 0.08);
      color: #dc2626;
      border-radius: var(--radius-md);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .allergies-row {
      color: #d97706;
    }

    .allergies-row svg {
      color: #d97706;
    }

    .allergies-text {
      font-size: 0.8125rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ===== Empty State ===== */
    .empty-state-card {
      background: var(--bg-card);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-card);
      text-align: center;
      padding: 4rem 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .empty-icon {
      color: var(--text-muted);
      margin-bottom: 1.25rem;
      opacity: 0.6;
    }

    .empty-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.5rem 0;
    }

    .empty-text {
      font-size: 0.9375rem;
      color: var(--text-secondary);
      margin: 0 0 1.5rem 0;
      max-width: 360px;
      line-height: 1.6;
    }

    .empty-text strong {
      color: var(--text-primary);
    }
  `]
})
export class RecherchePatientComponent implements OnInit, OnDestroy {
  private patientService = inject(PatientService);
  private router = inject(Router);

  searchQuery = '';
  patients = signal<Patient[]>([]);
  loading = signal(false);
  private searchTimeout: any = null;

  ngOnInit(): void {
    this.loadAllPatients();
  }

  ngOnDestroy(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  onSearch(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    const query = this.searchQuery.trim();

    if (!query) {
      this.loadAllPatients();
      return;
    }

    this.loading.set(true);

    this.searchTimeout = setTimeout(() => {
      this.patientService.search(query).subscribe({
        next: (results) => {
          this.patients.set(results);
          this.loading.set(false);
        },
        error: () => {
          this.patients.set([]);
          this.loading.set(false);
        }
      });
    }, 400);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.loadAllPatients();
  }

  selectPatient(patient: Patient): void {
    this.router.navigate(['/infirmiere/constantes', patient.id]);
  }

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

  formatDate(dateNaissance: Date): string {
    const date = new Date(dateNaissance);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  truncateAllergies(allergies: string): string {
    if (allergies.length > 40) {
      return allergies.substring(0, 40) + '...';
    }
    return allergies;
  }

  private loadAllPatients(): void {
    this.loading.set(true);
    this.patientService.getAll().subscribe({
      next: (patients) => {
        this.patients.set(patients);
        this.loading.set(false);
      },
      error: () => {
        this.patients.set([]);
        this.loading.set(false);
      }
    });
  }
}
