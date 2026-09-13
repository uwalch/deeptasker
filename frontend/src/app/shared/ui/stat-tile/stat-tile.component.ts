import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/**
 * Kennzahlkachel: Label in Satzschreibung, dann der Wert.
 * Der Wert nutzt proportionale Ziffern - tabular-nums ist Spalten vorbehalten.
 */
@Component({
  selector: 'app-stat-tile',
  imports: [MatIconModule],
  template: `
    <div class="tile">
      <div class="tile__head">
        <mat-icon class="tile__icon" aria-hidden="true">{{ icon() }}</mat-icon>
        <span class="tile__label">{{ label() }}</span>
      </div>
      <p class="tile__value" [class.tile__value--hero]="hero()">{{ value() }}</p>
      @if (caption(); as text) {
        <p class="tile__caption">{{ text }}</p>
      }
    </div>
  `,
  styleUrl: './stat-tile.component.scss',
})
export class StatTileComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly icon = input('analytics');
  readonly caption = input<string | null>(null);
  /** Genau eine Kachel pro Ansicht darf die Leitzahl sein. */
  readonly hero = input(false);
}
