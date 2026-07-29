import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';
import { Patient } from '../../../core/models';

@Component({
  selector: 'app-liste-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">Patients</h1>
          <p class="page-subtitle">Liste des patients enregistr&eacute;s</p>
        </div>
        <div class="header-right">
          <div class="search-box">
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (input)="filterPatients()"
              placeholder="Rechercher par nom..."
              class="search-input"
            />
          </div>
        </div>
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Chargement des patients...</p>
        </div>
      }

      <!-- Empty State -->
      @else if (filteredPatients().length === 0) {
        <div class="empty-state">
          <div class="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
          </div>
          <h3>Aucun patient trouv&eacute;</h3>
          <p>Aucun patient ne correspond &agrave; votre recherche.</p>
        </div>
      }

      <!-- Patient Cards Grid -->
      @else {
        <div class="patients-grid">
          @for (patient of filteredPatients(); track patient.id) {
            <div class="patient-card" (click)="navigateToConsultation(patient)">
              <div class="card-body">
                <!-- Avatar + Name -->
                <div class="card-top">
                  <div class="avatar" [style.background-color]="getAvatarColor(patient.nom + patient.prenom)">
                    {{ getInitials(patient) }}
                  </div>
                  <div class="patient-identity">
                    <h3 class="patient-name">{{ patient.prenom }} {{ patient.nom }}</h3>
                    <div class="patient-meta">
                      <span class="age-text">{{ calculateAge(patient.dateNaissance) }} ans</span>
                      <span class="sex-badge" [class.sex-male]="patient.sexe === 'M'" [class.sex-female]="patient.sexe === 'F'">
                        {{ patient.sexe === 'M' ? 'H' : 'F' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Details -->
                <div class="card-details">
                  @if (patient.contact) {
                    <div class="detail-row">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      <span class="detail-text">{{ patient.contact }}</span>
                    </div>
                  }

                  @if (patient.groupeSanguin) {
                    <div class="detail-row">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                      </svg>
                      <span class="groupe-badge">{{ patient.groupeSanguin }}</span>
                    </div>
                  }

                  @if (patient.allergies) {
                    <div class="detail-row allergies-row">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                      <span class="allergies-text">{{ patient.allergies.length > 30 ? patient.allergies.substring(0, 30) + '...' : patient.allergies }}</span>
                    </div>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page-wrapper {
      max-width: 1280px;
      margin: 0 auto;
    }

    /* Page Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .page-title {
      font-size: 1.625rem;
      font-weight: 700;
      color: var(--gray-900);
      margin: 0 0 0.25rem 0;
    }

    .page-subtitle {
      font-size: 0.9375rem;
      color: var(--gray-500);
      margin: 0;
    }

    /* Search Box */
    .search-box {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      background: var(--white, #ffffff);
      border: 1px solid var(--gray-200);
      border-radius: 0.5rem;
      padding: 0.625rem 1rem;
      width: 300px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .search-box:focus-within {
      border-color: var(--primary-color, #3b82f6);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .search-icon {
      color: var(--gray-400);
      flex-shrink: 0;
    }

    .search-input {
      border: none;
      outline: none;
      flex: 1;
      font-size: 0.875rem;
      color: var(--gray-700);
      background: transparent;
    }

    .search-input::placeholder {
      color: var(--gray-400);
    }

    /* Loading State */
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 5rem 2rem;
      color: var(--gray-500);
      gap: 1rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--gray-200);
      border-top-color: var(--primary-color, #3b82f6);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 5rem 2rem;
      background: var(--white, #ffffff);
      border: 1px solid var(--gray-200);
      border-radius: 0.75rem;
      text-align: center;
    }

    .empty-icon {
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--gray-100);
      border-radius: 50%;
      margin-bottom: 1.5rem;
      color: var(--gray-400);
    }

    .empty-state h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 0.5rem 0;
    }

    .empty-state p {
      color: var(--gray-500);
      font-size: 0.875rem;
      margin: 0;
    }

    /* Patient Grid */
    .patients-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
    }

    @media (max-width: 1024px) {
      .patients-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .patients-grid {
        grid-template-columns: 1fr;
      }

      .search-box {
        width: 100%;
      }

      .page-header {
        flex-direction: column;
      }
    }

    /* Patient Card */
    .patient-card {
      background: var(--white, #ffffff);
      border: 1px solid var(--gray-200);
      border-radius: 0.75rem;
      cursor: pointer;
      transition: box-shadow 0.2s ease, transform 0.2s ease;
    }

    .patient-card:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .card-body {
      padding: 1.25rem;
    }

    /* Card Top Section */
    .card-top {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      margin-bottom: 1rem;
    }

    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
      color: #ffffff;
      flex-shrink: 0;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .patient-identity {
      flex: 1;
      min-width: 0;
    }

    .patient-name {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 0.25rem 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .patient-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .age-text {
      font-size: 0.8125rem;
      color: var(--gray-500);
    }

    .sex-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 4px;
      font-size: 0.6875rem;
      font-weight: 700;
    }

    .sex-male {
      background: var(--blue-100, #dbeafe);
      color: var(--blue-700, #1d4ed8);
    }

    .sex-female {
      background: var(--pink-100, #fce7f3);
      color: var(--pink-700, #be185d);
    }

    /* Card Details */
    .card-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--gray-100);
    }

    .detail-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--gray-600);
    }

    .detail-row svg {
      color: var(--gray-400);
      flex-shrink: 0;
    }

    .detail-text {
      font-size: 0.8125rem;
      color: var(--gray-600);
    }

    .groupe-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.125rem 0.5rem;
      background: var(--blue-50, #eff6ff);
      color: var(--blue-700, #1d4ed8);
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .allergies-row svg {
      color: var(--red-500, #ef4444);
    }

    .allergies-text {
      font-size: 0.8125rem;
      color: var(--red-600, #dc2626);
      font-weight: 500;
    }
  `]
})
export class ListePatientsComponent implements OnInit {
  private patientService = inject(PatientService);
  private router = inject(Router);

  patients = signal<Patient[]>([]);
  filteredPatients = signal<Patient[]>([]);
  loading = signal(true);
  searchQuery = '';

  private avatarColors = [
    '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981',
    '#f59e0b', '#ef4444', '#ec4899', '#6366f1',
    '#14b8a6', '#f97316'
  ];

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getAll().subscribe({
      next: (patients) => {
        this.patients.set(patients);
        this.filteredPatients.set(patients);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  filterPatients(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredPatients.set(this.patients());
      return;
    }
    this.filteredPatients.set(
      this.patients().filter(p =>
        p.nom.toLowerCase().includes(query) ||
        p.prenom.toLowerCase().includes(query)
      )
    );
  }

  navigateToConsultation(patient: Patient): void {
    this.router.navigate(['/medecin/consultation', patient.id]);
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

  getInitials(patient: Patient): string {
    return (patient.prenom[0] + patient.nom[0]).toUpperCase();
  }

  getAvatarColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % this.avatarColors.length;
    return this.avatarColors[index];
  }
}
