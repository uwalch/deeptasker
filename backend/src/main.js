import app from './app.js';
import { initializeDatabase, closeDatabase } from './database/db.js';

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:4200';

/**
 * Initialize database and start server
 */
async function start() {
  try {
    // Initialize database
    console.log('📦 Initializing database...');
    initializeDatabase();
    console.log('✅ Database initialized');

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`\n🚀 DeepTasker Backend running on http://localhost:${PORT}`);
      console.log(`📋 API available at http://localhost:${PORT}/api`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`🌍 CORS enabled for ${CORS_ORIGIN}`);
      console.log(`📝 Environment: ${NODE_ENV}\n`);
    });

    /**
     * Graceful Shutdown
     */
    const shutdown = () => {
      console.log('\n⏹️  Shutting down gracefully...');
      server.close(() => {
        closeDatabase();
        console.log('✅ Server and database closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

start();
