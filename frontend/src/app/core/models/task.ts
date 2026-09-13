export type TaskStatus = 'offen' | 'in_arbeit' | 'erledigt';

export type TaskPriority = 'niedrig' | 'mittel' | 'hoch';

export interface Task {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly status: TaskStatus;
  readonly priority: TaskPriority;
  /** Geschätzter Aufwand in Minuten. */
  readonly estimatedMinutes: number | null;
  /** Tatsächlicher Aufwand in Minuten, sobald die Aufgabe erledigt ist. */
  readonly actualMinutes: number | null;
  readonly dueDate: string | null;
  readonly createdAt: string;
}

/** Feldsatz zum Anlegen einer Aufgabe; id und createdAt vergibt das Backend. */
export type TaskDraft = Omit<Task, 'id' | 'createdAt' | 'actualMinutes'>;

/** Anzeigetexte für die Statuswerte; das Modell selbst bleibt sprachneutral. */
export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  offen: 'Offen',
  in_arbeit: 'In Arbeit',
  erledigt: 'Erledigt',
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  hoch: 'Hoch',
  mittel: 'Mittel',
  niedrig: 'Niedrig',
};
