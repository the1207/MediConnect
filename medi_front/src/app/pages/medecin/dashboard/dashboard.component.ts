import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';
import { ConstanteService } from '../../../core/services/constante.service';
import { OrdonnanceService } from '../../../core/services/ordonnance.service';
import { RendezVousService } from '../../../core/services/rendezvous.service';
import { AuthService } from '../../../core/services/auth.service';
import { RendezVous } from '../../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <div class="page-header">
        <div>
          <h1>Tableau de bord</h1>
          <p>Bienvenue, Dr. {{ authService.fullName() }}</p>
        </div>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon metric-icon--primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="metric-content">
            <span class="metric-value">{{ totalPatients() }}</span>
            <span class="metric-label">Patients total</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon metric-icon--warning">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="metric-content">
            <span class="metric-value">{{ rdvConfirmes() }}</span>
            <span class="metric-label">Rendez-vous confirmes</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon metric-icon--danger">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div class="metric-content">
            <span class="metric-value">{{ alertesActives() }}</span>
            <span class="metric-label">Alertes actives</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon metric-icon--success">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <div class="metric-content">
            <span class="metric-value">{{ totalOrdonnances() }}</span>
            <span class="metric-label">Ordonnances</span>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <div class="card queue-card">
          <div class="card-header">
            <h3 class="card-title">Rendez-vous confirmés</h3>
            <button class="btn btn-ghost btn-sm" (click)="router.navigate(['/medecin/patients-jour'])">
              Voir tout
            </button>
          </div>
          @if (rdvDuJour().length === 0) {
            <div class="empty-state">
              <p>Aucun rendez-vous confirmé</p>
            </div>
          } @else {
            <div class="queue-list">
              @for (r of rdvDuJour().slice(0, 5); track r.id) {
                <div class="queue-item" (click)="router.navigate(['/medecin/consultation', r.patientId])">
                  <p class="queue-item-name">{{ r.motif }}</p>
                  <span class="queue-item-time">{{ r.heure }}</span>
                </div>
              }
            </div>
          }
        </div>

        <div class="card recent-card">
          <div class="card-header">
            <h3 class="card-title">Activité récente</h3>
          </div>
          <div class="activity-list">
            @for (ord of recentOrdonnances().slice(0, 5); track ord.id) {
              <div class="activity-item">
                <div class="activity-dot"></div>
                <div class="activity-content">
                  <p>Ordonnance pour <strong>{{ ord.patientPrenom }} {{ ord.patientNom }}</strong></p>
                  <span class="activity-time">{{ ord.dateCreation | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
                <span class="badge" [class]="'badge-' + getStatutClass(ord.statut)">{{ ord.statut }}</span>
              </div>
            }
            @if (recentOrdonnances().length === 0) {
              <div class="empty-state">
                <p>Aucune activité récente</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1200px;
    }

    .page-header {
      margin-bottom: 24px;
    }

    .page-header h1 {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .page-header p {
      font-size: 14px;
      color: var(--text-secondary);
      margin-top: 4px;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }

    .metric-card {
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-card);
      border: 1px solid var(--border-default);
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .metric-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .metric-icon--primary { background: rgba(60,80,224,0.1); color: var(--color-primary); }
    .metric-icon--success { background: #ECFDF5; color: #10B981; }
    .metric-icon--warning { background: #FFFBEB; color: #F59E0B; }
    .metric-icon--danger { background: #FEF2F2; color: #EF4444; }

    .metric-content {
      display: flex;
      flex-direction: column;
    }

    .metric-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.2;
    }

    .metric-label {
      font-size: 14px;
      color: var(--text-secondary);
      margin-top: 4px;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .queue-list {
      display: flex;
      flex-direction: column;
    }

    .queue-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid var(--border-default);
      cursor: pointer;
      transition: background var(--transition-fast);
    }

    .queue-item:last-child {
      border-bottom: none;
    }

    .queue-item:hover {
      background: var(--bg-page);
      margin: 0 -24px;
      padding: 12px 24px;
    }

    .queue-item-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .queue-item-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .queue-item-motif {
      font-size: 13px;
      color: var(--text-secondary);
      margin-top: 2px;
    }

    .queue-item-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .queue-item-time {
      font-size: 12px;
      color: var(--text-muted);
    }

    .activity-list {
      display: flex;
      flex-direction: column;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid var(--border-default);
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-primary);
      flex-shrink: 0;
    }

    .activity-content {
      flex: 1;
    }

    .activity-content p {
      font-size: 14px;
      color: var(--text-primary);
    }

    .activity-time {
      font-size: 12px;
      color: var(--text-muted);
    }

    .empty-state {
      padding: 32px;
    }

    @media (max-width: 1024px) {
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .metrics-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  private patientService = inject(PatientService);
  private constanteService = inject(ConstanteService);
  private ordonnanceService = inject(OrdonnanceService);
  private rendezVousService = inject(RendezVousService);

  totalPatients = signal(0);
  rdvConfirmes = signal(0);
  alertesActives = signal(0);
  totalOrdonnances = signal(0);
  rdvDuJour = signal<RendezVous[]>([]);
  recentOrdonnances = signal<any[]>([]);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const medecinId = Number(this.authService.currentMedecinId());
    if (medecinId) {
      this.patientService.getByMedecin(medecinId).subscribe({
        next: (patients) => this.totalPatients.set(patients.length),
        error: () => this.totalPatients.set(0)
      });
    } else {
      this.totalPatients.set(0);
    }

    if (medecinId) {
      this.rendezVousService.getConfirmesByMedecin(medecinId).subscribe({
        next: (rdvs) => {
          this.rdvDuJour.set(rdvs);
          this.rdvConfirmes.set(rdvs.length);
        },
        error: () => {
          this.rdvDuJour.set([]);
          this.rdvConfirmes.set(0);
        }
      });
    }

    this.constanteService.getAll().subscribe({
      next: (list) => this.alertesActives.set(list.filter(c => c.alerte).length),
      error: () => this.alertesActives.set(0)
    });

    if (medecinId) {
      this.ordonnanceService.getByMedecin(medecinId).subscribe({
        next: (ordonnances) => {
          this.totalOrdonnances.set(ordonnances.length);
          this.recentOrdonnances.set(ordonnances.slice(0, 5));
        },
        error: () => {
          this.totalOrdonnances.set(0);
          this.recentOrdonnances.set([]);
        }
      });
    } else {
      this.totalOrdonnances.set(0);
      this.recentOrdonnances.set([]);
    }
  }

  consulterPatient(item: RendezVous): void {
    this.router.navigate(['/medecin/consultation', item.patientId]);
  }

  getPriorityClass(priorite: string): string {
    switch (priorite) {
      case 'URGENTE': return 'urgent';
      case 'HAUTE': return 'high';
      default: return 'normal';
    }
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'VALIDEE': return 'success';
      case 'IMPRIMEE': return 'info';
      default: return 'warning';
    }
  }

  formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
}
