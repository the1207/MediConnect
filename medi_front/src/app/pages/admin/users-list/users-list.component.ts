import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { UserRoleReponse } from '../../../core/models';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header">
      <h1>Utilisateurs</h1>
      <a routerLink="/admin/utilisateurs/nouveau" class="btn btn-primary btn-md">+ Nouvel utilisateur</a>
    </div>
    <div class="card">
      @if (loading()) {
        <p>Chargement...</p>
      } @else {
        <div class="table-container">
          <table class="table">
            <thead>
              <tr><th>Nom</th><th>Identifiant</th><th>Rôle</th><th>Statut</th><th>Actions</th></tr>
            </thead>
            <tbody>
              @for (u of users(); track u.publicId) {
                <tr>
                  <td>{{ u.fullName }}</td>
                  <td>{{ u.username }}</td>
                  <td><span class="badge badge-primary">{{ u.roles }}</span></td>
                  <td>
                    @if (u.enable) { <span class="badge badge-success">Actif</span> }
                    @else { <span class="badge badge-danger">Désactivé</span> }
                  </td>
                  <td>
                    <div class="flex gap-2">
                      @if (!u.enable) {
                        <button class="btn btn-secondary btn-sm" (click)="activer(u)">Activer</button>
                      }
                      <button class="btn btn-danger btn-sm" (click)="supprimer(u)">Supprimer</button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .page-header h1 { font-size: 22px; font-weight: 700; color: var(--text-primary); }
  `]
})
export class UsersListComponent implements OnInit {
  private adminService = inject(AdminService);
  users = signal<UserRoleReponse[]>([]);
  loading = signal(true);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.adminService.getAllUsers().subscribe({
      next: (users) => { this.users.set(users); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  activer(u: UserRoleReponse): void {
    this.adminService.enableUser(u.publicId).subscribe({ next: () => this.load() });
  }

  supprimer(u: UserRoleReponse): void {
    if (!confirm(`Désactiver ${u.fullName} ?`)) return;
    this.adminService.deleteUser(u.publicId).subscribe({ next: () => this.load() });
  }
}
