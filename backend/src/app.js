import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks.js';

const app = express();

/**
 * Middleware Configuration
 */

// CORS - Allow frontend communication
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// JSON Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request Logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`📡 ${req.method.padEnd(6)} ${req.path.padEnd(40)} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

/**
 * Health Check Endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * API Routes
 */
app.use('/api/tasks', tasksRouter);

/**
 * Root Endpoint
 */
app.get('/', (req, res) => {
  res.json({
    name: 'DeepTasker API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      tasks: {
        list: 'GET /api/tasks',
        create: 'POST /api/tasks',
        get: 'GET /api/tasks/:id',
        update: 'PATCH /api/tasks/:id',
        delete: 'DELETE /api/tasks/:id',
      },
    },
  });
});

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Endpoint ${req.method} ${req.path} does not exist`,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Error Handler
 * Must be last middleware
 */
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error('   Stack:', err.stack);

  // Specific error handlers
  if (err.message.includes('not found')) {
    return res.status(404).json({
      error: 'Not Found',
      message: err.message,
      timestamp: new Date().toISOString(),
    });
  }

  if (err.message.includes('required') || err.message.includes('invalid')) {
    return res.status(400).json({
      error: 'Bad Request',
      message: err.message,
      timestamp: new Date().toISOString(),
    });
  }

  // Generic error
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
    timestamp: new Date().toISOString(),
  });
});

export default app;
