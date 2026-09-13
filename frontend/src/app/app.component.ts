import { Component, inject, linkedSignal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ThemePreference, ThemeService } from './core/services/theme.service';
import { TaskStore } from './features/tasks/task-store';

interface NavItem {
  readonly path: string;
  readonly label: string;
  readonly icon: string;
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly theme = inject(ThemeService);
  private readonly breakpoints = inject(BreakpointObserver);
  protected readonly store = inject(TaskStore);

  /** Unter dieser Breite überlagert die Navigation den Inhalt statt ihn zu verdrängen. */
  protected readonly isHandset = toSignal(
    this.breakpoints.observe(Breakpoints.Handset).pipe(map((r) => r.matches)),
    { initialValue: false },
  );

  /**
   * Auf breiten Viewports offen, auf schmalen zu - sonst verdeckt die
   * Navigation beim Start den kompletten Inhalt. Bleibt per set()
   * überschreibbar und richtet sich beim Wechsel der Breite neu aus.
   */
  protected readonly drawerOpen = linkedSignal(() => !this.isHandset());
  protected readonly preference = this.theme.preference;

  constructor() {
    // Einmal zentral laden: der Store ist root-provided, alle Ansichten und
    // das Abzeichen in der Toolbar lesen daraus.
    this.store.load();
  }

  protected readonly navItems: readonly NavItem[] = [
    { path: '/tasks', label: 'Aufgaben', icon: 'checklist' },
    { path: '/dashboard', label: 'Dashboard', icon: 'space_dashboard' },
    { path: '/analytics', label: 'Auswertungen', icon: 'insights' },
  ];

  protected readonly themeOptions: readonly {
    value: ThemePreference;
    label: string;
    icon: string;
  }[] = [
    { value: 'system', label: 'Systemeinstellung', icon: 'brightness_auto' },
    { value: 'light', label: 'Hell', icon: 'light_mode' },
    { value: 'dark', label: 'Dunkel', icon: 'dark_mode' },
  ];

  protected get themeIcon(): string {
    return this.themeOptions.find((o) => o.value === this.preference())?.icon ?? 'brightness_auto';
  }

  protected toggleDrawer(): void {
    this.drawerOpen.update((open) => !open);
  }

  protected setTheme(preference: ThemePreference): void {
    this.theme.set(preference);
  }

  /** Auf schmalen Geräten schließt sich die Navigation nach der Auswahl. */
  protected onNavigate(): void {
    if (this.isHandset()) {
      this.drawerOpen.set(false);
    }
  }
}
