import { generateUUID } from '../utils/uuid.js';
import { db } from '../database/db.js';
import { dbToApiTask, apiToDbTask } from '../models/Task.js';

/**
 * Controller für Task-Verwaltung.
 */
export class TaskController {
  /**
   * Gibt alle nicht gelöschten Tasks zurück.
   */
  static listTasks() {
    const dbTasks = db.list();
    return dbTasks.map(dbToApiTask);
  }

  /**
   * Gibt ein bestimmtes Task nach ID zurück.
   */
  static getTask(id) {
    const dbTask = db.get(id);
    return dbToApiTask(dbTask);
  }

  /**
   * Erstellt ein neues Task.
   */
  static createTask(input) {
    const id = generateUUID();
    const now = new Date().toISOString();

    const dbTask = apiToDbTask(id, input, now);
    db.set(id, dbTask);

    return this.getTask(id);
  }

  /**
   * Aktualisiert ein bestehendes Task.
   */
  static updateTask(id, input) {
    // Prüfen, ob Task existiert
    this.getTask(id);

    const updates = {};

    // Nur die Felder updaten, die im Input enthalten sind
    if (input.title !== undefined) updates.title = input.title;
    if (input.description !== undefined) updates.description = input.description;
    if (input.status !== undefined) updates.status = input.status;
    if (input.priority !== undefined) updates.priority = input.priority;
    if (input.estimatedMinutes !== undefined) updates.estimated_minutes = input.estimatedMinutes;
    if (input.actualMinutes !== undefined) updates.actual_minutes = input.actualMinutes;
    if (input.dueDate !== undefined) updates.due_date = input.dueDate;

    db.update(id, updates);
    return this.getTask(id);
  }

  /**
   * Löscht ein Task (soft delete).
   */
  static deleteTask(id) {
    // Prüfen, ob Task existiert
    this.getTask(id);
    db.delete(id);
  }
}
