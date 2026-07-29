import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-infirmiere-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <div class="logo-text">
            <span class="logo-title">MediConnect</span>
            <span class="logo-subtitle">Espace Infirmiere</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <span class="nav-section-label">PRISE EN CHARGE</span>

          <a routerLink="/infirmiere/recherche" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <span>Recherche Patient</span>
          </a>

          <a routerLink="/infirmiere/nouveau-patient" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
            <span>Nouveau Patient</span>
          </a>

          <a routerLink="/infirmiere/file-attente" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>File d'attente</span>
          </a>
        </nav>
      </aside>

      <!-- Main wrapper -->
      <div class="main-wrapper">
        <!-- Header -->
        <header class="header">
          <div class="header-left">
            <h2 class="header-title">Tableau de bord</h2>
          </div>
          <div class="header-right">
            <div class="user-info">
              <div class="user-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <span class="user-name">{{ authService.fullName() }}</span>
            </div>
            <button class="btn-logout" (click)="logout()">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>Deconnexion</span>
            </button>
          </div>
        </header>

        <!-- Content -->
        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      min-height: 100vh;
    }

    /* ===== Sidebar ===== */
    .sidebar {
      width: var(--sidebar-width, 280px);
      background: var(--bg-sidebar, #1C2434);
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      z-index: 200;
      overflow-y: auto;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 24px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .logo {
      width: 44px;
      height: 44px;
      background: var(--color-primary, #3C50E0);
      border-radius: var(--radius-md, 8px);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      flex-shrink: 0;
    }

    .logo-text {
      display: flex;
      flex-direction: column;
    }

    .logo-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--text-sidebar-active, #FFFFFF);
      letter-spacing: -0.01em;
    }

    .logo-subtitle {
      font-size: 0.75rem;
      color: var(--text-sidebar-section, #8A99AF);
      margin-top: 2px;
    }

    /* ===== Navigation ===== */
    .sidebar-nav {
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-section-label {
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--text-sidebar-section, #8A99AF);
      padding: 0 12px;
      margin-bottom: 12px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: var(--radius-md, 8px);
      color: var(--text-sidebar, #DEE4EE);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all var(--transition-fast, 150ms ease);
      border-left: 3px solid transparent;
      margin-left: -3px;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-sidebar-active, #FFFFFF);
    }

    .nav-item.active {
      background: rgba(60, 80, 224, 0.08);
      color: var(--text-sidebar-active, #FFFFFF);
      border-left-color: var(--color-primary, #3C50E0);
    }

    .nav-item svg {
      flex-shrink: 0;
      opacity: 0.7;
    }

    .nav-item.active svg {
      opacity: 1;
    }

    /* ===== Main Wrapper ===== */
    .main-wrapper {
      margin-left: var(--sidebar-width, 280px);
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    /* ===== Header ===== */
    .header {
      height: var(--header-height, 72px);
      background: var(--bg-card, #FFFFFF);
      border-bottom: 1px solid var(--border-default, #E2E8F0);
      box-shadow: var(--shadow-header, 0 1px 2px rgba(0, 0, 0, 0.05));
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-left {
      display: flex;
      align-items: center;
    }

    .header-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary, #1C2434);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #F1F5F9;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary, #64748B);
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary, #1C2434);
    }

    .btn-logout {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: none;
      border: 1px solid var(--border-default, #E2E8F0);
      border-radius: var(--radius-md, 8px);
      color: var(--text-secondary, #64748B);
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast, 150ms ease);
    }

    .btn-logout:hover {
      background: #FEF2F2;
      border-color: #FECACA;
      color: #DC2626;
    }

    /* ===== Content ===== */
    .content {
      flex: 1;
      padding: 24px;
      background: #F1F5F9;
    }
  `]
})
export class InfirmiereLayoutComponent {
  authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
