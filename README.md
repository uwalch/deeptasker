# DeepTasker - Task Management System

> A modern, full-stack task management application built with Angular 22 and Express.js

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![Angular](https://img.shields.io/badge/angular-22-red)

## 🎯 Overview

DeepTasker is a comprehensive task management system designed to help teams and individuals organize, track, and complete their work efficiently. It features a modern Angular frontend and a robust Express.js backend with task prioritization, status tracking, and progress analytics.

### Features

- ✅ **Task Management** - Create, read, update, and delete tasks
- 📊 **Analytics Dashboard** - Track task progress and statistics
- 🎨 **Dark Mode** - Theme support with light/dark modes
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🔄 **Real-time Updates** - SignalStore-based state management
- 🏥 **Health Monitoring** - Built-in health checks and logging

## 🏗️ Architecture

```
deeptasker/
├── backend/                  # Node.js + Express REST API
│   ├── src/
│   │   ├── app.js           # Express application setup
│   │   ├── main.js          # Server entry point
│   │   ├── controllers/     # Business logic controllers
│   │   ├── models/          # Data models and transformations
│   │   ├── routes/          # API routes
│   │   ├── database/        # Database layer
│   │   └── utils/           # Utility functions
│   ├── package.json
│   ├── README.md
│   └── .env.example
├── frontend/                 # Angular 22 application
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.component.ts     # Root component
│   │   │   ├── app.config.ts        # Angular configuration
│   │   │   ├── app.routes.ts        # Route definitions
│   │   │   ├── core/                # Services and models
│   │   │   ├── features/            # Feature modules
│   │   │   └── shared/              # Shared components and utilities
│   │   ├── main.ts          # Application bootstrap
│   │   ├── styles.scss      # Global styles
│   │   └── environments/    # Environment configuration
│   ├── package.json
│   ├── angular.json
│   ├── tsconfig.json
│   └── README.md
└── docs/                     # Documentation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/uwalch/deeptasker.git
   cd deeptasker
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env if needed
   npm run dev
   ```
   Backend runs on `http://localhost:3000`

3. **Frontend Setup** (in another terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Frontend runs on `http://localhost:4200`

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tasks` | List all tasks |
| `GET` | `/tasks/:id` | Get a specific task |
| `POST` | `/tasks` | Create a new task |
| `PATCH` | `/tasks/:id` | Update a task |
| `DELETE` | `/tasks/:id` | Delete a task |

#### Health Check
```
GET /health
```

### Request/Response Example

**Create Task:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project setup",
    "description": "Configure development environment",
    "priority": "hoch",
    "estimatedMinutes": 120,
    "dueDate": "2026-09-30"
  }'
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project setup",
  "description": "Configure development environment",
  "status": "offen",
  "priority": "hoch",
  "estimatedMinutes": 120,
  "actualMinutes": null,
  "dueDate": "2026-09-30",
  "createdAt": "2026-09-13T15:00:00.000Z"
}
```

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:4200
```

### Frontend Environment

Modify `frontend/src/environments/environment.development.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## 📚 Technology Stack

### Frontend
- **Angular 22** - Framework
- **Angular Material 3** - UI Components
- **NgRx Signals** - State Management
- **RxJS** - Reactive Programming
- **Vitest** - Testing Framework
- **TypeScript** - Language
- **ESLint** - Linting
- **Prettier** - Code Formatting

### Backend
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **CORS** - Cross-Origin Resource Sharing
- **UUID** - Unique Identifiers
- **JSON** - Data Storage (Development)

## 📖 Documentation

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [API Documentation](./docs/)
- [Architecture Overview](./docs/bestandsaufnahme.md)

## 🐛 Known Issues & TODOs

See [Bestandsaufnahme](./docs/bestandsaufnahme.md) for:
- Known bugs and their descriptions
- Inconsistencies in the codebase
- Recommended implementation order

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'feat: add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Uwe Walch**
- Email: walchuwe@web.de
- GitHub: [@uwalch](https://github.com/uwalch)

## 🙏 Acknowledgments

- Angular Team for the excellent framework
- Express.js community for the backend foundation
- All contributors and supporters

---

**Last Updated:** 2026-09-13  
**Status:** 🟢 Production Ready
