import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';
import { ConstanteService } from '../../../core/services/constante.service';
import { OrdonnanceService } from '../../../core/services/ordonnance.service';
import { Patient, Constante, Ordonnance } from '../../../core/models';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="historique-page">
      @if (patient()) {
        <!-- Page Header -->
        <div class="page-header">
          <button class="btn-back" (click)="goBack()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5"/>
              <polyline points="12,19 5,12 12,5"/>
            </svg>
          </button>
          <div class="header-content">
            <h1 class="page-title">Historique Clinique</h1>
            <p class="page-subtitle">{{ patient()!.prenom }} {{ patient()!.nom }}</p>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="tab-nav">
          <button
            class="tab-btn"
            [class.tab-active]="activeTab() === 'constantes'"
            (click)="activeTab.set('constantes')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
            Constantes
          </button>
          <button
            class="tab-btn"
            [class.tab-active]="activeTab() === 'ordonnances'"
            (click)="activeTab.set('ordonnances')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            Ordonnances
          </button>
        </div>

        <!-- Constantes Tab -->
        @if (activeTab() === 'constantes') {
          <div class="panel">
            <div class="panel-header">
              <h2 class="panel-title">Releves des constantes</h2>
              <span class="panel-count">{{ constantes().length }} enregistrement(s)</span>
            </div>
            <div class="panel-body">
              @if (constantes().length === 0) {
                <div class="empty-state">
                  <div class="empty-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                  </div>
                  <h3 class="empty-title">Aucune constante enregistree</h3>
                  <p class="empty-text">Aucune constante n'a ete enregistree pour ce patient.</p>
                </div>
              } @else {
                <div class="table-wrapper">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Temperature</th>
                        <th>Poids</th>
                        <th>Tension</th>
                        <th>Alerte</th>
                        <th>Motif</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (constante of constantes(); track constante.id) {
                        <tr>
                          <td class="cell-date">{{ formatDate(constante.date) }}</td>
                          <td [class.cell-alert]="constante.alerteTemperature">
                            {{ constante.temperature }}&#176;C
                          </td>
                          <td [class.cell-alert]="constante.alertePoids">
                            {{ constante.poids }} kg
                          </td>
                          <td [class.cell-alert]="constante.alerteTension">
                            {{ constante.tensionArteriel }}
                          </td>
                          <td>
                            @if (constante.alerte) {
                              <span class="badge badge-danger">Alerte</span>
                            } @else {
                              <span class="badge badge-success">Normal</span>
                            }
                          </td>
                          <td class="cell-motif">{{ constante.motifVisite || '-' }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }
            </div>
          </div>
        }

        <!-- Ordonnances Tab -->
        @if (activeTab() === 'ordonnances') {
          <div class="panel">
            <div class="panel-header">
              <h2 class="panel-title">Ordonnances</h2>
              <span class="panel-count">{{ ordonnances().length }} ordonnance(s)</span>
            </div>
            <div class="panel-body">
              @if (ordonnances().length === 0) {
                <div class="empty-state">
                  <div class="empty-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                    </svg>
                  </div>
                  <h3 class="empty-title">Aucune ordonnance</h3>
                  <p class="empty-text">Aucune ordonnance n'a ete redigee pour ce patient.</p>
                </div>
              } @else {
                <div class="ordonnances-grid">
                  @for (ordonnance of ordonnances(); track ordonnance.id) {
                    <div class="ordonnance-card" (click)="voirOrdonnance(ordonnance)">
                      <div class="ord-card-top">
                        <div class="ord-date-group">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          <span class="ord-date">{{ formatDate(ordonnance.dateCreation) }}</span>
                        </div>
                        <span class="badge" [ngClass]="{
                          'badge-warning': ordonnance.statut === 'REDIGEE',
                          'badge-info': ordonnance.statut === 'VALIDEE',
                          'badge-success': ordonnance.statut === 'IMPRIMEE'
                        }">
                          {{ ordonnance.statut }}
                        </span>
                      </div>

                      <div class="ord-card-body">
                        <div class="ord-medicaments-count">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10.5 1.5H8A6.5 6.5 0 0 0 8 14.5h1.5"/>
                            <path d="M13.5 1.5H16A6.5 6.5 0 0 1 16 14.5h-1.5"/>
                            <line x1="8" y1="8" x2="16" y2="8"/>
                          </svg>
                          <span>{{ ordonnance.medicaments.length }} medicament(s)</span>
                        </div>

                        @if (ordonnance.commentaire) {
                          <p class="ord-comment">{{ ordonnance.commentaire.length > 80 ? ordonnance.commentaire.substring(0, 80) + '...' : ordonnance.commentaire }}</p>
                        }
                      </div>

                      <div class="ord-card-footer">
                        <button class="btn btn-outline" (click)="voirOrdonnance(ordonnance); $event.stopPropagation()">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          Voir
                        </button>
                        <button class="btn btn-primary" (click)="renouvelerOrdonnance(ordonnance); $event.stopPropagation()">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="23,4 23,10 17,10"/>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                          </svg>
                          Renouveler
                        </button>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        }
      } @else {
        <!-- Loading State -->
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Chargement de l'historique...</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .historique-page {
      max-width: 1100px;
      margin: 0 auto;
      padding: 1.5rem;
    }

    /* Page Header */
    .page-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .btn-back {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: 10px;
      border: 1px solid var(--gray-200, #e5e7eb);
      background: var(--white, #ffffff);
      color: var(--gray-600, #4b5563);
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .btn-back:hover {
      background: var(--gray-50, #f9fafb);
      border-color: var(--gray-300, #d1d5db);
      color: var(--gray-900, #111827);
    }

    .header-content {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .page-title {
      font-size: 1.625rem;
      font-weight: 700;
      color: var(--gray-900, #1f2937);
      line-height: 1.2;
    }

    .page-subtitle {
      font-size: 0.9375rem;
      color: var(--gray-500, #6b7280);
      font-weight: 400;
    }

    /* Tab Navigation */
    .tab-nav {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      background: var(--gray-100, #f3f4f6);
      padding: 0.375rem;
      border-radius: 10px;
      width: fit-content;
    }

    .tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--gray-600, #4b5563);
      background: transparent;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .tab-btn:hover {
      color: var(--gray-900, #1f2937);
    }

    .tab-btn.tab-active {
      background: var(--white, #ffffff);
      color: var(--primary-600, #3c50e0);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);
      font-weight: 600;
    }

    /* Panel */
    .panel {
      background: var(--white, #ffffff);
      border: 1px solid var(--gray-200, #e5e7eb);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--gray-200, #e5e7eb);
    }

    .panel-title {
      font-size: 1.0625rem;
      font-weight: 600;
      color: var(--gray-900, #1f2937);
    }

    .panel-count {
      font-size: 0.8125rem;
      color: var(--gray-500, #6b7280);
      background: var(--gray-100, #f3f4f6);
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-weight: 500;
    }

    .panel-body {
      padding: 0;
    }

    /* Data Table */
    .table-wrapper {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table thead th {
      padding: 0.875rem 1.25rem;
      text-align: left;
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--gray-600, #4b5563);
      text-transform: uppercase;
      letter-spacing: 0.025em;
      background: var(--gray-50, #f9fafb);
      border-bottom: 1px solid var(--gray-200, #e5e7eb);
      white-space: nowrap;
    }

    .data-table tbody tr {
      border-bottom: 1px solid var(--gray-100, #f3f4f6);
      transition: background 0.15s ease;
    }

    .data-table tbody tr:last-child {
      border-bottom: none;
    }

    .data-table tbody tr:hover {
      background: var(--gray-50, #f9fafb);
    }

    .data-table tbody td {
      padding: 0.875rem 1.25rem;
      font-size: 0.875rem;
      color: var(--gray-700, #374151);
      vertical-align: middle;
    }

    .cell-date {
      font-weight: 500;
      color: var(--gray-900, #1f2937);
      white-space: nowrap;
    }

    .cell-alert {
      color: var(--red-600, #dc2626) !important;
      font-weight: 700;
      background: var(--red-50, #fef2f2);
      border-radius: 4px;
      padding: 0.25rem 0.5rem;
    }

    .cell-motif {
      max-width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Badges */
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.625rem;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 6px;
      white-space: nowrap;
    }

    .badge-success {
      color: var(--green-700, #15803d);
      background: var(--green-100, #dcfce7);
    }

    .badge-danger {
      color: var(--red-700, #b91c1c);
      background: var(--red-100, #fee2e2);
    }

    .badge-warning {
      color: var(--yellow-800, #854d0e);
      background: var(--yellow-100, #fef9c3);
    }

    .badge-info {
      color: var(--blue-700, #1d4ed8);
      background: var(--blue-100, #dbeafe);
    }

    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
    }

    .empty-icon {
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--gray-100, #f3f4f6);
      color: var(--gray-400, #9ca3af);
      margin-bottom: 1.25rem;
    }

    .empty-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--gray-900, #1f2937);
      margin-bottom: 0.5rem;
    }

    .empty-text {
      font-size: 0.875rem;
      color: var(--gray-500, #6b7280);
      max-width: 320px;
    }

    /* Ordonnances Grid */
    .ordonnances-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1rem;
      padding: 1.5rem;
    }

    .ordonnance-card {
      background: var(--white, #ffffff);
      border: 1px solid var(--gray-200, #e5e7eb);
      border-radius: 10px;
      padding: 1.25rem;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
    }

    .ordonnance-card:hover {
      border-color: var(--primary-300, #93a4f4);
      box-shadow: 0 4px 12px rgba(60, 80, 224, 0.08);
      transform: translateY(-1px);
    }

    .ord-card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .ord-date-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--gray-600, #4b5563);
    }

    .ord-date {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--gray-900, #1f2937);
    }

    .ord-card-body {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .ord-medicaments-count {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: var(--gray-600, #4b5563);
      padding: 0.375rem 0.625rem;
      background: var(--gray-50, #f9fafb);
      border-radius: 6px;
      width: fit-content;
    }

    .ord-comment {
      font-size: 0.8125rem;
      color: var(--gray-500, #6b7280);
      font-style: italic;
      line-height: 1.5;
      padding: 0.5rem 0.75rem;
      background: var(--blue-50, #eff6ff);
      border-radius: 6px;
      border-left: 3px solid var(--blue-300, #93c5fd);
    }

    .ord-card-footer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--gray-100, #f3f4f6);
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 0.875rem;
      font-size: 0.8125rem;
      font-weight: 500;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .btn-outline {
      background: var(--white, #ffffff);
      color: var(--gray-700, #374151);
      border: 1px solid var(--gray-300, #d1d5db);
    }

    .btn-outline:hover {
      background: var(--gray-50, #f9fafb);
      border-color: var(--gray-400, #9ca3af);
    }

    .btn-primary {
      background: var(--primary-600, #3c50e0);
      color: var(--white, #ffffff);
    }

    .btn-primary:hover {
      background: var(--primary-700, #2f40b3);
    }

    /* Loading State */
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 6rem 2rem;
      gap: 1rem;
    }

    .loading-state p {
      font-size: 0.875rem;
      color: var(--gray-500, #6b7280);
    }

    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid var(--gray-200, #e5e7eb);
      border-top-color: var(--primary-600, #3c50e0);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .historique-page {
        padding: 1rem;
      }

      .page-title {
        font-size: 1.375rem;
      }

      .tab-nav {
        width: 100%;
      }

      .tab-btn {
        flex: 1;
        justify-content: center;
        padding: 0.5rem 0.75rem;
      }

      .ordonnances-grid {
        grid-template-columns: 1fr;
        padding: 1rem;
      }

      .data-table thead th,
      .data-table tbody td {
        padding: 0.75rem 0.875rem;
      }
    }
  `]
})
export class HistoriqueComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private patientService = inject(PatientService);
  private constanteService = inject(ConstanteService);
  private ordonnanceService = inject(OrdonnanceService);

  patient = signal<Patient | null>(null);
  constantes = signal<Constante[]>([]);
  ordonnances = signal<Ordonnance[]>([]);
  activeTab = signal<'constantes' | 'ordonnances'>('constantes');

  ngOnInit(): void {
    const patientId = Number(this.route.snapshot.paramMap.get('patientId'));
    this.loadPatient(patientId);
    this.loadConstantes(patientId);
    this.loadOrdonnances(patientId);
  }

  loadPatient(id: number): void {
    this.patientService.getById(id).subscribe({
      next: (patient) => this.patient.set(patient)
    });
  }

  loadConstantes(patientId: number): void {
    this.constanteService.getByPatient(patientId).subscribe({
      next: (constantes) => this.constantes.set(constantes.reverse())
    });
  }

  loadOrdonnances(patientId: number): void {
    this.ordonnanceService.getByPatient(patientId).subscribe({
      next: (ordonnances) => this.ordonnances.set(ordonnances)
    });
  }

  voirOrdonnance(ordonnance: Ordonnance): void {
    this.router.navigate(['/medecin/ordonnance', ordonnance.id]);
  }

  renouvelerOrdonnance(ordonnance: Ordonnance): void {
    this.router.navigate(['/medecin/prescription', this.patient()!.id], {
      queryParams: { renew: ordonnance.id }
    });
  }

  goBack(): void {
    this.router.navigate(['/medecin/consultation', this.patient()!.id]);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
}
