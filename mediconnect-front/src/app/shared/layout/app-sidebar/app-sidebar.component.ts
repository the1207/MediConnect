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
        { name: 'Spécialités', icon: '<span class="text-base">S</span>', path: '/admin/specialites' },
        { name: 'Médecins', icon: '<span class="text-base">M</span>', path: '/admin/medecins' },
        { name: 'Utilisateurs', icon: '<span class="text-base">U</span>', path: '/admin/utilisateurs' },
        { name: 'Historique', icon: '<span class="text-base">H</span>', path: '/admin/historique' },
      ];
    }

    if (role === 'MEDECIN') {
      return [
        { name: 'Mes patients', icon: '<span class="text-base">P</span>', path: '/medecin/mes-patients' },
        { name: 'Disponibilités', icon: '<span class="text-base">D</span>', path: '/medecin/disponibilites' },
      ];
    }

    if (role === 'INFIRMIER') {
      return [
        { name: 'Historique patients', icon: '<span class="text-base">H</span>', path: '/infirmier/historique' },
        { name: 'Créer patient', icon: '<span class="text-base">C</span>', path: '/infirmier/patient-create' },
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
