import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TaskStore } from '../../task-store';
import { TASK_PRIORITY_LABELS } from '../../../../core/models/task';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state.component';
import { StatusChipComponent } from '../../../../shared/ui/status-chip/status-chip.component';

@Component({
  selector: 'app-task-detail',
  imports: [RouterLink, MatButtonModule, MatIconModule, EmptyStateComponent, StatusChipComponent],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss',
})
export class TaskDetailComponent {
  /** Kommt über withComponentInputBinding aus dem Routenparameter :id. */
  readonly id = input.required<string>();

  protected readonly store = inject(TaskStore);
  protected readonly priorityLabels = TASK_PRIORITY_LABELS;

  protected readonly task = computed(() => this.store.tasks().find((t) => t.id === this.id()));

  protected formatDate(value: string | null): string {
    if (!value) {
      return 'nicht gesetzt';
    }
    return new Date(value).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  protected formatMinutes(minutes: number | null): string {
    if (minutes === null) {
      return 'nicht geschätzt';
    }
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    if (!hours) {
      return `${rest} min`;
    }
    return rest ? `${hours} h ${rest} min` : `${hours} h`;
  }
}
