import { createApp } from './app.js';
import { initializeDatabase, closeDatabase } from './database/db.js';

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:4200';

/**
 * Initialize database and start server
 */
function start() {
  try {
    // Datenbank initialisieren
    console.log('📦 Initialisiere Datenbank...');
    initializeDatabase();
    console.log('✅ Datenbank initialisiert');

    // App und Server erstellen
    const app = createApp();

    // Server starten
    const server = app.listen(PORT, () => {
      console.log(`\n🚀 DeepTasker Backend läuft auf http://localhost:${PORT}`);
      console.log(`📋 API verfügbar unter http://localhost:${PORT}/api`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
      console.log(`🌍 CORS aktiviert für ${CORS_ORIGIN}`);
      console.log(`📝 Environment: ${NODE_ENV}\n`);
    });

    /**
     * Graceful Shutdown
     */
    process.on('SIGTERM', () => {
      console.log('\n⏹️  SIGTERM empfangen, fahre herunter...');
      server.close(() => {
        closeDatabase();
        console.log('✅ Server und Datenbank geschlossen');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('\n⏹️  SIGINT empfangen, fahre herunter...');
      server.close(() => {
        closeDatabase();
        console.log('✅ Server und Datenbank geschlossen');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Fehler beim Starten:', error);
    process.exit(1);
  }
}

start();
