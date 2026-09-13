import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { environment } from '../../../environments/environment';
import { TaskApiService } from './task-api.service';
import { Task, TaskDraft } from '../models/task';

describe('TaskApiService', () => {
  let service: TaskApiService;
  let httpMock: HttpTestingController;

  const task: Task = {
    id: '1',
    title: 'Angular-Upgrade dokumentieren',
    description: '',
    status: 'offen',
    priority: 'mittel',
    estimatedMinutes: 30,
    actualMinutes: null,
    dueDate: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TaskApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('lädt alle Aufgaben', () => {
    let result: Task[] | undefined;
    service.list().subscribe((tasks) => (result = tasks));

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('GET');
    req.flush([task]);

    expect(result).toEqual([task]);
  });

  it('legt eine Aufgabe per POST an', () => {
    const draft: TaskDraft = {
      title: 'Neu',
      description: '',
      status: 'offen',
      priority: 'hoch',
      estimatedMinutes: null,
      dueDate: null,
    };
    service.create(draft).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(draft);
    req.flush(task);
  });

  it('aktualisiert eine Aufgabe per PATCH', () => {
    service.update('1', { status: 'erledigt' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'erledigt' });
    req.flush({ ...task, status: 'erledigt' });
  });
});
