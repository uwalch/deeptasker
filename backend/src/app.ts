import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks.js';

const app: Express = express();

/**
 * Middleware
 */

// CORS aktivieren
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true,
  })
);

// JSON Body Parser
app.use(express.json());

/**
 * Health-Check Endpoint
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * API Routes
 */
app.use('/api/tasks', tasksRouter);

/**
 * 404 Handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint nicht gefunden',
    path: req.path,
    method: req.method,
  });
});

/**
 * Error Handler
 * Muss das letzte Middleware sein.
 */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error.message);

  // Check if it's a database error or our custom error
  if (error.message.includes('nicht gefunden')) {
    res.status(404).json({ error: error.message });
  } else if (error.message.includes('Foreign key')) {
    res.status(400).json({ error: 'Ungültige Referenz' });
  } else {
    res.status(500).json({
      error: 'Interner Serverfehler',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

export default app;
