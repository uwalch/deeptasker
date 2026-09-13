import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/** Einheitliche Darstellung für "hier ist nichts" - Leerzustand wie Fehlerfall. */
@Component({
  selector: 'app-empty-state',
  imports: [MatIconModule],
  template: `
    <div class="empty" [class.empty--error]="tone() === 'error'">
      <mat-icon class="empty__icon" aria-hidden="true">{{ icon() }}</mat-icon>
      <p class="empty__title">{{ title() }}</p>
      @if (description(); as text) {
        <p class="empty__text">{{ text }}</p>
      }
      <ng-content />
    </div>
  `,
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  readonly icon = input('inbox');
  readonly title = input.required<string>();
  readonly description = input<string | null>(null);
  readonly tone = input<'neutral' | 'error'>('neutral');
}
