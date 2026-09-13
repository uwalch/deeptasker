import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

import { StatusFilter, TaskStore } from '../../task-store';
import { TASK_PRIORITY_LABELS, TaskPriority } from '../../../../core/models/task';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state.component';
import { StatusChipComponent } from '../../../../shared/ui/status-chip/status-chip.component';

@Component({
  selector: 'app-task-list',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatTooltipModule,
    EmptyStateComponent,
    StatusChipComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  protected readonly store = inject(TaskStore);
  protected readonly priorityLabels = TASK_PRIORITY_LABELS;

  protected readonly filters: readonly { value: StatusFilter; label: string }[] = [
    { value: 'alle', label: 'Alle' },
    { value: 'offen', label: 'Offen' },
    { value: 'in_arbeit', label: 'In Arbeit' },
    { value: 'erledigt', label: 'Erledigt' },
  ];

  protected priorityIcon(priority: TaskPriority): string {
    return {
      hoch: 'keyboard_double_arrow_up',
      mittel: 'drag_handle',
      niedrig: 'keyboard_arrow_down',
    }[priority];
  }

  /** 135 -> "2 h 15 min", damit niemand Minuten im Kopf umrechnet. */
  protected formatDuration(minutes: number | null): string | null {
    if (minutes === null || minutes <= 0) {
      return null;
    }
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    if (!hours) {
      return `${rest} min`;
    }
    return rest ? `${hours} h ${rest} min` : `${hours} h`;
  }

  protected retry(): void {
    this.store.load();
  }
}
