import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';
import { ConstanteService } from '../../../core/services/constante.service';
import { ConsultationService } from '../../../core/services/consultation.service';
import { AuthService } from '../../../core/services/auth.service';
import { Patient, Constante, ConsultationRequest } from '../../../core/models';

@Component({
  selector: 'app-consultation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="consultation-page">
      @if (loading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Chargement de la consultation...</p>
        </div>
      } @else if (patient()) {
        <!-- Page Header -->
        <div class="page-header">
          <button class="btn-back" (click)="goBack()" title="Retour">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15,18 9,12 15,6"/>
            </svg>
          </button>
          <div class="header-info">
            <h1>Consultation</h1>
            <div class="patient-summary">
              <span class="patient-name">{{ patient()!.prenom }} {{ patient()!.nom }}</span>
              <span class="separator">|</span>
              <span class="patient-detail">{{ calculateAge(patient()!.dateNaissance) }} ans</span>
              <span class="separator">|</span>
              <span class="patient-detail">{{ patient()!.sexe === 'M' ? 'Masculin' : 'Feminin' }}</span>
            </div>
          </div>
        </div>

        <!-- Alert Banner -->
        @if (derniereConstante()?.alerte) {
          <div class="alert-banner">
            <div class="alert-icon-wrapper">
              <svg class="pulse-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div class="alert-content">
              <strong>Alerte : Constantes anormales detectees</strong>
              <p>Une ou plusieurs constantes de ce patient depassent les seuils normaux. Veuillez examiner attentivement les valeurs ci-dessous.</p>
            </div>
          </div>
        }

        <!-- Main Content Grid -->
        <div class="content-grid">
          <!-- Left Column -->
          <div class="left-column">
            <!-- Patient Info Card -->
            <div class="card patient-info-card">
              <div class="card-header">
                <h3>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Informations Patient
                </h3>
              </div>
              <div class="card-body">
                <!-- Allergies -->
                <div class="info-row" [class.info-alert]="patient()!.allergies">
                  <div class="info-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    Allergies
                  </div>
                  <div class="info-value" [class.text-danger]="patient()!.allergies">
                    {{ patient()!.allergies || 'Aucune allergie connue' }}
                  </div>
                </div>

                <!-- Antecedents -->
                <div class="info-row">
                  <div class="info-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                    Antecedents
                  </div>
                  <div class="info-value">
                    {{ patient()!.antecedents || 'Aucun antecedent' }}
                  </div>
                </div>

                <!-- Groupe Sanguin -->
                <div class="info-row">
                  <div class="info-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                    </svg>
                    Groupe Sanguin
                  </div>
                  <div class="info-value">
                    @if (patient()!.groupeSanguin) {
                      <span class="badge badge-blood">{{ patient()!.groupeSanguin }}</span>
                    } @else {
                      Non renseigne
                    }
                  </div>
                </div>

                <!-- Contact -->
                <div class="info-row">
                  <div class="info-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    Contact
                  </div>
                  <div class="info-value">
                    {{ patient()!.contact || 'Non renseigne' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Latest Constantes Card -->
            <div class="card constantes-card">
              <div class="card-header">
                <h3>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                  Dernieres Constantes
                </h3>
                @if (derniereConstante()) {
                  <span class="card-header-meta">{{ formatDate(derniereConstante()!.date) }}</span>
                }
              </div>
              <div class="card-body">
                @if (derniereConstante()) {
                  <div class="constantes-grid">
                    <!-- Temperature -->
                    <div class="constante-item" [class.constante-alert]="derniereConstante()!.alerteTemperature">
                      <div class="constante-icon-box temperature">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>
                        </svg>
                      </div>
                      <div class="constante-details">
                        <span class="constante-label">Temperature</span>
                        <div class="constante-value-row">
                          <span class="constante-value" [class.value-alert]="derniereConstante()!.alerteTemperature">
                            {{ derniereConstante()!.temperature }}°C
                          </span>
                          @if (previousConstante()) {
                            <span class="trend-indicator" [class.trend-up]="derniereConstante()!.temperature > previousConstante()!.temperature"
                              [class.trend-down]="derniereConstante()!.temperature < previousConstante()!.temperature"
                              [class.trend-same]="derniereConstante()!.temperature === previousConstante()!.temperature">
                              {{ getTrendArrow(derniereConstante()!.temperature, previousConstante()!.temperature) }}
                            </span>
                          }
                        </div>
                      </div>
                      @if (derniereConstante()!.alerteTemperature) {
                        <span class="badge badge-danger">ALERTE</span>
                      }
                    </div>

                    <!-- Poids -->
                    <div class="constante-item" [class.constante-alert]="derniereConstante()!.alertePoids">
                      <div class="constante-icon-box poids">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="5" r="3"/>
                          <path d="M6.5 8a2 2 0 0 0-1.9 2.6l2.8 8.4a2 2 0 0 0 1.9 1.4h5.4a2 2 0 0 0 1.9-1.4l2.8-8.4A2 2 0 0 0 17.5 8"/>
                        </svg>
                      </div>
                      <div class="constante-details">
                        <span class="constante-label">Poids</span>
                        <div class="constante-value-row">
                          <span class="constante-value" [class.value-alert]="derniereConstante()!.alertePoids">
                            {{ derniereConstante()!.poids }} kg
                          </span>
                          @if (previousConstante()) {
                            <span class="trend-indicator" [class.trend-up]="derniereConstante()!.poids > previousConstante()!.poids"
                              [class.trend-down]="derniereConstante()!.poids < previousConstante()!.poids"
                              [class.trend-same]="derniereConstante()!.poids === previousConstante()!.poids">
                              {{ getTrendArrow(derniereConstante()!.poids, previousConstante()!.poids) }}
                            </span>
                          }
                        </div>
                      </div>
                      @if (derniereConstante()!.alertePoids) {
                        <span class="badge badge-danger">ALERTE</span>
                      }
                    </div>

                    <!-- Tension -->
                    <div class="constante-item" [class.constante-alert]="derniereConstante()!.alerteTension">
                      <div class="constante-icon-box tension">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                        </svg>
                      </div>
                      <div class="constante-details">
                        <span class="constante-label">Tension Arterielle</span>
                        <div class="constante-value-row">
                          <span class="constante-value" [class.value-alert]="derniereConstante()!.alerteTension">
                            {{ derniereConstante()!.tensionArteriel }} mmHg
                          </span>
                          @if (previousConstante()) {
                            <span class="trend-indicator trend-info">
                              {{ derniereConstante()!.tensionArteriel !== previousConstante()!.tensionArteriel ? '~' : '=' }}
                            </span>
                          }
                        </div>
                      </div>
                      @if (derniereConstante()!.alerteTension) {
                        <span class="badge badge-danger">ALERTE</span>
                      }
                    </div>
                  </div>

                  <div class="constante-footer">
                    <span>Prise par : <strong>{{ derniereConstante()!.infirmiereNom || 'Non renseigne' }}</strong></span>
                    @if (derniereConstante()!.motifVisite) {
                      <span class="separator-dot"></span>
                      <span>Motif : {{ derniereConstante()!.motifVisite }}</span>
                    }
                  </div>
                } @else {
                  <div class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                    <p>Aucune constante enregistree pour ce patient</p>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="right-column">
            <!-- Quick Stats -->
            <div class="card stats-card">
              <div class="card-header">
                <h3>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                  Statistiques
                </h3>
              </div>
              <div class="card-body stats-body">
                <div class="stat-item">
                  <div class="stat-value">{{ nombreVisites() }}</div>
                  <div class="stat-label">Visites totales</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value stat-date">{{ derniereVisiteDate() }}</div>
                  <div class="stat-label">Derniere visite</div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="card actions-card">
              <div class="card-header">
                <h3>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                  </svg>
                  Actions
                </h3>
              </div>
              <div class="card-body actions-body">
                <button class="action-btn action-historique" (click)="allerHistorique()">
                  <div class="action-btn-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                  </div>
                  <div class="action-btn-text">
                    <span class="action-btn-title">Historique</span>
                    <span class="action-btn-desc">Voir l'historique complet</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9,18 15,12 9,6"/>
                  </svg>
                </button>

                <button class="action-btn action-prescription" (click)="allerPrescription()">
                  <div class="action-btn-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="12" y1="18" x2="12" y2="12"/>
                      <line x1="9" y1="15" x2="15" y2="15"/>
                    </svg>
                  </div>
                  <div class="action-btn-text">
                    <span class="action-btn-title">Prescrire</span>
                    <span class="action-btn-desc">Rediger une ordonnance</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9,18 15,12 9,6"/>
                  </svg>
                </button>

                <button class="action-btn action-diagnostic" (click)="toggleDiagnostic()">
                  <div class="action-btn-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </div>
                  <div class="action-btn-text">
                    <span class="action-btn-title">Diagnostic</span>
                    <span class="action-btn-desc">Ecrire des notes / diagnostic</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    @if (showDiagnostic()) {
                      <polyline points="18,15 12,9 6,15"/>
                    } @else {
                      <polyline points="6,9 12,15 18,9"/>
                    }
                  </svg>
                </button>
              </div>
            </div>

            <!-- Diagnostic Section -->
            @if (showDiagnostic()) {
              <div class="card diagnostic-card">
                <div class="card-header">
                  <h3>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Notes & Diagnostic
                  </h3>
                </div>
                <div class="card-body">
                  <textarea
                    class="diagnostic-textarea"
                    [(ngModel)]="diagnosticNotes"
                    placeholder="Entrez vos notes de consultation, observations et diagnostic ici..."
                    rows="6"
                  ></textarea>
                  <div class="diagnostic-actions">
                    <button class="btn btn-primary" (click)="saveDiagnostic()" [disabled]="savingDiagnostic()">
                      @if (savingDiagnostic()) {
                        <span class="btn-spinner"></span>
                        Enregistrement...
                      } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                          <polyline points="17,21 17,13 7,13 7,21"/>
                          <polyline points="7,3 7,8 15,8"/>
                        </svg>
                        Enregistrer
                      }
                    </button>
                    @if (diagnosticSaved()) {
                      <span class="save-confirmation">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="20,6 9,17 4,12"/>
                        </svg>
                        Sauvegarde reussie
                      </span>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="error-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <p>Patient introuvable</p>
          <button class="btn btn-secondary" (click)="goBack()">Retour a la liste</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .consultation-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.5rem;
    }

    /* ===== Page Header ===== */
    .page-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--gray-200, #e5e7eb);
    }

    .btn-back {
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--white, #ffffff);
      border: 1px solid var(--gray-200, #e5e7eb);
      border-radius: 0.625rem;
      cursor: pointer;
      color: var(--gray-600, #4b5563);
      transition: all 0.2s ease;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .btn-back:hover {
      background: var(--gray-50, #f9fafb);
      color: var(--gray-900, #111827);
      border-color: var(--gray-300, #d1d5db);
    }

    .header-info h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--gray-900, #111827);
      margin: 0 0 0.25rem 0;
      line-height: 1.3;
    }

    .patient-summary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .patient-name {
      font-weight: 600;
      color: var(--blue-600, #2563eb);
      font-size: 0.9375rem;
    }

    .separator {
      color: var(--gray-300, #d1d5db);
    }

    .patient-detail {
      color: var(--gray-500, #6b7280);
      font-size: 0.875rem;
    }

    /* ===== Alert Banner ===== */
    .alert-banner {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem 1.25rem;
      background: var(--red-600, #dc2626);
      border-radius: 0.75rem;
      margin-bottom: 1.5rem;
      color: white;
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    }

    .alert-icon-wrapper {
      flex-shrink: 0;
      margin-top: 0.125rem;
    }

    .pulse-icon {
      animation: pulse-animation 1.5s ease-in-out infinite;
    }

    @keyframes pulse-animation {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.1); }
    }

    .alert-content strong {
      display: block;
      font-size: 0.9375rem;
      margin-bottom: 0.25rem;
    }

    .alert-content p {
      font-size: 0.8125rem;
      margin: 0;
      opacity: 0.9;
    }

    /* ===== Content Grid ===== */
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    /* ===== Card Base ===== */
    .card {
      background: var(--white, #ffffff);
      border: 1px solid var(--gray-200, #e5e7eb);
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--gray-100, #f3f4f6);
    }

    .card-header h3 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--gray-800, #1f2937);
      margin: 0;
    }

    .card-header-meta {
      font-size: 0.75rem;
      color: var(--gray-500, #6b7280);
      background: var(--gray-50, #f9fafb);
      padding: 0.25rem 0.625rem;
      border-radius: 1rem;
    }

    .card-body {
      padding: 1.25rem;
    }

    /* ===== Patient Info Card ===== */
    .patient-info-card {
      margin-bottom: 1.5rem;
    }

    .info-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--gray-50, #f9fafb);
    }

    .info-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .info-row:first-child {
      padding-top: 0;
    }

    .info-row.info-alert {
      background: var(--red-50, #fef2f2);
      margin: 0 -1.25rem;
      padding: 0.75rem 1.25rem;
      border-radius: 0.5rem;
    }

    .info-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--gray-500, #6b7280);
      min-width: 120px;
    }

    .info-value {
      font-size: 0.875rem;
      color: var(--gray-800, #1f2937);
      font-weight: 500;
      text-align: right;
    }

    .info-value.text-danger {
      color: var(--red-600, #dc2626);
      font-weight: 600;
    }

    .badge-blood {
      background: var(--red-100, #fee2e2);
      color: var(--red-700, #b91c1c);
      padding: 0.2rem 0.6rem;
      border-radius: 0.375rem;
      font-size: 0.8125rem;
      font-weight: 700;
    }

    /* ===== Constantes Card ===== */
    .constantes-grid {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .constante-item {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      padding: 0.875rem;
      border-radius: 0.625rem;
      background: var(--gray-50, #f9fafb);
      border: 1px solid var(--gray-100, #f3f4f6);
      transition: all 0.2s ease;
    }

    .constante-item.constante-alert {
      background: var(--red-50, #fef2f2);
      border-color: var(--red-200, #fecaca);
    }

    .constante-icon-box {
      width: 44px;
      height: 44px;
      border-radius: 0.625rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .constante-icon-box.temperature {
      background: #fef3c7;
      color: #d97706;
    }

    .constante-icon-box.poids {
      background: #dbeafe;
      color: #2563eb;
    }

    .constante-icon-box.tension {
      background: #fce7f3;
      color: #db2777;
    }

    .constante-details {
      flex: 1;
    }

    .constante-label {
      display: block;
      font-size: 0.75rem;
      color: var(--gray-500, #6b7280);
      margin-bottom: 0.125rem;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      font-weight: 500;
    }

    .constante-value-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .constante-value {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--gray-900, #111827);
    }

    .constante-value.value-alert {
      color: var(--red-600, #dc2626);
    }

    .trend-indicator {
      font-size: 1rem;
      font-weight: 700;
      line-height: 1;
    }

    .trend-indicator.trend-up {
      color: var(--red-500, #ef4444);
    }

    .trend-indicator.trend-down {
      color: var(--blue-500, #3b82f6);
    }

    .trend-indicator.trend-same {
      color: var(--gray-400, #9ca3af);
    }

    .trend-indicator.trend-info {
      color: var(--gray-400, #9ca3af);
    }

    .badge {
      font-size: 0.6875rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 0.25rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge-danger {
      background: var(--red-100, #fee2e2);
      color: var(--red-700, #b91c1c);
    }

    .constante-footer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--gray-100, #f3f4f6);
      font-size: 0.8125rem;
      color: var(--gray-500, #6b7280);
      flex-wrap: wrap;
    }

    .separator-dot::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 4px;
      background: var(--gray-300, #d1d5db);
      border-radius: 50%;
    }

    /* ===== Stats Card ===== */
    .stats-card {
      margin-bottom: 1.5rem;
    }

    .stats-body {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .stat-item {
      text-align: center;
      padding: 0.75rem;
      background: var(--gray-50, #f9fafb);
      border-radius: 0.5rem;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--blue-600, #2563eb);
      margin-bottom: 0.25rem;
    }

    .stat-value.stat-date {
      font-size: 0.875rem;
      color: var(--gray-700, #374151);
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--gray-500, #6b7280);
      text-transform: uppercase;
      letter-spacing: 0.03em;
      font-weight: 500;
    }

    /* ===== Actions Card ===== */
    .actions-card {
      margin-bottom: 1.5rem;
    }

    .actions-body {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.75rem !important;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem;
      background: var(--white, #ffffff);
      border: 1px solid var(--gray-200, #e5e7eb);
      border-radius: 0.625rem;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
    }

    .action-btn:hover {
      border-color: var(--blue-200, #bfdbfe);
      background: var(--blue-50, #eff6ff);
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);
    }

    .action-btn-icon {
      width: 38px;
      height: 38px;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .action-historique .action-btn-icon {
      background: var(--blue-50, #eff6ff);
      color: var(--blue-600, #2563eb);
    }

    .action-prescription .action-btn-icon {
      background: var(--green-50, #f0fdf4);
      color: var(--green-600, #16a34a);
    }

    .action-diagnostic .action-btn-icon {
      background: #fef3c7;
      color: #d97706;
    }

    .action-btn-text {
      flex: 1;
    }

    .action-btn-title {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--gray-800, #1f2937);
    }

    .action-btn-desc {
      display: block;
      font-size: 0.75rem;
      color: var(--gray-500, #6b7280);
      margin-top: 0.125rem;
    }

    .action-btn > svg:last-child {
      color: var(--gray-400, #9ca3af);
      flex-shrink: 0;
    }

    /* ===== Diagnostic Card ===== */
    .diagnostic-card {
      animation: slideDown 0.2s ease-out;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .diagnostic-textarea {
      width: 100%;
      min-height: 150px;
      padding: 0.875rem;
      border: 1px solid var(--gray-200, #e5e7eb);
      border-radius: 0.625rem;
      font-size: 0.875rem;
      font-family: inherit;
      color: var(--gray-800, #1f2937);
      resize: vertical;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      line-height: 1.6;
    }

    .diagnostic-textarea:focus {
      outline: none;
      border-color: var(--blue-400, #60a5fa);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .diagnostic-textarea::placeholder {
      color: var(--gray-400, #9ca3af);
    }

    .diagnostic-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 0.875rem;
    }

    /* ===== Buttons ===== */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      font-size: 0.875rem;
      font-weight: 600;
      border-radius: 0.5rem;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: var(--blue-600, #2563eb);
      color: white;
      box-shadow: 0 1px 3px rgba(37, 99, 235, 0.3);
    }

    .btn-primary:hover {
      background: var(--blue-700, #1d4ed8);
      box-shadow: 0 2px 6px rgba(37, 99, 235, 0.4);
    }

    .btn-primary:disabled {
      background: var(--gray-300, #d1d5db);
      box-shadow: none;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: var(--gray-100, #f3f4f6);
      color: var(--gray-700, #374151);
      border: 1px solid var(--gray-200, #e5e7eb);
    }

    .btn-secondary:hover {
      background: var(--gray-200, #e5e7eb);
    }

    .btn-spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    .save-confirmation {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.8125rem;
      color: var(--green-600, #16a34a);
      font-weight: 500;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* ===== Empty State ===== */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2.5rem 1rem;
      text-align: center;
      color: var(--gray-400, #9ca3af);
    }

    .empty-state svg {
      margin-bottom: 0.75rem;
    }

    .empty-state p {
      font-size: 0.875rem;
      margin: 0;
    }

    /* ===== Loading / Error States ===== */
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 5rem 2rem;
      color: var(--gray-500, #6b7280);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--gray-200, #e5e7eb);
      border-top-color: var(--blue-600, #2563eb);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 5rem 2rem;
      color: var(--gray-400, #9ca3af);
      text-align: center;
    }

    .error-state svg {
      margin-bottom: 1rem;
    }

    .error-state p {
      font-size: 1.125rem;
      font-weight: 500;
      color: var(--gray-600, #4b5563);
      margin-bottom: 1.5rem;
    }

    /* ===== Responsive ===== */
    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .consultation-page {
        padding: 1rem;
      }

      .page-header {
        margin-bottom: 1rem;
        padding-bottom: 1rem;
      }

      .header-info h1 {
        font-size: 1.25rem;
      }

      .patient-summary {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
      }

      .separator {
        display: none;
      }

      .stats-body {
        grid-template-columns: 1fr;
      }

      .info-row {
        flex-direction: column;
        gap: 0.25rem;
      }

      .info-value {
        text-align: left;
      }
    }
  `]
})
export class ConsultationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private patientService = inject(PatientService);
  private constanteService = inject(ConstanteService);
  private consultationService = inject(ConsultationService);
  private authService = inject(AuthService);

  patient = signal<Patient | null>(null);
  constantes = signal<Constante[]>([]);
  derniereConstante = signal<Constante | null>(null);
  previousConstante = signal<Constante | null>(null);
  loading = signal<boolean>(true);
  showDiagnostic = signal<boolean>(false);
  savingDiagnostic = signal<boolean>(false);
  diagnosticSaved = signal<boolean>(false);
  diagnosticNotes: string = '';

  nombreVisites = computed(() => this.constantes().length);
  derniereVisiteDate = computed(() => {
    const list = this.constantes();
    if (list.length === 0) return 'Aucune';
    const derniere = list[list.length - 1];
    const date = new Date(derniere.date);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  });

  ngOnInit(): void {
    const patientId = Number(this.route.snapshot.paramMap.get('patientId'));
    if (patientId) {
      this.loadPatient(patientId);
      this.loadConstantes(patientId);
    } else {
      this.loading.set(false);
    }
  }

  loadPatient(id: number): void {
    this.patientService.getById(id).subscribe({
      next: (patient) => {
        this.patient.set(patient);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  loadConstantes(patientId: number): void {
    this.constanteService.getByPatient(patientId).subscribe({
      next: (constantes) => {
        this.constantes.set(constantes);
        if (constantes.length > 0) {
          this.derniereConstante.set(constantes[constantes.length - 1]);
          if (constantes.length > 1) {
            this.previousConstante.set(constantes[constantes.length - 2]);
          }
        }
      }
    });
  }

  getTrendArrow(current: number, previous: number): string {
    if (current > previous) return '↑';
    if (current < previous) return '↓';
    return '=';
  }

  toggleDiagnostic(): void {
    this.showDiagnostic.update(v => !v);
  }

  saveDiagnostic(): void {
    if (!this.diagnosticNotes.trim() || !this.patient()) return;
    this.savingDiagnostic.set(true);
    this.diagnosticSaved.set(false);

    const request: ConsultationRequest = {
      motif: 'Consultation',
      actionsRequis: this.diagnosticNotes,
      medecinId: Number(this.authService.currentMedecinId()),
      patientId: this.patient()!.id
    };

    this.consultationService.create(request).subscribe({
      next: () => {
        this.savingDiagnostic.set(false);
        this.diagnosticSaved.set(true);
        setTimeout(() => this.diagnosticSaved.set(false), 3000);
      },
      error: () => this.savingDiagnostic.set(false)
    });
  }

  allerPrescription(): void {
    this.router.navigate(['/medecin/prescription', this.patient()!.id]);
  }

  allerHistorique(): void {
    this.router.navigate(['/medecin/historique', this.patient()!.id]);
  }

  goBack(): void {
    this.router.navigate(['/medecin/patients']);
  }

  calculateAge(dateNaissance: Date): number {
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
