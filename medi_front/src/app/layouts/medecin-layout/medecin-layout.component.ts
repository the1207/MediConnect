import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-medecin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell" style="--role-accent:#2F9E7C">
      <aside class="sidebar">
        <div class="brand">
          <span class="brand__mark">MC</span>
          <span class="brand__name">MediConnect</span>
        </div>

        <svg class="ecg-line" viewBox="0 0 240 28" preserveAspectRatio="none">
          <path d="M0,14 L30,14 L38,3 L46,25 L54,14 L70,14 L78,6 L84,14 L240,14" />
        </svg>

        <span class="role-tag">Médecin</span>

        <nav class="nav">
          <a routerLink="/medecin/mes-patients" routerLinkActive="is-active" class="nav-link">Mes patients</a>
          <a routerLink="/medecin/disponibilites" routerLinkActive="is-active" class="nav-link">Mes disponibilités</a>
        </nav>

        <div class="sidebar__footer">
          <span class="user-name">Dr. {{ auth.fullName() }}</span>
          <button class="btn btn-ghost btn-logout" (click)="auth.logout()">Déconnexion</button>
        </div>
      </aside>

      <main class="content"><router-outlet></router-outlet></main>
    </div>
  `,
  styles: [`
    .shell { display: grid; grid-template-columns: 248px 1fr; min-height: 100vh; }

    .sidebar {
      background: var(--ink);
      color: #fff;
      padding: 28px 22px;
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    .brand { display: flex; align-items: center; gap: 10px; }
    .brand__mark {
      width: 30px; height: 30px; border-radius: 6px;
      background: var(--role-accent); color: var(--ink);
      font-family: var(--font-display); font-weight: 700; font-size: 12px;
      display: flex; align-items: center; justify-content: center;
    }
    .brand__name { font-family: var(--font-display); font-size: 13px; letter-spacing: .12em; text-transform: uppercase; }

    .ecg-line path { stroke: var(--role-accent); }

    .role-tag {
      font-family: var(--font-display); font-size: 11px; letter-spacing: .14em; text-transform: uppercase;
      color: var(--role-accent); border: 1px solid rgba(255,255,255,.18);
      padding: 4px 8px; border-radius: 3px; width: fit-content;
    }

    .nav { display: flex; flex-direction: column; gap: 2px; margin-top: 4px; }
    .nav-link {
      color: rgba(255,255,255,.78); text-decoration: none; font-size: 14px;
      padding: 10px 12px; border-radius: 4px; border-left: 2px solid transparent;
    }
    .nav-link:hover { background: rgba(255,255,255,.06); color: #fff; }
    .nav-link.is-active { color: #fff; background: rgba(255,255,255,.08); border-left-color: var(--role-accent); }

    .sidebar__footer {
      margin-top: auto; display: flex; flex-direction: column; gap: 10px;
      padding-top: 18px; border-top: 1px solid rgba(255,255,255,.14);
    }
    .user-name { font-size: 13px; color: rgba(255,255,255,.6); }
    .btn-logout { background: transparent; border-color: rgba(255,255,255,.24); color: #fff; }
    .btn-logout:hover { background: rgba(255,255,255,.08); }

    .content { padding: 44px 52px; }

    @media (max-width: 860px) {
      .shell { grid-template-columns: 1fr; }
      .sidebar { flex-direction: row; flex-wrap: wrap; padding: 16px 20px; }
      .sidebar__footer { margin-top: 0; flex-direction: row; align-items: center; border-top: none; padding-top: 0; }
      .content { padding: 28px 20px; }
    }
  `]
})
export class MedecinLayoutComponent {
  auth = inject(AuthService);
}
