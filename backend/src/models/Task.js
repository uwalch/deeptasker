/**
 * Konvertiert ein Datenbank-Task zu einem API-Task-Objekt (camelCase).
 */
export function dbToApiTask(dbTask) {
  return {
    id: dbTask.id,
    title: dbTask.title,
    description: dbTask.description,
    status: dbTask.status,
    priority: dbTask.priority,
    estimatedMinutes: dbTask.estimated_minutes,
    actualMinutes: dbTask.actual_minutes,
    dueDate: dbTask.due_date,
    createdAt: dbTask.created_at,
  };
}

/**
 * Konvertiert einen API-Input zu einem Datenbank-Task (snake_case).
 */
export function apiToDbTask(id, input, now) {
  return {
    id,
    title: input.title,
    description: input.description,
    status: 'offen',
    priority: input.priority,
    estimated_minutes: input.estimatedMinutes ?? null,
    actual_minutes: null,
    due_date: input.dueDate ?? null,
    created_at: now,
    updated_at: now,
    deleted_at: null,
  };
}
