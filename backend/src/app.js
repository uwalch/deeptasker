import http from 'http';
import { TaskController } from './controllers/TaskController.js';

/**
 * Einfacher HTTP-Server ohne externe Dependencies.
 */
export function createApp() {
  return http.createServer((req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // CORS Preflight
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    // Logging
    if (process.env.NODE_ENV !== 'production') {
      console.log(`${req.method} ${req.url}`);
    }

    // Health Check
    if (req.url === '/health' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
      return;
    }

    // Task Routes
    handleTaskRoutes(req, res);
  });
}

/**
 * Verarbeitet Task-Routes.
 */
function handleTaskRoutes(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const searchParams = url.searchParams;

  // GET /api/tasks - Liste aller Tasks
  if (pathname === '/api/tasks' && req.method === 'GET') {
    try {
      const tasks = TaskController.listTasks();
      res.writeHead(200);
      res.end(JSON.stringify(tasks));
    } catch (error) {
      handleError(res, error);
    }
    return;
  }

  // POST /api/tasks - Erstelle neues Task
  if (pathname === '/api/tasks' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const input = JSON.parse(body);
        validateCreateInput(input);
        const task = TaskController.createTask(input);
        res.writeHead(201);
        res.end(JSON.stringify(task));
      } catch (error) {
        handleError(res, error);
      }
    });
    return;
  }

  // Matched /:id Pattern
  const taskIdMatch = pathname.match(/^\/api\/tasks\/([a-f0-9\-]+)$/);
  if (taskIdMatch) {
    const taskId = taskIdMatch[1];

    // GET /api/tasks/:id - Hole ein Task
    if (req.method === 'GET') {
      try {
        const task = TaskController.getTask(taskId);
        res.writeHead(200);
        res.end(JSON.stringify(task));
      } catch (error) {
        handleError(res, error);
      }
      return;
    }

    // PATCH /api/tasks/:id - Aktualisiere Task
    if (req.method === 'PATCH') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const input = JSON.parse(body);
          const task = TaskController.updateTask(taskId, input);
          res.writeHead(200);
          res.end(JSON.stringify(task));
        } catch (error) {
          handleError(res, error);
        }
      });
      return;
    }

    // DELETE /api/tasks/:id - Lösche Task
    if (req.method === 'DELETE') {
      try {
        TaskController.deleteTask(taskId);
        res.writeHead(204);
        res.end();
      } catch (error) {
        handleError(res, error);
      }
      return;
    }
  }

  // 404
  res.writeHead(404);
  res.end(JSON.stringify({
    error: 'Endpoint nicht gefunden',
    path: pathname,
    method: req.method,
  }));
}

/**
 * Validiert Create-Input.
 */
function validateCreateInput(input) {
  if (!input.title || typeof input.title !== 'string' || !input.title.trim()) {
    throw new Error('title ist erforderlich und muss ein String sein');
  }

  if (!input.description || typeof input.description !== 'string') {
    throw new Error('description ist erforderlich und muss ein String sein');
  }

  if (!['niedrig', 'mittel', 'hoch'].includes(input.priority)) {
    throw new Error('priority muss "niedrig", "mittel" oder "hoch" sein');
  }

  if (input.estimatedMinutes !== undefined && input.estimatedMinutes !== null) {
    if (typeof input.estimatedMinutes !== 'number' || input.estimatedMinutes < 0) {
      throw new Error('estimatedMinutes muss eine positive Zahl sein');
    }
  }

  if (input.dueDate !== undefined && input.dueDate !== null) {
    if (typeof input.dueDate !== 'string' || !isValidIsoDate(input.dueDate)) {
      throw new Error('dueDate muss ein gültiges ISO-8601 Datum sein');
    }
  }
}

/**
 * Prüft, ob ein String ein gültiges ISO-8601 Datum ist.
 */
function isValidIsoDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Fehlerbehandlung.
 */
function handleError(res, error) {
  console.error('Error:', error.message);

  if (error.message.includes('nicht gefunden')) {
    res.writeHead(404);
    res.end(JSON.stringify({ error: error.message }));
  } else if (error instanceof SyntaxError) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: 'Ungültiges JSON in Request Body' }));
  } else if (error.message.includes('erforderlich') || error.message.includes('muss')) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: error.message }));
  } else {
    res.writeHead(500);
    res.end(JSON.stringify({
      error: 'Interner Serverfehler',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }));
  }
}
