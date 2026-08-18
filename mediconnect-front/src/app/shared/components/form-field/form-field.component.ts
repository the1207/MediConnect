import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="field-group form-field">
      <label>
        {{ label }}
        <span *ngIf="required" class="required-star">*</span>
      </label>
      <ng-content></ng-content>
      <div class="help" *ngIf="help">{{ help }}</div>
      <div class="error" *ngIf="control && control.invalid && (control.touched || control.dirty)">
        <div *ngIf="control.errors?.['required']">Ce champ est obligatoire.</div>
        <div *ngIf="control.errors?.['min']">Valeur trop petite.</div>
        <div *ngIf="control.errors?.['minlength']">Valeur trop courte.</div>
        <div *ngIf="control.errors?.['pattern']">Format invalide.</div>
      </div>
    </div>
  `,
  styles: [
    `:host { display: block; }
    .required-star { color: #b91c1c; margin-left: 6px; font-weight: 800; }
    .help { color: #64748b; margin-top: 6px; font-size: 0.9rem; }
    .error { color: #b91c1c; margin-top: 6px; font-size: 0.9rem; }
    `
  ]
})
export class FormFieldComponent {
  @Input() label = '';
  @Input() required = false;
  @Input() control?: AbstractControl | null;
  @Input() help?: string;
}
