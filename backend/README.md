# DeepTasker Backend

REST-API Backend für die DeepTasker-Anwendung. Implementiert CRUD-Operationen für Task-Management mit SQLite als Persistierungsebene.

## Tech-Stack

- **Runtime**: Node.js (ES2022 Modules)
- **Framework**: Express.js 4.18
- **Datenbank**: SQLite3 mit better-sqlite3
- **Sprache**: TypeScript 6.0
- **Testing**: Vitest
- **Linting**: ESLint & Prettier

## Installation

### Voraussetzungen
- Node.js 18+ (beste Kompatibilität mit 20+)
- npm 9+

### Setup

```bash
# In den backend-Ordner navigieren
cd backend

# Dependencies installieren
npm install

# Environment-Variablen (optional, es gibt Defaults)
cp .env.example .env
```

## Entwicklung

### Server starten (mit Hot-Reload)
```bash
npm run dev
```

Der Server läuft dann unter `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

### Tests
```bash
npm test
```

### Linting & Formatting
```bash
npm run lint
npm run format
```

## API Endpoints

### Health Check
```
GET /health
```
Gibt Status des Servers zurück.

### Tasks Endpoints

#### List Tasks
```
GET /api/tasks
```
Gibt alle Tasks zurück (sortiert nach Erstellungsdatum, neuste zuerst).

**Response (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Homepage implementieren",
    "description": "Bootstrap-Layout mit Hero-Section",
    "status": "in_arbeit",
    "priority": "hoch",
    "estimatedMinutes": 120,
    "actualMinutes": null,
    "dueDate": "2026-09-20",
    "createdAt": "2026-09-13T12:30:00.000Z"
  }
]
```

#### Get Task
```
GET /api/tasks/:id
```
Gibt ein bestimmtes Task zurück.

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Homepage implementieren",
  "description": "Bootstrap-Layout mit Hero-Section",
  "status": "in_arbeit",
  "priority": "hoch",
  "estimatedMinutes": 120,
  "actualMinutes": null,
  "dueDate": "2026-09-20",
  "createdAt": "2026-09-13T12:30:00.000Z"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Task mit ID ... nicht gefunden"
}
```

#### Create Task
```
POST /api/tasks
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Homepage implementieren",
  "description": "Bootstrap-Layout mit Hero-Section",
  "priority": "hoch",
  "estimatedMinutes": 120,
  "dueDate": "2026-09-20"
}
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Homepage implementieren",
  "description": "Bootstrap-Layout mit Hero-Section",
  "status": "offen",
  "priority": "hoch",
  "estimatedMinutes": 120,
  "actualMinutes": null,
  "dueDate": "2026-09-20",
  "createdAt": "2026-09-13T12:30:00.000Z"
}
```

**Response (400 Bad Request):**
```json
{
  "error": "title ist erforderlich und muss ein String sein"
}
```

#### Update Task
```
PATCH /api/tasks/:id
Content-Type: application/json
```

**Request Body (alle Felder optional):**
```json
{
  "status": "erledigt",
  "actualMinutes": 145
}
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Homepage implementieren",
  "description": "Bootstrap-Layout mit Hero-Section",
  "status": "erledigt",
  "priority": "hoch",
  "estimatedMinutes": 120,
  "actualMinutes": 145,
  "dueDate": "2026-09-20",
  "createdAt": "2026-09-13T12:30:00.000Z"
}
```

#### Delete Task
```
DELETE /api/tasks/:id
```

**Response (204 No Content):**
(Leerer Body)

**Response (404 Not Found):**
```json
{
  "error": "Task mit ID ... nicht gefunden"
}
```

## Datenmodell

### Task Status
- `offen` - Noch nicht begonnen
- `in_arbeit` - Gerade in Bearbeitung
- `erledigt` - Fertiggestellt

### Task Priority
- `niedrig` - Geringe Priorität
- `mittel` - Mittlere Priorität
- `hoch` - Hohe Priorität

### Task Fields

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| id | string (UUID) | Eindeutige Kennung (vom Backend generiert) |
| title | string | Aufgabentitel |
| description | string | Detaillierte Beschreibung |
| status | TaskStatus | aktueller Status |
| priority | TaskPriority | Prioritätsstufe |
| estimatedMinutes | number \| null | Geschätzte Dauer in Minuten |
| actualMinutes | number \| null | Tatsächliche Dauer in Minuten (nach Abschluss) |
| dueDate | string \| null | Fälligkeitsdatum (ISO-8601 Format) |
| createdAt | string | Erstellungszeitpunkt (ISO-8601, vom Backend generiert) |

## Fehlerbehandlung

Das Backend gibt standardisierte Fehlerantworten zurück:

- **400 Bad Request**: Validierungsfehler (ungültige Eingabedaten)
- **404 Not Found**: Task oder Endpoint nicht gefunden
- **500 Internal Server Error**: Unerwarteter Serverfehler

## Datenbank

Die SQLite-Datenbank wird automatisch beim Starten initialisiert:

```bash
data/
└── deeptasker.db         # SQLite-Datenbankdatei
```

### Schema

Die `tasks`-Tabelle wird automatisch erstellt mit:
- Primary Key auf `id`
- Constraints für Status und Priority
- Indices für häufige Abfragen
- Soft-Delete via `deleted_at` Feld

## CORS

CORS ist aktiviert für `http://localhost:4200` (Frontend). Dies kann via `CORS_ORIGIN` Environment-Variable angepasst werden.

## Environment-Variablen

| Variable | Default | Beschreibung |
|----------|---------|-------------|
| PORT | 3000 | Server-Port |
| NODE_ENV | development | Umgebung |
| CORS_ORIGIN | http://localhost:4200 | Erlaubter Frontend-Origin |

## Nächste Schritte

- [ ] Authentifizierung/Authorization implementieren
- [ ] Batch-Operationen für mehrere Tasks
- [ ] Filtering und Pagination optimieren
- [ ] Logging-System aufbauen
- [ ] API-Tests schreiben
- [ ] Datenbankmigrationen mit besserer Versionierung
- [ ] Rate Limiting hinzufügen
