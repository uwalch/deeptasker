import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../../data');
const dbPath = path.join(dataDir, 'tasks.json');

/**
 * In-Memory Task-Datenbank mit JSON-Persistierung.
 * Für Entwicklung ausreichend, später wird durch echte DB ersetzt.
 */
class TaskDatabase {
  constructor() {
    this.tasks = new Map();
    this.load();
  }

  /**
   * Lädt alle Daten aus der JSON-Datei.
   */
  load() {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    try {
      if (fs.existsSync(dbPath)) {
        const data = fs.readFileSync(dbPath, 'utf-8');
        const tasks = JSON.parse(data);
        this.tasks = new Map(tasks);
        console.log(`✅ ${tasks.length} Tasks geladen`);
      } else {
        console.log('📝 Neue Datenbank erstellt');
        this.save();
      }
    } catch (error) {
      console.error('Fehler beim Laden der Datenbank:', error);
      this.tasks = new Map();
    }
  }

  /**
   * Speichert alle Daten in die JSON-Datei.
   */
  save() {
    try {
      const data = JSON.stringify(Array.from(this.tasks.entries()), null, 2);
      fs.writeFileSync(dbPath, data, 'utf-8');
    } catch (error) {
      console.error('Fehler beim Speichern der Datenbank:', error);
    }
  }

  /**
   * Gibt alle nicht gelöschten Tasks zurück.
   */
  list() {
    const results = [];
    for (const task of this.tasks.values()) {
      if (!task.deleted_at) {
        results.push(task);
      }
    }
    return results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  /**
   * Gibt ein Task nach ID zurück.
   */
  get(id) {
    const task = this.tasks.get(id);
    if (!task || task.deleted_at) {
      throw new Error(`Task mit ID ${id} nicht gefunden`);
    }
    return task;
  }

  /**
   * Speichert ein neues Task.
   */
  set(id, task) {
    this.tasks.set(id, task);
    this.save();
  }

  /**
   * Aktualisiert ein Task.
   */
  update(id, updates) {
    const task = this.get(id);
    const updated = { ...task, ...updates, updated_at: new Date().toISOString() };
    this.tasks.set(id, updated);
    this.save();
    return updated;
  }

  /**
   * Soft-Deletes ein Task.
   */
  delete(id) {
    this.get(id); // Prüfe, ob Task existiert
    const now = new Date().toISOString();
    return this.update(id, { deleted_at: now });
  }
}

export const db = new TaskDatabase();

export function initializeDatabase() {
  // Datenbank wird bereits in Konstruktor initialisiert
}

export function closeDatabase() {
  // Nicht nötig für In-Memory DB
}
