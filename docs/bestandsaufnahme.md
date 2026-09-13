# Bestandsaufnahme DeepTasker

Stand: 11.09.2026, Commit `c3a621f` (Branch `main`). Gelesen wurden alle 60
getrackten Dateien: Konfiguration, Quellcode, Specs und Styles.

## Überblick

DeepTasker ist als Monorepo angelegt. Bisher existiert nur das Frontend in
`frontend/`:

- Angular 22 mit standalone Komponenten und zoneless Change Detection
- Angular Material 3 (eigenes Theme über `mat.theme`, Material Symbols, Roboto selbst gehostet)
- NgRx SignalStore (`@ngrx/signals`) als State-Layer
- Vitest mit jsdom, ESLint (angular-eslint), Prettier

Ein Backend fehlt noch. Im Dev-Modus erwartet die App es unter
`http://localhost:3000/api` (`frontend/src/environments/environment.development.ts`),
im Produktions-Build unter `/api`.

## Aufbau

```
frontend/src/app/
├── core/        # Modelle, HTTP-Dienste, Auth, Theme
├── shared/ui/   # empty-state, stat-tile, status-bar, status-chip
└── features/    # tasks, dashboard, analytics - je eine *.routes.ts, lazy geladen
```

| Bereich | Datei(en) | Stand |
| --- | --- | --- |
| Shell | `app.component.*` | Toolbar mit Zähler offener Aufgaben und Theme-Menü (System/Hell/Dunkel). Die Sidenav passt sich an schmale Bildschirme an. Ruft `store.load()` einmal zentral auf. |
| Modell | `core/models/task.ts` | Status `offen \| in_arbeit \| erledigt`, Prioritäten `niedrig \| mittel \| hoch`, `TaskDraft`, Anzeigetexte |
| API | `core/services/task-api.service.ts` | `list`, `get`, `create`, `update`, `remove` gegen `/tasks` |
| Theme | `core/services/theme.service.ts` | Speichert die Wahl in `localStorage`, setzt `color-scheme` auf `<html>` |
| Auth | `core/services/auth.service.ts` | Leere Klasse, Platzhalter |
| State | `features/tasks/task-store.ts` | Root-provided SignalStore. Filtert nach Status, sortiert nach Priorität, berechnet `openCount`, `byStatus`, `byPriority`, `plannedMinutes`, `completionRate`. Methoden: `load`, `createTask`, `setStatusFilter` |
| Aufgabenliste | `features/tasks/components/task-list` | Statusfilter, Lade-, Fehler- und Leerzustand, Karten mit Prioritätsschiene und Schätzung |
| Aufgabenformular | `features/tasks/components/task-form` | Reactive Form mit Validierung, legt Aufgaben über den Store an |
| Aufgabendetails | `features/tasks/components/task-detail` | Liest die Aufgabe aus dem Store (Route-Input `:id`) |
| Dashboard | `features/dashboard` | Kennzahl-Kacheln und gestapelter Statusbalken |
| Auswertungen | `features/analytics` | Balkendiagramm nach Priorität |

Tests gibt es für den Store, den API-Service, die Shell und alle drei
Task-Komponenten.

## Bugs

### 1. Diagrammfarben folgen der Theme-Wahl nicht

`ThemeService` setzt nur `color-scheme` auf `<html>`. Die Farben
`--dt-series-*` und `--dt-viz-track` in `frontend/src/styles.scss` (Zeilen 41–48)
hängen aber an `@media (prefers-color-scheme: dark)`, also an der
Systemeinstellung. Wer „Dunkel“ wählt, während das System hell ist, bekommt
Material dunkel, die Diagramm- und Statusfarben aber hell. Umgekehrt genauso.

### 2. Ein gemeinsames `error`-Feld für Laden und Speichern

Der Store kennt nur ein `error`-Feld. Daraus folgt:

- Scheitert `createTask` und man kehrt zur Liste zurück, zeigt diese „Aufgaben
  konnten nicht geladen werden“ und blendet die geladenen Aufgaben aus.
- Ein alter Ladefehler erscheint im Formular als „Speichern fehlgeschlagen“.

### 3. Fälligkeitsdatum wird um einen Tag verschoben gespeichert

Der Datepicker liefert Mitternacht in lokaler Zeit. `toISOString()` in
`task-form.component.ts` (Zeile 67) macht daraus in Deutschland den Vortag in
UTC, z. B. `2026-09-11` → `2026-09-10T22:00:00.000Z`. Die Anzeige rechnet das
zurück, das Backend würde aber das falsche Datum speichern.

## Inkonsistenzen und Aufräumarbeiten

### 4. Überbleibsel `angular.json` im Root

Das `angular.json` im Repo-Root nutzt noch den alten Builder
(`@angular-devkit/build-angular:browser`), `zone.js` und das Theme
`indigo-pink`. Das widerspricht dem Commit „Root-Angular-Projekt entfernen“.
Die Datei kann weg.

### 5. Feature importiert Feature

Laut README darf ein Feature kein anderes Feature importieren. Dashboard und
Analytics importieren trotzdem `TaskStore` aus `features/tasks`. Da der Store
ohnehin app-weit genutzt wird, gehört er nach `core`.

### 6. Doppelter Code

- Die Dauerformatierung steht zweimal da: `formatDuration` in der Liste,
  `formatMinutes` in den Details.
- Die Zuordnung Status → Farbe steht in `status-chip` und in `status-bar`.
- Die Styles für `page-head` und `panel` sind in drei Seiten kopiert.

### 7. Veraltete Dokumentation

- Das Root-`README.md` nennt Formular und Details noch „Platzhalter“, beide
  sind aber umgesetzt. Auch „Nächste Entwicklungsschritte“ ist dadurch veraltet.
- `frontend/README.md` ist noch das CLI-Template (Angular 19, Karma).

### 8. Ungenutzte API-Methoden, fehlende Funktionen

`get`, `update` und `remove` in `TaskApiService` werden nirgends genutzt.
In der UI fehlen Bearbeiten, Löschen und Statuswechsel.

## Hinweise

- `node_modules` ist nicht installiert. Vor Tests oder Build braucht es
  `npm install` in `frontend/`.
- Das Root-`.gitignore` ist größtenteils ein Python-Template. Für die Angular-App
  greift `frontend/.gitignore`.

## Empfohlene Reihenfolge

1. Bugs 1–3 beheben (klein und klar abgegrenzt).
2. Aufräumen: Root-`angular.json` löschen, `TaskStore` nach `core` verschieben,
   Duplikate zusammenführen, READMEs aktualisieren.
3. Bearbeiten, Löschen und Statuswechsel im Store und in der UI ergänzen.
4. Backend aufsetzen.
