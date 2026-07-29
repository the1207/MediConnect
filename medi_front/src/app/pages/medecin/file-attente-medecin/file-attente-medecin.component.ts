import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FileAttenteService } from '../../../core/services/file-attente.service';
import { FileAttente } from '../../../core/models';

@Component({
  selector: 'app-file-attente-medecin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>File d'attente</h1>
          <p>Patients en attente de consultation - triés par priorité</p>
        </div>
        <button class="btn btn-secondary btn-md" (click)="refresh()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Actualiser
        </button>
      </div>

      @if (loading()) {
        <div class="card">
          <div class="loading-state">
            <span class="spinner"></span>
            <p>Chargement...</p>
          </div>
        </div>
      } @else if (items().length === 0) {
        <div class="card">
          <div class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h3>Aucun patient en attente</h3>
            <p>La file d'attente est vide pour le moment</p>
          </div>
        </div>
      } @else {
        <div class="queue-cards">
          @for (item of items(); track item.id) {
            <div class="queue-card" [class.queue-card--alert]="item.alertes" [class.queue-card--urgent]="item.priorite === 'URGENTE'">
              <div class="queue-card-top">
                <div class="queue-card-left">
                  <span class="priority-dot" [class]="'priority-dot--' + getPriorityClass(item.priorite)"></span>
                  <div class="queue-card-patient">
                    <h3>{{ item.patientPrenom }} {{ item.patientNom }}</h3>
                    <p>{{ item.motifVisite }}</p>
                  </div>
                </div>
                <div class="queue-card-meta">
                  @if (item.alertes) {
                    <span class="badge badge-danger">Alerte</span>
                  }
                  <span class="badge" [class]="'priority-badge--' + item.priorite.toLowerCase()">
                    {{ getPriorityLabel(item.priorite) }}
                  </span>
                </div>
              </div>

              <div class="queue-card-details">
                @if (item.temperature) {
                  <div class="detail-chip" [class.detail-chip--alert]="item.alertes">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
                    </svg>
                    {{ item.temperature }}°C
                  </div>
                }
                @if (item.tensionArteriel) {
                  <div class="detail-chip" [class.detail-chip--alert]="item.alertes">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                    {{ item.tensionArteriel }}
                  </div>
                }
                @if (item.poids) {
                  <div class="detail-chip">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                    {{ item.poids }} kg
                  </div>
                }
                <div class="detail-chip detail-chip--time">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {{ formatTime(item.heureArrivee) }}
                </div>
              </div>

              <div class="queue-card-actions">
                @if (item.statut === 'EN_ATTENTE') {
                  <button class="btn btn-primary btn-sm" (click)="commencerConsultation(item)">
                    Consulter
                  </button>
                } @else {
                  <button class="btn btn-success btn-sm" (click)="terminer(item)">
                    Terminer
                  </button>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page {
      max-width: 900px;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
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

    .queue-cards {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .queue-card {
      background: var(--bg-card);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-lg);
      padding: 20px 24px;
      box-shadow: var(--shadow-card);
      transition: all var(--transition-fast);
    }

    .queue-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    .queue-card--alert {
      border-left: 4px solid var(--color-danger);
    }

    .queue-card--urgent {
      border-left: 4px solid var(--color-danger);
      background: #FFFBFB;
    }

    .queue-card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .queue-card-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .queue-card-patient h3 {
      font-size: 15px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .queue-card-patient p {
      font-size: 13px;
      color: var(--text-secondary);
      margin-top: 2px;
    }

    .queue-card-meta {
      display: flex;
      gap: 8px;
    }

    .priority-badge--urgente { background: #FEF2F2; color: #EF4444; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; }
    .priority-badge--haute { background: #FFFBEB; color: #F59E0B; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; }
    .priority-badge--normale { background: #ECFDF5; color: #10B981; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; }

    .queue-card-details {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 14px;
    }

    .detail-chip {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: var(--bg-page);
      border-radius: var(--radius-full);
      font-size: 13px;
      color: var(--text-secondary);
    }

    .detail-chip--alert {
      background: #FEF2F2;
      color: var(--color-danger);
    }

    .detail-chip--time {
      color: var(--text-muted);
    }

    .queue-card-actions {
      display: flex;
      justify-content: flex-end;
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
export class FileAttenteMedecinComponent implements OnInit {
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

  commencerConsultation(item: FileAttente): void {
    this.fileAttenteService.passerEnConsultation(item.id).subscribe({
      next: () => {
        this.router.navigate(['/medecin/consultation', item.patientId]);
      }
    });
  }

  terminer(item: FileAttente): void {
    this.fileAttenteService.terminer(item.id).subscribe({
      next: () => this.loadData()
    });
  }

  getPriorityClass(priorite: string): string {
    switch (priorite) {
      case 'URGENTE': return 'urgent';
      case 'HAUTE': return 'high';
      default: return 'normal';
    }
  }

  getPriorityLabel(p: string): string {
    switch (p) {
      case 'URGENTE': return 'Urgent';
      case 'HAUTE': return 'Haute';
      default: return 'Normale';
    }
  }

  formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
}
