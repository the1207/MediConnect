import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdonnanceService } from '../../../core/services/ordonnance.service';
import { Ordonnance } from '../../../core/models';

@Component({
  selector: 'app-ordonnance-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ordonnance-detail-page">
      @if (ordonnance()) {
        <!-- Page Header -->
        <div class="page-header no-print">
          <div class="header-left">
            <button class="btn-back" (click)="goBack()">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15,18 9,12 15,6"/>
              </svg>
            </button>
            <div class="header-title-group">
              <h1 class="page-title">Ordonnance #{{ ordonnance()!.id }}</h1>
              <p class="page-subtitle">{{ ordonnance()!.patientPrenom }} {{ ordonnance()!.patientNom }}</p>
            </div>
          </div>
          <span class="statut-badge" [ngClass]="{
            'statut-redigee': ordonnance()!.statut === 'REDIGEE',
            'statut-validee': ordonnance()!.statut === 'VALIDEE',
            'statut-imprimee': ordonnance()!.statut === 'IMPRIMEE'
          }">
            <span class="statut-dot"></span>
            {{ ordonnance()!.statut }}
          </span>
        </div>

        <!-- Success Alert -->
        @if (success()) {
          <div class="alert-success no-print">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
            <span>{{ success() }}</span>
          </div>
        }

        <!-- Patient Info Card -->
        <div class="info-card no-print">
          <div class="info-card-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Informations Patient</span>
          </div>
          <div class="info-card-body">
            <div class="info-item">
              <span class="info-label">Nom complet</span>
              <span class="info-value">{{ ordonnance()!.patientPrenom }} {{ ordonnance()!.patientNom }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Date de prescription</span>
              <span class="info-value">{{ formatDate(ordonnance()!.dateCreation) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Medecin traitant</span>
              <span class="info-value">Dr. {{ ordonnance()!.medecinNom || 'Non renseigne' }}</span>
            </div>
          </div>
        </div>

        <!-- Medicaments Table Card -->
        <div class="table-card no-print">
          <div class="table-card-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.5 1.5H8A6.5 6.5 0 0 0 8 14.5h1.5"/>
              <path d="M13.5 1.5H16A6.5 6.5 0 0 1 16 14.5h-1.5"/>
              <line x1="8" y1="8" x2="16" y2="8"/>
            </svg>
            <span>Medicaments prescrits</span>
            <span class="table-count">{{ ordonnance()!.medicaments.length }} medicament(s)</span>
          </div>
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="th-num">#</th>
                  <th>Nom du medicament</th>
                  <th>Posologie</th>
                  <th>Duree du traitement</th>
                </tr>
              </thead>
              <tbody>
                @for (med of ordonnance()!.medicaments; track med.id; let i = $index) {
                  <tr>
                    <td class="td-num">{{ i + 1 }}</td>
                    <td class="td-name">{{ med.nom }}</td>
                    <td class="td-posologie">{{ med.posologie }}</td>
                    <td class="td-duree">{{ med.dureeTraitement }} jours</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Commentaire Section -->
        @if (ordonnance()!.commentaire) {
          <div class="commentaire-card no-print">
            <div class="commentaire-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span>Commentaire</span>
            </div>
            <div class="commentaire-body">
              <p>{{ ordonnance()!.commentaire }}</p>
            </div>
          </div>
        }

        <!-- Action Buttons -->
        <div class="actions-bar no-print">
          @if (ordonnance()!.statut === 'REDIGEE') {
            <button class="btn btn-success" (click)="valider()" [disabled]="loading()">
              @if (loading()) {
                <span class="btn-spinner"></span>
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
              }
              Valider
            </button>
          }

          @if (ordonnance()!.statut === 'VALIDEE') {
            <button class="btn btn-primary" (click)="imprimer()">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6,9 6,2 18,2 18,9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              Imprimer
            </button>
          }

          @if (ordonnance()!.statut === 'IMPRIMEE') {
            <button class="btn btn-outline" (click)="imprimer()">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6,9 6,2 18,2 18,9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              Reimprimer
            </button>
          }

          <button class="btn btn-warning" (click)="renouveler()">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23,4 23,10 17,10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Renouveler
          </button>
        </div>

        <!-- Print Layout (visible only when printing) -->
        <div class="print-layout">
          <div class="print-header">
            <div class="print-logo">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
              <span>Mediconnect</span>
            </div>
            <h2 class="print-title">ORDONNANCE MEDICALE</h2>
            <div class="print-separator"></div>
          </div>

          <div class="print-info">
            <div class="print-info-row">
              <span class="print-info-label">Patient :</span>
              <span class="print-info-value">{{ ordonnance()!.patientPrenom }} {{ ordonnance()!.patientNom }}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Medecin :</span>
              <span class="print-info-value">Dr. {{ ordonnance()!.medecinNom || 'Non renseigne' }}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Date :</span>
              <span class="print-info-value">{{ formatDate(ordonnance()!.dateCreation) }}</span>
            </div>
          </div>

          <div class="print-medications">
            <h3>Prescription</h3>
            <table class="print-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Medicament</th>
                  <th>Posologie</th>
                  <th>Duree</th>
                </tr>
              </thead>
              <tbody>
                @for (med of ordonnance()!.medicaments; track med.id; let i = $index) {
                  <tr>
                    <td>{{ i + 1 }}</td>
                    <td>{{ med.nom }}</td>
                    <td>{{ med.posologie }}</td>
                    <td>{{ med.dureeTraitement }} jours</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          @if (ordonnance()!.commentaire) {
            <div class="print-commentaire">
              <h3>Observations</h3>
              <p>{{ ordonnance()!.commentaire }}</p>
            </div>
          }

          <div class="print-signature">
            <div class="signature-block">
              <div class="signature-line"></div>
              <span>Signature du medecin</span>
            </div>
          </div>
        </div>

      } @else {
        <!-- Loading State -->
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Chargement de l'ordonnance...</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .ordonnance-detail-page {
      max-width: 900px;
      margin: 0 auto;
      padding: 1.5rem;
    }

    /* ===== Page Header ===== */
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--gray-200);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .btn-back {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--white, #ffffff);
      border: 1px solid var(--gray-200);
      border-radius: 8px;
      cursor: pointer;
      color: var(--gray-600);
      transition: all 0.2s ease;
    }

    .btn-back:hover {
      background: var(--gray-50);
      border-color: var(--gray-300);
      color: var(--gray-900);
    }

    .header-title-group h1.page-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--gray-900);
      margin: 0 0 0.25rem 0;
      line-height: 1.3;
    }

    .header-title-group .page-subtitle {
      font-size: 0.875rem;
      color: var(--gray-500);
      margin: 0;
    }

    /* ===== Status Badge ===== */
    .statut-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.375rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .statut-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .statut-redigee {
      background: var(--yellow-50, #fffbeb);
      color: var(--yellow-700, #b45309);
      border: 1px solid var(--yellow-200, #fde68a);
    }

    .statut-redigee .statut-dot {
      background: var(--yellow-500, #f59e0b);
    }

    .statut-validee {
      background: var(--blue-50, #eff6ff);
      color: var(--blue-700, #1d4ed8);
      border: 1px solid var(--blue-200, #bfdbfe);
    }

    .statut-validee .statut-dot {
      background: var(--blue-500, #3b82f6);
    }

    .statut-imprimee {
      background: var(--green-50, #f0fdf4);
      color: var(--green-700, #15803d);
      border: 1px solid var(--green-200, #bbf7d0);
    }

    .statut-imprimee .statut-dot {
      background: var(--green-500, #22c55e);
    }

    /* ===== Success Alert ===== */
    .alert-success {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      background: var(--green-50, #f0fdf4);
      border: 1px solid var(--green-200, #bbf7d0);
      border-radius: 10px;
      margin-bottom: 1.5rem;
      color: var(--green-700, #15803d);
      font-size: 0.875rem;
      font-weight: 500;
    }

    /* ===== Info Card ===== */
    .info-card {
      background: var(--white, #ffffff);
      border: 1px solid var(--gray-200);
      border-radius: 12px;
      margin-bottom: 1.5rem;
      overflow: hidden;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .info-card-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 1.5rem;
      background: var(--gray-50);
      border-bottom: 1px solid var(--gray-200);
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--gray-700);
    }

    .info-card-header svg {
      color: var(--blue-500, #3b82f6);
    }

    .info-card-body {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      padding: 1.25rem 1.5rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .info-label {
      font-size: 0.75rem;
      color: var(--gray-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 500;
    }

    .info-value {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--gray-900);
    }

    /* ===== Table Card ===== */
    .table-card {
      background: var(--white, #ffffff);
      border: 1px solid var(--gray-200);
      border-radius: 12px;
      margin-bottom: 1.5rem;
      overflow: hidden;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .table-card-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 1.5rem;
      background: var(--gray-50);
      border-bottom: 1px solid var(--gray-200);
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--gray-700);
    }

    .table-card-header svg {
      color: var(--blue-500, #3b82f6);
    }

    .table-count {
      margin-left: auto;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--gray-400);
      background: var(--gray-100);
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table thead tr {
      background: var(--gray-50);
      border-bottom: 1px solid var(--gray-200);
    }

    .data-table th {
      padding: 0.75rem 1.25rem;
      text-align: left;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--gray-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
    }

    .data-table th.th-num {
      width: 50px;
      text-align: center;
    }

    .data-table td {
      padding: 1rem 1.25rem;
      font-size: 0.875rem;
      color: var(--gray-700);
      border-bottom: 1px solid var(--gray-100);
    }

    .data-table tbody tr:last-child td {
      border-bottom: none;
    }

    .data-table tbody tr:hover {
      background: var(--gray-50);
    }

    .data-table td.td-num {
      text-align: center;
      font-weight: 600;
      color: var(--blue-600, #2563eb);
    }

    .data-table td.td-name {
      font-weight: 600;
      color: var(--gray-900);
    }

    .data-table td.td-posologie {
      color: var(--gray-600);
    }

    .data-table td.td-duree {
      color: var(--gray-600);
      white-space: nowrap;
    }

    /* ===== Commentaire Card ===== */
    .commentaire-card {
      background: var(--white, #ffffff);
      border: 1px solid var(--gray-200);
      border-radius: 12px;
      margin-bottom: 1.5rem;
      overflow: hidden;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .commentaire-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 1.5rem;
      background: var(--gray-50);
      border-bottom: 1px solid var(--gray-200);
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--gray-700);
    }

    .commentaire-header svg {
      color: var(--blue-500, #3b82f6);
    }

    .commentaire-body {
      padding: 1.25rem 1.5rem;
    }

    .commentaire-body p {
      margin: 0;
      font-size: 0.875rem;
      color: var(--gray-700);
      line-height: 1.6;
    }

    /* ===== Action Buttons ===== */
    .actions-bar {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1.25rem 1.5rem;
      background: var(--white, #ffffff);
      border: 1px solid var(--gray-200);
      border-radius: 12px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: var(--blue-600, #2563eb);
      color: #ffffff;
    }

    .btn-primary:hover:not(:disabled) {
      background: var(--blue-700, #1d4ed8);
      box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
    }

    .btn-success {
      background: var(--green-600, #16a34a);
      color: #ffffff;
    }

    .btn-success:hover:not(:disabled) {
      background: var(--green-700, #15803d);
      box-shadow: 0 4px 6px -1px rgba(22, 163, 74, 0.3);
    }

    .btn-warning {
      background: var(--yellow-500, #f59e0b);
      color: #ffffff;
    }

    .btn-warning:hover:not(:disabled) {
      background: var(--yellow-600, #d97706);
      box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.3);
    }

    .btn-outline {
      background: var(--white, #ffffff);
      color: var(--gray-700);
      border: 1px solid var(--gray-300);
    }

    .btn-outline:hover:not(:disabled) {
      background: var(--gray-50);
      border-color: var(--gray-400);
    }

    .btn-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    /* ===== Loading State ===== */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 5rem 2rem;
      color: var(--gray-500);
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--gray-200);
      border-top-color: var(--blue-500, #3b82f6);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 1rem;
    }

    .loading-container p {
      font-size: 0.875rem;
      color: var(--gray-500);
      margin: 0;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* ===== Print Layout (hidden on screen) ===== */
    .print-layout {
      display: none;
    }

    /* ===== Responsive ===== */
    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .info-card-body {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .actions-bar {
        flex-wrap: wrap;
        justify-content: center;
      }

      .data-table th,
      .data-table td {
        padding: 0.75rem;
      }
    }

    /* ===== Print Styles ===== */
    @media print {
      .ordonnance-detail-page {
        padding: 0;
        max-width: 100%;
      }

      .no-print {
        display: none !important;
      }

      .print-layout {
        display: block !important;
        padding: 15mm;
        font-family: 'Times New Roman', serif;
      }

      .print-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .print-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
        color: #1e40af;
      }

      .print-logo span {
        font-size: 1.25rem;
        font-weight: 700;
      }

      .print-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #111827;
        letter-spacing: 0.1em;
        margin: 0.5rem 0 1rem 0;
      }

      .print-separator {
        width: 100%;
        height: 2px;
        background: #111827;
        margin: 0 auto;
      }

      .print-info {
        margin-bottom: 2rem;
        padding: 1rem 0;
      }

      .print-info-row {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        font-size: 1rem;
      }

      .print-info-label {
        font-weight: 700;
        color: #111827;
        min-width: 80px;
      }

      .print-info-value {
        color: #374151;
      }

      .print-medications {
        margin-bottom: 2rem;
      }

      .print-medications h3 {
        font-size: 1.1rem;
        font-weight: 700;
        margin-bottom: 0.75rem;
        color: #111827;
        border-bottom: 1px solid #d1d5db;
        padding-bottom: 0.5rem;
      }

      .print-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 1rem;
      }

      .print-table th {
        text-align: left;
        padding: 0.5rem 0.75rem;
        font-size: 0.85rem;
        font-weight: 700;
        color: #111827;
        border-bottom: 2px solid #374151;
      }

      .print-table td {
        padding: 0.625rem 0.75rem;
        font-size: 0.9rem;
        color: #374151;
        border-bottom: 1px solid #e5e7eb;
      }

      .print-commentaire {
        margin-bottom: 2rem;
      }

      .print-commentaire h3 {
        font-size: 1.1rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: #111827;
        border-bottom: 1px solid #d1d5db;
        padding-bottom: 0.5rem;
      }

      .print-commentaire p {
        font-size: 0.9rem;
        color: #374151;
        line-height: 1.6;
        margin: 0;
      }

      .print-signature {
        margin-top: 4rem;
        display: flex;
        justify-content: flex-end;
      }

      .signature-block {
        text-align: center;
        width: 200px;
      }

      .signature-block .signature-line {
        width: 100%;
        height: 1px;
        background: #374151;
        margin-bottom: 0.5rem;
        margin-top: 3rem;
      }

      .signature-block span {
        font-size: 0.8rem;
        color: #6b7280;
      }
    }
  `]
})
export class OrdonnanceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ordonnanceService = inject(OrdonnanceService);

  ordonnance = signal<Ordonnance | null>(null);
  loading = signal(false);
  success = signal<string | null>(null);

  ngOnInit(): void {
    const ordonnanceId = Number(this.route.snapshot.paramMap.get('ordonnanceId'));
    this.loadOrdonnance(ordonnanceId);
  }

  loadOrdonnance(id: number): void {
    this.ordonnanceService.getById(id).subscribe({
      next: (ordonnance) => this.ordonnance.set(ordonnance)
    });
  }

  valider(): void {
    if (!this.ordonnance()) return;

    this.loading.set(true);
    this.ordonnanceService.valider(this.ordonnance()!.id).subscribe({
      next: (ordonnance) => {
        this.ordonnance.set(ordonnance);
        this.loading.set(false);
        this.success.set('Ordonnance validee avec succes');
        setTimeout(() => this.success.set(null), 3000);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  imprimer(): void {
    if (!this.ordonnance()) return;

    if (this.ordonnance()!.statut === 'VALIDEE') {
      this.ordonnanceService.marquerImprimee(this.ordonnance()!.id).subscribe({
        next: (ordonnance) => {
          this.ordonnance.set(ordonnance);
          window.print();
        }
      });
    } else {
      window.print();
    }
  }

  renouveler(): void {
    if (!this.ordonnance()) return;
    this.router.navigate(
      ['/medecin/prescription', this.ordonnance()!.patientId],
      { queryParams: { renew: this.ordonnance()!.id } }
    );
  }

  goBack(): void {
    if (this.ordonnance()) {
      this.router.navigate(['/medecin/historique', this.ordonnance()!.patientId]);
    } else {
      this.router.navigate(['/medecin/patients']);
    }
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
}
