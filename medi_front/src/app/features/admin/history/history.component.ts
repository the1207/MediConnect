import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUserService } from '../../../services/admin-user.service';
import { HistoryReponse } from '../../../models/mediconnect.models';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Historique des actions</h2>
    <table>
      <thead>
        <tr><th>Date</th><th>Utilisateur</th><th>Action</th></tr>
      </thead>
      <tbody>
        <tr *ngFor="let h of historique()">
          <td>{{ h.dateHistory }}</td>
          <td>{{ h.fullName }}</td>
          <td>{{ h.name }}</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }`]
})
export class HistoryComponent {
  private adminUserService = inject(AdminUserService);
  historique = signal<HistoryReponse[]>([]);

  constructor() {
    this.adminUserService.getAllHistory().subscribe(list => this.historique.set(list));
  }
}
