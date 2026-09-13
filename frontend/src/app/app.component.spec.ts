import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { environment } from '../environments/environment';
import { Task } from './core/models/task';
import { AppComponent } from './app.component';

const tasks: Task[] = [
  {
    id: '1',
    title: 'Offen',
    description: '',
    status: 'offen',
    priority: 'hoch',
    estimatedMinutes: null,
    actualMinutes: null,
    dueDate: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Erledigt',
    description: '',
    status: 'erledigt',
    priority: 'niedrig',
    estimatedMinutes: null,
    actualMinutes: null,
    dueDate: null,
    createdAt: '2026-01-02T00:00:00.000Z',
  },
];

describe('AppComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
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

  /** Die Shell lädt die Aufgaben einmal zentral für die ganze App. */
  function render() {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    httpMock.expectOne(`${environment.apiUrl}/tasks`).flush(tasks);
    fixture.detectChanges();
    return fixture;
  }

  it('zeigt den Produktnamen in der Toolbar', () => {
    expect(render().nativeElement.querySelector('mat-toolbar')?.textContent).toContain(
      'DeepTasker',
    );
  });

  it('verlinkt alle drei Hauptbereiche', () => {
    const hrefs = Array.from(render().nativeElement.querySelectorAll('.shell-nav a')).map((a) =>
      (a as HTMLAnchorElement).getAttribute('href'),
    );
    expect(hrefs).toEqual(['/tasks', '/dashboard', '/analytics']);
  });

  it('zählt die offenen Aufgaben im Abzeichen der Toolbar', () => {
    expect(render().nativeElement.querySelector('.shell-badge')?.textContent).toContain('1 offen');
  });
});
