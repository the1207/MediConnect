import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-action-button',
  imports: [CommonModule],
  template: `
    <button type="button" class="action-btn" [ngClass]="variant" (click)="handleClick($event)" [attr.aria-label]="ariaLabel">
      <ng-container [ngSwitch]="variant">
        <svg *ngSwitchCase="'delete'" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon">
          <path d="M3 6h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M10 11v6M14 11v6M9 6V4h6v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg *ngSwitchCase="'edit'" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon">
          <path d="M3 21v-3.75L14.06 6.19a2 2 0 012.83 0l1.92 1.92a2 2 0 010 2.83L7.75 21H3z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M18 6l0 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg *ngSwitchCase="'view'" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon">
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg *ngSwitchDefault width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.2"/>
        </svg>
      </ng-container>
      <span *ngIf="label" class="label">{{ label }}</span>
    </button>
  `,
  styles: [
    ".action-btn { display: inline-flex; align-items: center; gap: .5rem; padding: .45rem .7rem; border-radius: .5rem; border: none; background: transparent; color: currentColor; cursor: pointer; }",
    ".action-btn .icon { display: inline-block; }",
    ".action-btn .label { font-weight: 600; font-size: .9rem; }",
    ".action-btn.delete { color: #dc2626; background: rgba(220,38,38,0.06); border-radius: .5rem; }",
    ".action-btn.edit { color: #2563eb; background: rgba(37,99,235,0.06); border-radius: .5rem; }",
    ".action-btn.view { color: #10b981; background: rgba(16,185,129,0.06); border-radius: .5rem; }",
    ".action-btn:focus { outline: 2px solid rgba(37,99,235,0.18); outline-offset: 2px; }",
  ]
})
export class ActionButtonComponent {
  @Input() variant: 'delete' | 'edit' | 'view' | 'default' = 'default';
  @Input() label?: string;
  @Input() ariaLabel?: string;
  @Output() action = new EventEmitter<Event>();

  handleClick(e: Event) {
    this.action.emit(e);
  }
}
