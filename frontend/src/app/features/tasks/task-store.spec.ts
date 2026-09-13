import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { environment } from '../../../environments/environment';
import { Task } from '../../core/models/task';
import { TaskStore } from './task-store';

function makeTask(overrides: Partial<Task> & Pick<Task, 'id'>): Task {
  return {
    title: `Aufgabe ${overrides.id}`,
    description: '',
    status: 'offen',
    priority: 'mittel',
    estimatedMinutes: null,
    actualMinutes: null,
    dueDate: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('TaskStore', () => {
  let store: InstanceType<typeof TaskStore>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    store = TestBed.inject(TaskStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  function flushTasks(tasks: Task[]): void {
    store.load();
    httpMock.expectOne(`${environment.apiUrl}/tasks`).flush(tasks);
  }

  it('startet leer und ohne Ladezustand', () => {
    expect(store.tasks()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('übernimmt geladene Aufgaben und beendet den Ladezustand', () => {
    flushTasks([makeTask({ id: '1' })]);

    expect(store.tasks().length).toBe(1);
    expect(store.loading()).toBe(false);
  });

  it('sortiert sichtbare Aufgaben nach Priorität', () => {
    flushTasks([
      makeTask({ id: 'niedrig', priority: 'niedrig' }),
      makeTask({ id: 'hoch', priority: 'hoch' }),
      makeTask({ id: 'mittel', priority: 'mittel' }),
    ]);

    expect(store.visibleTasks().map((t) => t.id)).toEqual(['hoch', 'mittel', 'niedrig']);
  });

  it('filtert nach Status', () => {
    flushTasks([makeTask({ id: 'a', status: 'offen' }), makeTask({ id: 'b', status: 'erledigt' })]);

    store.setStatusFilter('erledigt');

    expect(store.visibleTasks().map((t) => t.id)).toEqual(['b']);
  });

  it('zählt nur nicht erledigte Aufgaben als offen', () => {
    flushTasks([
      makeTask({ id: 'a', status: 'offen' }),
      makeTask({ id: 'b', status: 'in_arbeit' }),
      makeTask({ id: 'c', status: 'erledigt' }),
    ]);

    expect(store.openCount()).toBe(2);
  });

  it('hält den Fehler fest und bleibt nicht im Ladezustand hängen', () => {
    store.load();
    httpMock
      .expectOne(`${environment.apiUrl}/tasks`)
      .flush('kaputt', { status: 500, statusText: 'Server Error' });

    expect(store.error()).not.toBeNull();
    expect(store.loading()).toBe(false);
  });
});
