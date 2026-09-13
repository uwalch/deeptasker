import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { environment } from '../../../../../environments/environment';
import { Task } from '../../../../core/models/task';
import { TaskStore } from '../../task-store';
import { TaskListComponent } from './task-list.component';

const tasks: Task[] = [
  {
    id: '1',
    title: 'Backend anbinden',
    description: '',
    status: 'offen',
    priority: 'hoch',
    estimatedMinutes: 135,
    actualMinutes: null,
    dueDate: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

describe('TaskListComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
      ],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  /** Geladen wird zentral in der Shell; hier übernimmt das die Spec. */
  function render(data: Task[]) {
    TestBed.inject(TaskStore).load();
    httpMock.expectOne(`${environment.apiUrl}/tasks`).flush(data);

    const fixture = TestBed.createComponent(TaskListComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('rendert geladene Aufgaben', () => {
    expect(render(tasks).nativeElement.textContent).toContain('Backend anbinden');
  });

  it('rechnet die Schätzung in Stunden und Minuten um', () => {
    expect(render(tasks).nativeElement.textContent).toContain('2 h 15 min');
  });

  it('zeigt einen Leerzustand, wenn keine Aufgaben vorliegen', () => {
    const fixture = render([]);
    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Keine Aufgaben für diesen Filter');
  });

  it('zeigt den Fehlerfall mit Wiederholen-Schaltfläche', () => {
    TestBed.inject(TaskStore).load();
    httpMock
      .expectOne(`${environment.apiUrl}/tasks`)
      .flush('kaputt', { status: 500, statusText: 'Server Error' });

    const fixture = TestBed.createComponent(TaskListComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Aufgaben konnten nicht geladen werden');
    expect(fixture.nativeElement.textContent).toContain('Erneut versuchen');
  });
});
