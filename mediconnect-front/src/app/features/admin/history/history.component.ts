import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUserService } from '../../../services/admin-user.service';
import { HistoryReponse } from '../../../models/mediconnect.models';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-shell">
      <div class="header-row">
        <h2>Historique des actions</h2>
      </div>

      <div class="controls-panel">
        <div class="alpha-filter">
          <label for="initialFilter">Filtrer :</label>
          <select id="initialFilter" (change)="onSelect($event)" [value]="selectedLetter() ?? ''">
            <option value="">Tous</option>
            <option *ngFor="let l of letters" [value]="l">{{ l }}</option>
          </select>
        </div>
      </div>

      <div class="table-card">
        <table>
          <thead>
            <tr><th>Date</th><th>Utilisateur</th><th>Action</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let h of filteredHistorique()">
              <td>{{ h.dateHistory }}</td>
              <td>{{ h.fullName }}</td>
              <td>{{ h.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [`
    :host { display:block; padding:20px; color:#111827; font-family: Inter, system-ui, sans-serif; }
    .page-shell { display:grid; gap:18px; }
    .header-row h2 { margin:0; font-size:1.8rem; }
    .controls-panel { background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; padding:18px; box-shadow:0 18px 40px rgba(15,23,42,.06); }
    .alpha-filter { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
    .alpha-filter label { font-weight:600; color:#334155; }
    .alpha-filter select { padding:10px 12px; border:1px solid #cbd5e1; border-radius:10px; background:#f8fafc; }
    .table-card { background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; padding:8px; box-shadow:0 18px 40px rgba(15,23,42,.06); overflow:auto; }
    table { width:100%; border-collapse:collapse; }
    th, td { border: 1px solid #e2e8f0; padding: 12px 14px; text-align:left; }
    th { background:#f8fafc; color:#334155; font-weight:700; }
    td { color:#475569; }
  `]
})
export class HistoryComponent {
  private adminUserService = inject(AdminUserService);
  historique = signal<HistoryReponse[]>([]);
  letters = Array.from({length:26}, (_,i)=> String.fromCharCode(65+i));
  selectedLetter = signal<string | null>(null);

  constructor() {
    this.adminUserService.getAllHistory().subscribe(list => this.historique.set(list));
  }

  setFilter(letter: string | null) {
    this.selectedLetter.set(letter);
  }

  onSelect(event: Event) {
    const v = (event.target as HTMLSelectElement).value;
    this.setFilter(v === '' ? null : v);
  }

  filteredHistorique() {
    const letter = this.selectedLetter();
    const all = [...this.historique()].sort((a, b) => {
      const aDate = new Date(a.dateHistory).getTime();
      const bDate = new Date(b.dateHistory).getTime();
      return bDate - aDate;
    });
    if (!letter) return all;
    const lower = letter.toLowerCase();
    return all.filter(h => (h.fullName || '').toLowerCase().startsWith(lower));
  }
}
