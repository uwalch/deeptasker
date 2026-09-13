import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Task, TaskDraft } from '../models/task';

/**
 * Zugriff auf die Task-Ressource des Backends. Hält bewusst keinen State -
 * der liegt im TaskStore.
 */
@Injectable({ providedIn: 'root' })
export class TaskApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/tasks`;

  list(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl);
  }

  get(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/${id}`);
  }

  create(draft: TaskDraft): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, draft);
  }

  update(id: string, changes: Partial<TaskDraft>): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}/${id}`, changes);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
