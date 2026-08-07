import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-page">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="nav-container">
          <div class="nav-left">
            <div class="logo">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
              <span>MediConnect</span>
            </div>
          </div>
          <div class="nav-right">
            <a routerLink="/login" class="btn btn-primary">Se connecter</a>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">
            Gestion médicale <span class="highlight">simplifiée</span><br>
            pour les professionnels
          </h1>
          <p class="hero-description">
            La plupart des logiciels médicaux sont complexes et difficiles à utiliser.<br>
            Nous avons créé MediConnect pour rendre la gestion de vos patients simple et intuitive.
          </p>
          <div class="hero-actions">
            <a routerLink="/login" class="btn btn-dark btn-large">Accéder à la plateforme</a>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features">
        <div class="features-container">
          <div class="section-header">
            <p class="section-label">Pourquoi MediConnect ?</p>
            <h2>Tout ce dont vous avez besoin pour gérer votre établissement</h2>
          </div>

          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>Gestion des patients</h3>
              <p>Dossiers patients complets avec historique médical, allergies et antécédents.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <h3>Suivi des constantes</h3>
              <p>Alertes automatiques sur les valeurs anormales et comparaison avec les mesures précédentes.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h3>Planification de rendez-vous</h3>
              <p>Réservation de créneaux avec confirmation medecin et suivi de disponibilités.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <h3>Ordonnances numériques</h3>
              <p>Prescription facilitée avec autocomplétion et détection des interactions médicamenteuses.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
              </div>
              <h3>Tableau de bord</h3>
              <p>Vue d'ensemble en temps réel de l'activité de votre établissement.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3>Sécurisé et conforme</h3>
              <p>Vos données sont protégées et conformes aux normes médicales.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta">
        <div class="cta-container">
          <div class="cta-content">
            <h2>Prêt à simplifier la gestion de votre établissement ?</h2>
            <p>Rejoignez les professionnels de santé qui ont déjà adopté MediConnect</p>
            <div class="cta-actions">
              <a routerLink="/login" class="btn btn-primary btn-large">Commencer maintenant</a>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
            <span>MediConnect</span>
          </div>
          <p class="footer-text">
            &copy; 2026 MediConnect. Plateforme de gestion médicale.
          </p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .home-page {
      min-height: 100vh;
      background: #FFFFFF;
    }

    /* Navbar */
    .navbar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: transparent;
    }

    .nav-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 24px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: 48px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 20px;
      font-weight: 700;
      color: #1C2434;
    }

    .logo svg {
      color: #3C50E0;
    }

    .nav-right .btn {
      height: 40px;
      padding: 0 20px;
      font-size: 14px;
      font-weight: 600;
    }

    /* Hero Section */
    .hero {
      padding: 160px 32px 100px;
      text-align: center;
      background: #FFFFFF;
    }

    .hero-content {
      max-width: 900px;
      margin: 0 auto;
    }

    .hero-title {
      font-size: 64px;
      font-weight: 700;
      line-height: 1.15;
      color: #1C2434;
      margin-bottom: 24px;
      letter-spacing: -0.03em;
    }

    .highlight {
      color: #3C50E0;
      position: relative;
      display: inline-block;
    }

    .highlight::after {
      content: '';
      position: absolute;
      bottom: 8px;
      left: 0;
      right: 0;
      height: 12px;
      background: rgba(60, 80, 224, 0.15);
      z-index: -1;
      border-radius: 4px;
    }

    .hero-description {
      font-size: 18px;
      line-height: 1.7;
      color: #64748B;
      margin-bottom: 40px;
    }

    .hero-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-large {
      height: 56px;
      padding: 0 32px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 12px;
    }

    .btn-dark {
      background: #1C2434;
      color: white;
      border: none;
    }

    .btn-dark:hover {
      background: #0F1419;
      box-shadow: 0 8px 16px rgba(28, 36, 52, 0.2);
    }

    /* Features Section */
    .features {
      padding: 100px 32px;
      background: #F8FAFC;
    }

    .features-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-header {
      text-align: center;
      margin-bottom: 64px;
    }

    .section-label {
      font-size: 14px;
      font-weight: 600;
      color: #3C50E0;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 16px;
    }

    .section-header h2 {
      font-size: 40px;
      font-weight: 700;
      color: #1C2434;
      line-height: 1.3;
      max-width: 700px;
      margin: 0 auto;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
    }

    .feature-card {
      background: white;
      border: 1px solid #E2E8F0;
      border-radius: 16px;
      padding: 32px;
      transition: all 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(28, 36, 52, 0.08);
      border-color: #CBD5E1;
    }

    .feature-icon {
      width: 48px;
      height: 48px;
      background: #EFF6FF;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      color: #3C50E0;
    }

    .feature-card h3 {
      font-size: 18px;
      font-weight: 700;
      color: #1C2434;
      margin-bottom: 12px;
    }

    .feature-card p {
      font-size: 15px;
      color: #64748B;
      line-height: 1.6;
      margin: 0;
    }

    /* CTA Section */
    .cta {
      padding: 100px 32px;
      background: white;
    }

    .cta-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .cta-content {
      text-align: center;
      background: linear-gradient(135deg, #1C2434 0%, #2D3748 100%);
      padding: 64px 48px;
      border-radius: 24px;
      color: white;
    }

    .cta-content h2 {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 16px;
      line-height: 1.3;
    }

    .cta-content p {
      font-size: 18px;
      color: #DEE4EE;
      margin-bottom: 32px;
    }

    .cta-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
    }

    /* Footer */
    .footer {
      background: #1C2434;
      color: #DEE4EE;
      padding: 48px 32px;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
    }

    .footer-logo {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .footer-logo svg {
      color: #3C50E0;
    }

    .footer-logo span {
      font-size: 18px;
      font-weight: 700;
      color: white;
    }

    .footer-text {
      font-size: 14px;
      color: #8A99AF;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .features-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .nav-container {
        padding: 16px 24px;
      }

      .nav-right {
        gap: 12px;
      }

      .nav-link {
        display: none;
      }

      .hero {
        padding: 80px 24px 60px;
      }

      .hero-title {
        font-size: 40px;
      }

      .hero-description {
        font-size: 16px;
      }

      .features {
        padding: 60px 24px;
      }

      .section-header h2 {
        font-size: 32px;
      }

      .features-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .cta {
        padding: 60px 24px;
      }

      .cta-content {
        padding: 48px 32px;
      }

      .cta-content h2 {
        font-size: 28px;
      }
    }
  `]
})
export class HomeComponent {}
