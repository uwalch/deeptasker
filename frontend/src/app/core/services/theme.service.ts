import { Injectable, effect, signal } from '@angular/core';

export type ThemePreference = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'deeptasker.theme';

/**
 * Hält die Theme-Wahl des Nutzers und spiegelt sie auf das <html>-Element.
 * 'system' folgt prefers-color-scheme, die beiden anderen überschreiben es.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly preference = signal<ThemePreference>(this.read());

  constructor() {
    effect(() => this.apply(this.preference()));
  }

  set(preference: ThemePreference): void {
    this.preference.set(preference);
    try {
      localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // Privater Modus oder blockierter Speicher: Wahl gilt dann nur für diese Sitzung.
    }
  }

  private read(): ThemePreference {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    } catch {
      // s. o.
    }
    return 'system';
  }

  private apply(preference: ThemePreference): void {
    const root = document.documentElement;
    root.style.colorScheme = preference === 'system' ? 'light dark' : preference;
  }
}
