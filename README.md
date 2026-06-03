# Configurator

A production-ready full-stack application scaffold built with React (TypeScript) + Spring Boot (Java) + PostgreSQL.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS |
| Backend | Spring Boot 3.2, Java 17, Spring Data JPA, Spring Security |
| Database | PostgreSQL 15 |
| Auth | JWT (Access + Refresh tokens) |
| DevOps | Docker, Docker Compose, GitHub Actions CI/CD |

## Prerequisites

- Docker & Docker Compose (v2+)
- Node.js 20+ (for local frontend development)
- Java 17+ (for local backend development)
- PostgreSQL 15 (or use Docker)

## Quick Start

```bash
# 1. Clone the repository
git clone <repository-url>
cd configurator

# 2. Copy environment variables
cp .env.example .env

# 3. Start all services
docker-compose up --build

# 4. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080/api/v1
# Health check: http://localhost:8080/actuator/health
```

## Environment Variables

See `.env.example` for all required environment variables with descriptions.

## Project Structure

```
configurator/
├── frontend/          # React TypeScript SPA (Vite + TailwindCSS)
├── backend/           # Spring Boot REST API
├── docker-compose.yml # Multi-service orchestration
└── .github/workflows/ # CI/CD pipeline
```

## Development

### Frontend (local)

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173 with API proxy to :8080
```

### Backend (local)

```bash
cd backend
./gradlew bootRun --args='--spring.profiles.active=dev'
# Runs on http://localhost:8080
```

### Database

```bash
# Start only the database
docker-compose up db
```

## Testing

### Frontend

```bash
cd frontend
npm run test        # Run tests with Vitest
npm run lint        # ESLint
npm run type-check  # TypeScript type checking
```

### Backend

```bash
cd backend
./gradlew test
```

## API Documentation

The API follows RESTful conventions with a `/api/v1` prefix.

### Auth Endpoints
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login (returns JWT tokens)
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout (blocklist refresh token)
- `GET /api/v1/auth/me` - Get current user profile
- `PUT /api/v1/auth/me` - Update current user profile

### Example Endpoints (DELETE & replace with your domain)
- `GET /api/v1/items` - List items (paginated)
- `POST /api/v1/items` - Create item
- `GET /api/v1/items/{id}` - Get item by ID
- `PUT /api/v1/items/{id}` - Update item
- `DELETE /api/v1/items/{id}` - Delete item
- `GET /api/v1/tags` - List tags
- `POST /api/v1/tags` - Create tag

## Deployment

The GitHub Actions CI/CD pipeline automatically:
1. Lints and tests both frontend and backend
2. Builds Docker images on push to `main`
3. Pushes images to GitHub Container Registry

## License

MIT