import { Component, computed, input } from '@angular/core';

import { TASK_STATUS_LABELS, TaskStatus } from '../../../core/models/task';

interface Segment {
  readonly status: TaskStatus;
  readonly label: string;
  readonly count: number;
  readonly percent: number;
  readonly color: string;
}

const SERIES_COLOR: Record<TaskStatus, string> = {
  offen: 'var(--dt-series-offen)',
  in_arbeit: 'var(--dt-series-arbeit)',
  erledigt: 'var(--dt-series-erledigt)',
};

/**
 * Anteilsdarstellung als einzelner gestapelter Balken.
 * Legende immer sichtbar, weil Farbe die Identität nie allein trägt; zusätzlich
 * eine Tabelle für Screenreader. Segmente sind durch eine 2px-Lücke in
 * Flächenfarbe getrennt, nicht durch Rahmen.
 */
@Component({
  selector: 'app-status-bar',
  template: `
    @if (total() > 0) {
      <div class="bar" role="img" [attr.aria-label]="summary()">
        @for (segment of segments(); track segment.status) {
          @if (segment.count > 0) {
            <span
              class="bar__segment"
              [style.flex-grow]="segment.count"
              [style.background]="segment.color"
            ></span>
          }
        }
      </div>

      <ul class="legend">
        @for (segment of segments(); track segment.status) {
          <li class="legend__item">
            <span
              class="legend__swatch"
              [style.background]="segment.color"
              aria-hidden="true"
            ></span>
            <span class="legend__label">{{ segment.label }}</span>
            <span class="legend__value">{{ segment.count }}</span>
            <span class="legend__percent">{{ segment.percent }} %</span>
          </li>
        }
      </ul>

      <table class="visually-hidden">
        <caption>
          Aufgaben nach Status
        </caption>
        <thead>
          <tr>
            <th scope="col">Status</th>
            <th scope="col">Anzahl</th>
            <th scope="col">Anteil</th>
          </tr>
        </thead>
        <tbody>
          @for (segment of segments(); track segment.status) {
            <tr>
              <th scope="row">{{ segment.label }}</th>
              <td>{{ segment.count }}</td>
              <td>{{ segment.percent }} %</td>
            </tr>
          }
        </tbody>
      </table>
    }
  `,
  styleUrl: './status-bar.component.scss',
})
export class StatusBarComponent {
  readonly counts = input.required<Record<TaskStatus, number>>();

  protected readonly total = computed(() =>
    Object.values(this.counts()).reduce((sum, n) => sum + n, 0),
  );

  protected readonly segments = computed<Segment[]>(() => {
    const counts = this.counts();
    const total = this.total();
    return (Object.keys(TASK_STATUS_LABELS) as TaskStatus[]).map((status) => ({
      status,
      label: TASK_STATUS_LABELS[status],
      count: counts[status],
      percent: total ? Math.round((counts[status] / total) * 100) : 0,
      color: SERIES_COLOR[status],
    }));
  });

  protected readonly summary = computed(() =>
    this.segments()
      .map((s) => `${s.label}: ${s.count} (${s.percent} Prozent)`)
      .join(', '),
  );
}
