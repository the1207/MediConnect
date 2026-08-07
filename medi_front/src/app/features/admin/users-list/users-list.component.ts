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

    <table>
      <thead>
        <tr><th>Nom</th><th>Identifiant</th><th>Rôle</th><th>Statut</th><th>Actions</th></tr>
      </thead>
      <tbody>
        <tr *ngFor="let u of users()">
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
  styles: [`.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; } button { padding: 8px 12px; border: none; border-radius: 8px; color: white; cursor: pointer; } button:first-of-type { background: #dc2626; } button:last-of-type { background: #16a34a; } a { padding: 10px 14px; background: #2563eb; color: white; border-radius: 8px; text-decoration: none; }`]
})
export class UsersListComponent {
  private adminUserService = inject(AdminUserService);

  users = signal<UserRoleReponse[]>([]);

  constructor() {
    this.charger();
  }

  charger() {
    this.adminUserService.getAllUsers().subscribe(list => this.users.set(list));
  }

  desactiver(u: UserRoleReponse) {
    this.adminUserService.deleteUser(u.publicId).subscribe(() => this.charger());
  }

  activer(u: UserRoleReponse) {
    this.adminUserService.enableUser(u.publicId).subscribe(() => this.charger());
  }
}
