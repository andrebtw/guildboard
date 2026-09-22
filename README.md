# Guildboard

A fantasy guild management app — track adventurers, post quests, and assign adventurers to quests. Built as a school project.

## Stack

**Backend** — Java 21, Spring Boot 4.1.1 (Web, Data JPA, Validation), PostgreSQL, springdoc-openapi (Swagger UI)

**Frontend** — React 19 + TypeScript, Vite, React Router

## Project structure

```
guildboard/
├── backend/     # Spring Boot REST API
│   └── src/main/java/com/guildboard/
│       ├── Model/
│       │   ├── controller/   # REST controllers (Adventurer, Quest)
│       │   ├── Service/      # Business logic
│       │   ├── entity/       # JPA entities (Adventurer, Quest, Assignment, ...)
│       │   ├── dto/          # Request/response DTOs
│       │   ├── repository/   # Spring Data JPA repositories
│       │   └── exception/    # Custom exceptions + global handler
│       └── config/           # WebConfig (CORS, etc.)
└── frontend/    # React + Vite SPA
    └── src/
        ├── pages/       # AdventurersPage, QuestsPage, forms, etc.
        ├── component/   # Reusable UI components
        ├── services/    # API client calls
        └── frontdto/    # TypeScript types mirroring backend DTOs
```

## Prerequisites

- Java 21
- Node.js 18+
- PostgreSQL (running locally)

## Getting started

### 1. Database

Create a database named `guildboard`. The backend is configured (see `backend/src/main/resources/application.properties`) to connect to:

```
jdbc:postgresql://localhost:5432/guildboard
```

with username `postgres`. Update the credentials there to match your local setup, or override them with environment variables. Hibernate is set to `ddl-auto=update`, so tables are created/updated automatically on startup — no manual migrations needed.

### 2. Backend

```bash
cd backend
./mvnw spring-boot:run
```

Or using the provided `Makefile`:

```bash
cd backend
make run
```

The API starts on `http://localhost:8080`. Swagger UI is available at `http://localhost:8080/swagger-ui.html`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app starts on `http://localhost:5173` (the backend's CORS config already allows this origin).

## API overview

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/adventurers` | List adventurers |
| GET | `/api/adventurers/{id}` | Get an adventurer |
| POST | `/api/adventurers` | Create an adventurer |
| PUT | `/api/adventurers/{id}` | Update an adventurer |
| DELETE | `/api/adventurers/{id}` | Delete an adventurer |
| GET | `/api/adventurers/{id}/history` | Get an adventurer's quest history |
| GET | `/api/quests` | List quests |
| GET | `/api/quests/{id}` | Get a quest |
| POST | `/api/quests` | Create a quest |
| PUT | `/api/quests/{id}` | Update a quest |
| DELETE | `/api/quests/{id}` | Delete a quest |
| POST | `/api/quests/{id}/assignment` | Assign an adventurer to a quest |
| POST | `/api/quests/{id}/completion` | Mark a quest as completed |

## Available scripts (frontend)

- `npm run dev` – start the Vite dev server
- `npm run build` – type-check and build for production
- `npm run lint` – run ESLint
- `npm run preview` – preview the production build locally

## Available commands (backend)

- `make build` / `make package` – build the jar
- `make test` – run tests
- `make run` – build (if needed) and run the jar
- `make clean` – clean build artifacts

## License

See [LICENSE](LICENSE).
