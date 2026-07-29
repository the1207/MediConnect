import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrdonnanceService } from '../../../core/services/ordonnance.service';
import { Ordonnance } from '../../../core/models';

@Component({
  selector: 'app-ordonnances-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Ordonnances</h1>
          <p>Liste de toutes les ordonnances</p>
        </div>
      </div>

      <div class="card">
        @if (loading()) {
          <div class="loading-state">
            <span class="spinner"></span>
          </div>
        } @else if (ordonnances().length === 0) {
          <div class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            <h3>Aucune ordonnance</h3>
            <p>Les ordonnances créées apparaîtront ici</p>
          </div>
        } @else {
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Médicaments</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (ord of ordonnances(); track ord.id) {
                  <tr>
                    <td>
                      <span class="font-medium">{{ ord.patientPrenom }} {{ ord.patientNom }}</span>
                    </td>
                    <td>{{ ord.dateCreation | date:'dd/MM/yyyy' }}</td>
                    <td>{{ ord.medicaments.length }} médicament(s)</td>
                    <td>
                      <span class="badge" [class]="getStatutBadge(ord.statut)">{{ ord.statut }}</span>
                    </td>
                    <td>
                      <div class="actions">
                        <button class="btn btn-ghost btn-sm" (click)="voir(ord.id)">
                          Voir
                        </button>
                        @if (ord.statut === 'REDIGEE') {
                          <button class="btn btn-ghost btn-sm" (click)="renouveler(ord)">
                            Renouveler
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
    .page { max-width: 1000px; margin: 0 auto; }

    .page-header {
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

    .actions {
      display: flex;
      gap: 4px;
    }

    .loading-state {
      display: flex;
      justify-content: center;
      padding: 48px;
    }
  `]
})
export class OrdonnancesListComponent implements OnInit {
  private ordonnanceService = inject(OrdonnanceService);
  private router = inject(Router);

  ordonnances = signal<Ordonnance[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.ordonnanceService.getAll().subscribe({
      next: (data) => {
        this.ordonnances.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  voir(id: number): void {
    this.router.navigate(['/medecin/ordonnance', id]);
  }

  renouveler(ord: Ordonnance): void {
    this.router.navigate(['/medecin/prescription', ord.patientId], {
      queryParams: { renew: ord.id }
    });
  }

  getStatutBadge(statut: string): string {
    switch (statut) {
      case 'VALIDEE': return 'badge-success';
      case 'IMPRIMEE': return 'badge-info';
      default: return 'badge-warning';
    }
  }
}
