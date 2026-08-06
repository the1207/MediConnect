import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { HistoryEntry } from '../../../core/models';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header"><h1>Historique</h1></div>
    <div class="card">
      @if (loading()) {
        <p>Chargement...</p>
      } @else {
        <div class="table-container">
          <table class="table">
            <thead><tr><th>Utilisateur</th><th>Action</th><th>Date</th></tr></thead>
            <tbody>
              @for (h of entries(); track h.id) {
                <tr>
                  <td>{{ h.fullName }}</td>
                  <td>{{ h.name }}</td>
                  <td>{{ h.dateHistory | date:'dd/MM/yyyy HH:mm' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 20px; }
    .page-header h1 { font-size: 22px; font-weight: 700; color: var(--text-primary); }
  `]
})
export class HistoryComponent implements OnInit {
  private adminService = inject(AdminService);
  entries = signal<HistoryEntry[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.adminService.getHistory().subscribe({
      next: (e) => { this.entries.set(e); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
