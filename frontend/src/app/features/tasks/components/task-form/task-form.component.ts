import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

import { TaskStore } from '../../task-store';
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  TaskDraft,
  TaskPriority,
  TaskStatus,
} from '../../../../core/models/task';

@Component({
  selector: 'app-task-form',
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  protected readonly store = inject(TaskStore);

  protected readonly statuses = Object.entries(TASK_STATUS_LABELS) as [TaskStatus, string][];
  protected readonly priorities = Object.entries(TASK_PRIORITY_LABELS) as [TaskPriority, string][];

  protected readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    description: [''],
    status: ['offen' as TaskStatus, Validators.required],
    priority: ['mittel' as TaskPriority, Validators.required],
    estimatedMinutes: [null as number | null, [Validators.min(1), Validators.max(10_000)]],
    dueDate: [null as Date | null],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const draft: TaskDraft = {
      title: value.title.trim(),
      description: value.description.trim(),
      status: value.status,
      priority: value.priority,
      estimatedMinutes: value.estimatedMinutes,
      dueDate: value.dueDate ? value.dueDate.toISOString() : null,
    };

    this.store.createTask(draft).subscribe({
      next: () => void this.router.navigate(['/tasks']),
      // Der Fehler steht bereits im Store und wird im Formular angezeigt.
      error: () => undefined,
    });
  }
}
