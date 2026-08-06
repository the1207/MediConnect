import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="layout">
      <aside class="sidebar">
        <div class="sidebar-header"><span class="logo-title">MediConnect Admin</span></div>
        <nav class="sidebar-nav">
          <a routerLink="/admin/utilisateurs" routerLinkActive="active" class="nav-item">Utilisateurs</a>
          <a routerLink="/admin/historique" routerLinkActive="active" class="nav-item">Historique</a>
        </nav>
      </aside>
      <div class="main-wrapper">
        <header class="header">
          <span class="header-title">Espace Admin</span>
          <button class="btn btn-secondary btn-sm" (click)="logout()">Déconnexion</button>
        </header>
        <main class="content"><router-outlet></router-outlet></main>
      </div>
    </div>
  `,
  styles: [`
    .layout { display: flex; min-height: 100vh; }
    .sidebar { width: 240px; background: var(--bg-sidebar); color: var(--text-sidebar); position: fixed; top: 0; left: 0; bottom: 0; padding: 24px 16px; }
    .sidebar-header { margin-bottom: 24px; }
    .logo-title { color: #fff; font-weight: 700; font-size: 18px; }
    .sidebar-nav { display: flex; flex-direction: column; gap: 4px; }
    .nav-item { padding: 10px 12px; border-radius: var(--radius-md); color: var(--text-sidebar); text-decoration: none; font-size: 14px; }
    .nav-item.active, .nav-item:hover { background: rgba(255,255,255,0.08); color: #fff; }
    .main-wrapper { margin-left: 240px; flex: 1; }
    .header { height: 64px; background: var(--bg-card); border-bottom: 1px solid var(--border-default); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
    .content { padding: 24px; }
  `]
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  logout(): void { this.authService.logout(); }
}
