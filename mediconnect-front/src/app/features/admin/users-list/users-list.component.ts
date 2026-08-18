import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminUserService } from '../../../services/admin-user.service';
import { UserRoleReponse } from '../../../models/mediconnect.models';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="header">
      <h2>Utilisateurs</h2>
      <a routerLink="/admin/utilisateurs/nouveau">+ Nouvel utilisateur</a>
    </div>

    <div class="status-box" *ngIf="message()" [ngClass]="messageType()">
      {{ message() }}
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

    <table>
      <thead>
        <tr><th>Nom</th><th>Identifiant</th><th>Rôle</th><th>Statut</th><th>Actions</th></tr>
      </thead>
      <tbody>
        <tr *ngFor="let u of filteredUsers()">
          <td>{{ u.fullName }}</td>
          <td>{{ u.username }}</td>
          <td>{{ u.roles }}</td>
          <td>{{ u.enable ? 'Actif' : 'Désactivé' }}</td>
          <td>
            <button *ngIf="u.enable" (click)="desactiver(u)">Désactiver</button>
            <button *ngIf="!u.enable" (click)="activer(u)">Activer</button>
          </td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`.status-box { margin-bottom: 12px; padding: 12px 14px; border-radius: 10px; font-weight: 600; } .status-box.success { background:#dcfce7; color:#166534; border:1px solid #86efac; } .status-box.error { background:#fee2e2; color:#991b1b; border:1px solid #fca5a5; } .status-box.info { background:#dbeafe; color:#1d4ed8; border:1px solid #93c5fd; } .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; } .controls-panel { background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; padding:18px; margin-bottom:18px; box-shadow:0 18px 40px rgba(15,23,42,.06); } .alpha-filter { display:flex; gap:8px; flex-wrap:wrap; align-items:center; } .alpha-filter label { font-weight:600; color:#334155; } .alpha-filter select { padding:10px 12px; border:1px solid #cbd5e1; border-radius:10px; background:#f8fafc; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; } button { padding: 8px 12px; border: none; border-radius: 8px; color: white; cursor: pointer; } button:first-of-type { background: #dc2626; } button:last-of-type { background: #16a34a; } a { padding: 10px 14px; background: #2563eb; color: white; border-radius: 8px; text-decoration: none; }`]
})
export class UsersListComponent {
  private adminUserService = inject(AdminUserService);

  users = signal<UserRoleReponse[]>([]);
  message = signal('');
  messageType = signal<'success' | 'error' | 'info'>('info');
  letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  selectedLetter = signal<string | null>(null);

  constructor() {
    this.charger();
  }

  charger() {
    this.adminUserService.getAllUsers().subscribe(list => {
      const sorted = [...list].sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
      this.users.set(sorted);
    });
  }

  setFilter(letter: string | null) {
    this.selectedLetter.set(letter);
  }

  onSelect(event: Event) {
    const v = (event.target as HTMLSelectElement).value;
    this.setFilter(v === '' ? null : v);
  }

  filteredUsers() {
    const letter = this.selectedLetter();
    const all = [...this.users()].sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
    if (!letter) return all;
    const lower = letter.toLowerCase();
    return all.filter(u => (u.fullName || '').toLowerCase().startsWith(lower));
  }

  desactiver(u: UserRoleReponse) {
    this.message.set('');
    this.adminUserService.deleteUser(u.publicId).subscribe({
      next: () => {
        this.message.set('Utilisateur désactivé avec succès.');
        this.messageType.set('success');
        this.charger();
      },
      error: () => {
        this.message.set('Impossible de désactiver cet utilisateur.');
        this.messageType.set('error');
      }
    });
  }

  activer(u: UserRoleReponse) {
    this.message.set('');
    this.adminUserService.enableUser(u.publicId).subscribe({
      next: () => {
        this.message.set('Utilisateur activé avec succès.');
        this.messageType.set('success');
        this.charger();
      },
      error: () => {
        this.message.set('Impossible d\'activer cet utilisateur.');
        this.messageType.set('error');
      }
    });
  }
}
