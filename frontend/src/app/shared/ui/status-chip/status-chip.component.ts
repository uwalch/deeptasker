import { Component, computed, input } from '@angular/core';

import { TASK_STATUS_LABELS, TaskStatus } from '../../../core/models/task';

/**
 * Statusanzeige mit Farbe UND Text - die Farbe trägt die Bedeutung nie allein.
 * Die Farben sind die kategorialen Slots aus styles.scss.
 */
@Component({
  selector: 'app-status-chip',
  template: `
    <span class="chip" [style.--chip-color]="color()">
      <span class="chip__dot" aria-hidden="true"></span>
      {{ label() }}
    </span>
  `,
  styleUrl: './status-chip.component.scss',
})
export class StatusChipComponent {
  readonly status = input.required<TaskStatus>();

  protected readonly label = computed(() => TASK_STATUS_LABELS[this.status()]);
  protected readonly color = computed(
    () =>
      ({
        offen: 'var(--dt-series-offen)',
        in_arbeit: 'var(--dt-series-arbeit)',
        erledigt: 'var(--dt-series-erledigt)',
      })[this.status()],
  );
}
