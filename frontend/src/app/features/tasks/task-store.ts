import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, Observable, pipe, switchMap, tap } from 'rxjs';

import { TaskApiService } from '../../core/services/task-api.service';
import { Task, TaskDraft, TaskPriority, TaskStatus } from '../../core/models/task';

export type StatusFilter = TaskStatus | 'alle';

interface TasksState {
  readonly tasks: readonly Task[];
  readonly loading: boolean;
  readonly saving: boolean;
  readonly error: string | null;
  readonly statusFilter: StatusFilter;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  saving: false,
  error: null,
  statusFilter: 'alle',
};

/** Sortierreihenfolge der Liste: Dringendes zuerst. */
const PRIORITY_ORDER: Record<TaskPriority, number> = {
  hoch: 0,
  mittel: 1,
  niedrig: 2,
};

export const TaskStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ tasks, statusFilter }) => ({
    visibleTasks: computed(() => {
      const filter = statusFilter();
      const visible = filter === 'alle' ? tasks() : tasks().filter((t) => t.status === filter);
      return [...visible].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    }),
    openCount: computed(() => tasks().filter((t) => t.status !== 'erledigt').length),
    byStatus: computed<Record<TaskStatus, number>>(() => ({
      offen: tasks().filter((t) => t.status === 'offen').length,
      in_arbeit: tasks().filter((t) => t.status === 'in_arbeit').length,
      erledigt: tasks().filter((t) => t.status === 'erledigt').length,
    })),
    byPriority: computed<Record<TaskPriority, number>>(() => ({
      hoch: tasks().filter((t) => t.priority === 'hoch').length,
      mittel: tasks().filter((t) => t.priority === 'mittel').length,
      niedrig: tasks().filter((t) => t.priority === 'niedrig').length,
    })),
    /** Summe der Schätzungen offener Aufgaben, in Minuten. */
    plannedMinutes: computed(() =>
      tasks()
        .filter((t) => t.status !== 'erledigt')
        .reduce((sum, t) => sum + (t.estimatedMinutes ?? 0), 0),
    ),
    /** Anteil erledigter Aufgaben, 0 bis 1. Ohne Aufgaben null. */
    completionRate: computed(() => {
      const all = tasks();
      if (!all.length) {
        return null;
      }
      return all.filter((t) => t.status === 'erledigt').length / all.length;
    }),
  })),
  withMethods((store, api = inject(TaskApiService)) => ({
    setStatusFilter(statusFilter: StatusFilter): void {
      patchState(store, { statusFilter });
    },
    /**
     * Legt eine Aufgabe an und nimmt sie bei Erfolg in den State auf.
     * Gibt den Stream zurück, damit die aufrufende Ansicht navigieren kann.
     */
    createTask(draft: TaskDraft): Observable<Task> {
      patchState(store, { saving: true, error: null });
      return api.create(draft).pipe(
        tap((task) => patchState(store, { tasks: [...store.tasks(), task], saving: false })),
        catchError((error: Error) => {
          patchState(store, { error: error.message, saving: false });
          throw error;
        }),
      );
    },
    load: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          api.list().pipe(
            tap((tasks) => patchState(store, { tasks, loading: false })),
            catchError((error: Error) => {
              patchState(store, { error: error.message, loading: false });
              return EMPTY;
            }),
          ),
        ),
      ),
    ),
  })),
);
