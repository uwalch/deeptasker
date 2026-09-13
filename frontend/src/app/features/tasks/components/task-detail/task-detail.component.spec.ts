import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { environment } from '../../../../../environments/environment';
import { Task } from '../../../../core/models/task';
import { TaskStore } from '../../task-store';
import { TaskDetailComponent } from './task-detail.component';

const task: Task = {
  id: '42',
  title: 'Backend anbinden',
  description: 'REST-Schnittstelle für Aufgaben.',
  status: 'in_arbeit',
  priority: 'hoch',
  estimatedMinutes: 135,
  actualMinutes: null,
  dueDate: null,
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('TaskDetailComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDetailComponent],
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

  function render(id: string) {
    // Geladen wird sonst zentral in der Shell; hier stößt es die Spec an.
    TestBed.inject(TaskStore).load();
    httpMock.expectOne(`${environment.apiUrl}/tasks`).flush([task]);

    const fixture = TestBed.createComponent(TaskDetailComponent);
    fixture.componentRef.setInput('id', id);
    fixture.detectChanges();
    return fixture;
  }

  it('zeigt die Aufgabe zur Route-ID', () => {
    const text = render('42').nativeElement.textContent;
    expect(text).toContain('Backend anbinden');
    expect(text).toContain('REST-Schnittstelle für Aufgaben.');
  });

  it('rechnet den Aufwand in Stunden und Minuten um', () => {
    expect(render('42').nativeElement.textContent).toContain('2 h 15 min');
  });

  it('meldet eine unbekannte ID statt leer zu bleiben', () => {
    const fixture = render('unbekannt');
    expect(fixture.nativeElement.textContent).toContain('Aufgabe nicht gefunden');
  });
});
