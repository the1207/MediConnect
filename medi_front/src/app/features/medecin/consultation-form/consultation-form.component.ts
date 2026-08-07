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
  styles: [`input, textarea { display: block; width: 100%; margin-bottom: 12px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; } button { padding: 12px 18px; border: none; border-radius: 8px; background: #2563eb; color: white; cursor: pointer; }`]
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

  form = this.fb.group({
    motif: ['', Validators.required],
    actionsRequis: ['']
  });

  submit() {
    if (this.form.invalid || !this.medecinId) return;
    this.loading.set(true);
    this.consultationService.create({
      motif: this.form.value.motif!,
      actionsRequis: this.form.value.actionsRequis ?? undefined,
      medecinId: this.medecinId,
      patientId: this.patientId
    }).subscribe({
      next: (c) => {
        this.loading.set(false);
        this.router.navigate(['/medecin/ordonnance', c.id], { queryParams: { patientId: this.patientId } });
      },
      error: () => this.loading.set(false)
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
