import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultationService } from '../../../services/consultation.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-consultation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Consultation</h2>
    <div class="status-box" *ngIf="message()" [ngClass]="messageType()">
      {{ message() }}
    </div>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <label>Motif</label>
      <input formControlName="motif" />
      <label>Actions requises</label>
      <textarea formControlName="actionsRequis"></textarea>
      <div class="actions">
        <button type="button" (click)="imprimerActions()" [disabled]="!canPrintActions()">
          Imprimer actions requises
        </button>
        <button type="submit" [disabled]="form.invalid || loading()">
          {{ loading() ? 'Enregistrement...' : 'Valider et passer à la prescription' }}
        </button>
      </div>
    </form>
  `,
  styles: [`.status-box { margin: 12px 0; padding: 12px 14px; border-radius: 10px; font-weight: 600; } .status-box.success { background:#dcfce7; color:#166534; border:1px solid #86efac; } .status-box.error { background:#fee2e2; color:#991b1b; border:1px solid #fca5a5; } .status-box.info { background:#dbeafe; color:#1d4ed8; border:1px solid #93c5fd; } input, textarea { display: block; width: 100%; margin-bottom: 12px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; } button { padding: 12px 18px; border: none; border-radius: 8px; background: #2563eb; color: white; cursor: pointer; }`]
})
export class ConsultationFormComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private consultationService = inject(ConsultationService);
  private auth = inject(AuthService);

  patientId = Number(this.route.snapshot.paramMap.get('patientId'));
  medecinId = this.auth.medecinId();
  loading = signal(false);
  message = signal('');
  messageType = signal<'success' | 'error' | 'info'>('info');

  form = this.fb.group({
    motif: ['', Validators.required],
    actionsRequis: ['']
  });

  submit() {
    if (this.form.invalid || !this.medecinId) return;
    this.loading.set(true);
    this.message.set('Création de la consultation en cours...');
    this.messageType.set('info');
    this.consultationService.create({
      motif: this.form.value.motif!,
      actionsRequis: this.form.value.actionsRequis ?? undefined,
      medecinId: this.medecinId,
      patientId: this.patientId
    }).subscribe({
      next: (c) => {
        this.loading.set(false);
        this.message.set('Consultation créée avec succès.');
        this.messageType.set('success');
        this.router.navigate(['/medecin/ordonnance', c.id], { queryParams: { patientId: this.patientId } });
      },
      error: () => {
        this.loading.set(false);
        this.message.set('Erreur lors de la création de la consultation.');
        this.messageType.set('error');
      }
    });
  }

  canPrintActions() {
    return !!this.form.value.actionsRequis?.trim();
  }

  imprimerActions() {
    const actions = this.form.value.actionsRequis?.trim();
    if (!actions) return;

    const contenu = `Actions requises :\n\n${actions}`;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<pre>${contenu}</pre>`);
    w.document.close();
    w.print();
  }
}
