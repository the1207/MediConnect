import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-medecin-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <!-- Logo -->
        <div class="sidebar-logo">
          <div class="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4.8 2.3A.3.3 0 0 1 5 2h4a2 2 0 0 1 2 2v5a6 6 0 0 1-6 6v0a6 6 0 0 1-6-6V9a2 2 0 0 1 2-2h1a.3.3 0 0 0 .3-.3V4a2 2 0 0 1 1.5-1.7"/>
              <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
              <circle cx="20" cy="10" r="2"/>
            </svg>
          </div>
          <span class="logo-text">MediConnect</span>
        </div>

        <!-- Navigation -->
        <nav class="sidebar-nav">
          <!-- Section: CONSULTATION -->
          <div class="nav-section">
            <span class="nav-section-title">CONSULTATION</span>

            <a routerLink="/medecin/dashboard" routerLinkActive="active" class="nav-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              <span>Dashboard</span>
            </a>

            <a routerLink="/medecin/patients" routerLinkActive="active" class="nav-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span>Patients</span>
            </a>

            <a routerLink="/medecin/file-attente" routerLinkActive="active" class="nav-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>File d'attente</span>
            </a>
          </div>

          <!-- Section: PRESCRIPTION -->
          <div class="nav-section">
            <span class="nav-section-title">PRESCRIPTION</span>

            <a routerLink="/medecin/ordonnances" routerLinkActive="active" class="nav-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                <line x1="8" y1="10" x2="16" y2="10"/>
                <line x1="8" y1="14" x2="16" y2="14"/>
                <line x1="8" y1="18" x2="12" y2="18"/>
              </svg>
              <span>Ordonnances</span>
            </a>
          </div>
        </nav>
      </aside>

      <!-- Main content area -->
      <div class="main-wrapper">
        <!-- Header -->
        <header class="header">
          <div class="header-left">
            <span class="header-title">Espace Medecin</span>
          </div>
          <div class="header-right">
            <div class="user-info">
              <div class="user-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <span class="user-name">Dr. {{ authService.fullName() ?? authService.username() }}</span>
            </div>
            <button class="logout-btn" (click)="logout()">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>Deconnexion</span>
            </button>
          </div>
        </header>

        <!-- Page content -->
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      overflow: hidden;
    }

    .layout {
      display: flex;
      height: 100%;
    }

    /* ===== SIDEBAR ===== */
    .sidebar {
      width: var(--sidebar-width, 280px);
      background: var(--bg-sidebar, #1C2434);
      color: var(--text-sidebar, #DEE4EE);
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      display: flex;
      flex-direction: column;
      z-index: 50;
      overflow-y: auto;
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 24px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .logo-icon {
      width: 42px;
      height: 42px;
      background: var(--color-primary, #3C50E0);
      border-radius: var(--radius-md, 8px);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      flex-shrink: 0;
    }

    .logo-text {
      font-size: 1.25rem;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.02em;
    }

    /* Navigation */
    .sidebar-nav {
      flex: 1;
      padding: 16px 0;
      overflow-y: auto;
    }

    .nav-section {
      margin-bottom: 8px;
      padding: 0 16px;
    }

    .nav-section-title {
      display: block;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-sidebar-section, #8A99AF);
      padding: 12px 12px 8px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      color: var(--text-sidebar, #DEE4EE);
      text-decoration: none;
      border-radius: var(--radius-md, 8px);
      font-size: 0.875rem;
      font-weight: 500;
      transition: all var(--transition-fast, 150ms ease);
      position: relative;
      margin-bottom: 2px;
      border-left: 3px solid transparent;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-sidebar-active, #FFFFFF);
    }

    .nav-item.active {
      background: rgba(60, 80, 224, 0.12);
      color: var(--text-sidebar-active, #FFFFFF);
      border-left-color: var(--color-primary, #3C50E0);
    }

    .nav-item svg {
      flex-shrink: 0;
      opacity: 0.7;
      transition: opacity var(--transition-fast, 150ms ease);
    }

    .nav-item:hover svg,
    .nav-item.active svg {
      opacity: 1;
    }

    /* ===== MAIN WRAPPER ===== */
    .main-wrapper {
      flex: 1;
      margin-left: var(--sidebar-width, 280px);
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    /* ===== HEADER ===== */
    .header {
      height: var(--header-height, 72px);
      min-height: var(--header-height, 72px);
      background: var(--bg-card, #FFFFFF);
      border-bottom: 1px solid var(--border-default, #E2E8F0);
      box-shadow: var(--shadow-header, 0 1px 2px rgba(0, 0, 0, 0.05));
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      position: sticky;
      top: 0;
      z-index: 40;
    }

    .header-left {
      display: flex;
      align-items: center;
    }

    .header-title {
      font-size: 0.9375rem;
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
      background: #F1F5F9;
      border-radius: 50%;
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

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: transparent;
      border: 1px solid var(--border-default, #E2E8F0);
      border-radius: var(--radius-md, 8px);
      color: var(--text-secondary, #64748B);
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast, 150ms ease);
    }

    .logout-btn:hover {
      background: #FEF2F2;
      border-color: #FECACA;
      color: #DC2626;
    }

    /* ===== MAIN CONTENT ===== */
    .main-content {
      flex: 1;
      padding: 24px;
      background: #F1F5F9;
      overflow-y: auto;
    }

    /* ===== PRINT ===== */
    @media print {
      .sidebar {
        display: none !important;
      }

      .header {
        display: none !important;
      }

      .main-wrapper {
        margin-left: 0 !important;
        width: 100% !important;
        height: auto !important;
        overflow: visible !important;
      }

      .main-content {
        padding: 0 !important;
        background: #fff !important;
        overflow: visible !important;
      }

      :host {
        height: auto !important;
        overflow: visible !important;
      }

      .layout {
        display: block !important;
        height: auto !important;
      }
    }
  `]
})
export class MedecinLayoutComponent {
  authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
