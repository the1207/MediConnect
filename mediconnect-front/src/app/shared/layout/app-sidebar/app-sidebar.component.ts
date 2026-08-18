import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { SafeHtmlPipe } from '../../pipe/safe-html.pipe';

type NavItem = {
  name: string;
  icon: string;
  path: string;
};

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterModule,
    SafeHtmlPipe,
  ],
  templateUrl: './app-sidebar.component.html',
})
export class AppSidebarComponent {
  readonly isExpanded$;
  readonly isMobileOpen$;
  readonly isHovered$;

  constructor(
    public sidebarService: SidebarService,
    private router: Router,
    private auth: AuthService
  ) {
    this.isExpanded$ = sidebarService.isExpanded$;
    this.isMobileOpen$ = sidebarService.isMobileOpen$;
    this.isHovered$ = sidebarService.isHovered$;
  }

  get navItems(): NavItem[] {
    const role = this.auth.role();

    if (role === 'ADMIN') {
      return [
        {
          name: 'Spécialités',
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7z" fill="currentColor"/></svg>',
          path: '/admin/specialites'
        },
        {
          name: 'Médecins',
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 21c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          path: '/admin/medecins'
        },
        {
          name: 'Utilisateurs',
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          path: '/admin/utilisateurs'
        },
        {
          name: 'Historique',
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          path: '/admin/historique'
        },
      ];
    }

    if (role === 'MEDECIN') {
      return [
        {
          name: 'Mes patients',
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM8 11c1.657 0 3-1.343 3-3S9.657 5 8 5 5 6.343 5 8s1.343 3 3 3z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 20c0-3.314 2.686-6 6-6h8c3.314 0 6 2.686 6 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          path: '/medecin/mes-patients'
        },
        {
          name: 'Disponibilités',
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          path: '/medecin/disponibilites'
        },
      ];
    }

    if (role === 'INFIRMIER') {
      return [
        {
          name: 'Historique patients',
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          path: '/infirmier/historique'
        },
        {
          name: 'Créer patient',
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 14v6M9 17h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          path: '/infirmier/patient-create'
        },
      ];
    }

    return [];
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/signin']);
  }
}
