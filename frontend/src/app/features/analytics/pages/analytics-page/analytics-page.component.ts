import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TaskStore } from '../../../tasks/task-store';
import { TASK_PRIORITY_LABELS, TaskPriority } from '../../../../core/models/task';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state.component';

interface PriorityRow {
  readonly priority: TaskPriority;
  readonly label: string;
  readonly count: number;
  readonly percent: number;
}

@Component({
  selector: 'app-analytics-page',
  imports: [RouterLink, MatButtonModule, MatIconModule, EmptyStateComponent],
  templateUrl: './analytics-page.component.html',
  styleUrl: './analytics-page.component.scss',
})
export class AnalyticsPageComponent {
  protected readonly store = inject(TaskStore);

  /**
   * Verteilung nach Priorität. Eine Kennfarbe plus Länge - der Vergleich ist
   * Magnitude, also eine Sequenz statt kategorialer Farben.
   */
  protected readonly priorityRows = computed<PriorityRow[]>(() => {
    const counts = this.store.byPriority();
    const max = Math.max(...Object.values(counts), 1);
    return (['hoch', 'mittel', 'niedrig'] as TaskPriority[]).map((priority) => ({
      priority,
      label: TASK_PRIORITY_LABELS[priority],
      count: counts[priority],
      percent: Math.round((counts[priority] / max) * 100),
    }));
  });
}
