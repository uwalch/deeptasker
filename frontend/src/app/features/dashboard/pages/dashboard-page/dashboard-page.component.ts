import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TaskStore } from '../../../tasks/task-store';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state.component';
import { StatTileComponent } from '../../../../shared/ui/stat-tile/stat-tile.component';
import { StatusBarComponent } from '../../../../shared/ui/status-bar/status-bar.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    EmptyStateComponent,
    StatTileComponent,
    StatusBarComponent,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent {
  protected readonly store = inject(TaskStore);

  protected readonly plannedLabel = computed(() => {
    const minutes = this.store.plannedMinutes();
    if (!minutes) {
      return '0 h';
    }
    const hours = minutes / 60;
    return hours >= 10 ? `${Math.round(hours)} h` : `${hours.toFixed(1).replace('.', ',')} h`;
  });

  protected readonly completionLabel = computed(() => {
    const rate = this.store.completionRate();
    return rate === null ? '–' : `${Math.round(rate * 100)} %`;
  });
}
