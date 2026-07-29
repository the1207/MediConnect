import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FileAttenteService } from '../../../core/services/file-attente.service';
import { FileAttente } from '../../../core/models';

@Component({
  selector: 'app-file-attente',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>File d'attente</h1>
          <p>Patients en attente de consultation</p>
        </div>
        <button class="btn btn-primary btn-md" (click)="refresh()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Actualiser
        </button>
      </div>

      <div class="stats-row">
        <div class="stat-chip">
          <span class="stat-chip-dot stat-chip-dot--waiting"></span>
          <span>{{ getCountByStatut('EN_ATTENTE') }} en attente</span>
        </div>
        <div class="stat-chip">
          <span class="stat-chip-dot stat-chip-dot--consulting"></span>
          <span>{{ getCountByStatut('EN_CONSULTATION') }} en consultation</span>
        </div>
        <div class="stat-chip stat-chip--alert">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          </svg>
          <span>{{ getAlerteCount() }} alertes</span>
        </div>
      </div>

      <div class="card">
        @if (loading()) {
          <div class="loading-state">
            <span class="spinner"></span>
            <p>Chargement...</p>
          </div>
        } @else if (items().length === 0) {
          <div class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <h3>Aucun patient en attente</h3>
            <p>Les patients apparaîtront ici après la prise de constantes</p>
          </div>
        } @else {
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Priorité</th>
                  <th>Patient</th>
                  <th>Motif</th>
                  <th>Constantes</th>
                  <th>Heure</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (item of items(); track item.id) {
                  <tr [class.row-alert]="item.alertes" [class.row-urgent]="item.priorite === 'URGENTE'">
                    <td>
                      <span class="priority-badge" [class]="'priority-badge--' + item.priorite.toLowerCase()">
                        {{ getPriorityLabel(item.priorite) }}
                      </span>
                    </td>
                    <td>
                      <div class="patient-cell">
                        <span class="patient-name">{{ item.patientPrenom }} {{ item.patientNom }}</span>
                      </div>
                    </td>
                    <td>{{ item.motifVisite }}</td>
                    <td>
                      <div class="constantes-cell">
                        @if (item.temperature) {
                          <span [class.text-danger]="item.alertes">{{ item.temperature }}°C</span>
                        }
                        @if (item.tensionArteriel) {
                          <span [class.text-danger]="item.alertes">{{ item.tensionArteriel }}</span>
                        }
                      </div>
                    </td>
                    <td>
                      <span class="time-text">{{ formatTime(item.heureArrivee) }}</span>
                    </td>
                    <td>
                      <span class="badge" [class]="getStatutBadgeClass(item.statut)">
                        {{ getStatutLabel(item.statut) }}
                      </span>
                    </td>
                    <td>
                      <div class="actions-cell">
                        @if (item.statut === 'EN_ATTENTE') {
                          <button class="btn btn-ghost btn-sm" (click)="supprimer(item.id)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                            </svg>
                          </button>
                        }
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 1100px;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
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

    .stats-row {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
    }

    .stat-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      background: var(--bg-card);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-full);
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .stat-chip--alert {
      color: var(--color-danger);
    }

    .stat-chip-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .stat-chip-dot--waiting { background: var(--color-warning); }
    .stat-chip-dot--consulting { background: var(--color-primary); }

    .row-alert {
      background: #FEF2F2 !important;
    }

    .row-urgent td:first-child {
      border-left: 3px solid var(--color-danger);
    }

    .patient-cell {
      display: flex;
      flex-direction: column;
    }

    .patient-name {
      font-weight: 500;
    }

    .constantes-cell {
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 13px;
    }

    .time-text {
      font-size: 13px;
      color: var(--text-muted);
    }

    .priority-badge {
      display: inline-flex;
      padding: 3px 10px;
      border-radius: var(--radius-full);
      font-size: 12px;
      font-weight: 500;
    }

    .priority-badge--urgente { background: #FEF2F2; color: #EF4444; }
    .priority-badge--haute { background: #FFFBEB; color: #F59E0B; }
    .priority-badge--normale { background: #ECFDF5; color: #10B981; }

    .actions-cell {
      display: flex;
      gap: 4px;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px;
      gap: 12px;
      color: var(--text-secondary);
    }
  `]
})
export class FileAttenteComponent implements OnInit {
  private fileAttenteService = inject(FileAttenteService);
  private router = inject(Router);

  items = signal<FileAttente[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.fileAttenteService.getEnAttente().subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  refresh(): void {
    this.loadData();
  }

  getCountByStatut(statut: string): number {
    return this.items().filter(i => i.statut === statut).length;
  }

  getAlerteCount(): number {
    return this.items().filter(i => i.alertes).length;
  }

  supprimer(id: number): void {
    this.fileAttenteService.delete(id).subscribe({
      next: () => this.loadData()
    });
  }

  formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  getPriorityLabel(p: string): string {
    switch (p) {
      case 'URGENTE': return 'Urgent';
      case 'HAUTE': return 'Haute';
      default: return 'Normale';
    }
  }

  getStatutLabel(s: string): string {
    switch (s) {
      case 'EN_CONSULTATION': return 'En consultation';
      case 'TERMINEE': return 'Terminée';
      default: return 'En attente';
    }
  }

  getStatutBadgeClass(s: string): string {
    switch (s) {
      case 'EN_CONSULTATION': return 'badge-info';
      case 'TERMINEE': return 'badge-success';
      default: return 'badge-warning';
    }
  }
}
