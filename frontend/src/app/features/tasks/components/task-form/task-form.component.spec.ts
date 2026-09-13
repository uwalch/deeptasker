import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { environment } from '../../../../../environments/environment';
import { TaskFormComponent } from './task-form.component';

describe('TaskFormComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormComponent],
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

  it('sendet nichts ab, solange der Titel fehlt', () => {
    const fixture = TestBed.createComponent(TaskFormComponent);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    httpMock.expectNone(`${environment.apiUrl}/tasks`);
  });

  it('legt eine Aufgabe mit den Formularwerten an', () => {
    const fixture = TestBed.createComponent(TaskFormComponent);
    const component = fixture.componentInstance as unknown as {
      form: { patchValue: (v: Record<string, unknown>) => void };
    };
    fixture.detectChanges();

    component.form.patchValue({
      title: '  Neue Aufgabe  ',
      priority: 'hoch',
      estimatedMinutes: 30,
    });
    fixture.detectChanges();
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('POST');
    // Titel wird getrimmt, damit keine Leerzeichen in die Liste wandern.
    expect(req.request.body.title).toBe('Neue Aufgabe');
    expect(req.request.body.priority).toBe('hoch');
    expect(req.request.body.estimatedMinutes).toBe(30);
    req.flush({ id: '1', createdAt: '2026-01-01T00:00:00.000Z', ...req.request.body });
  });
});
