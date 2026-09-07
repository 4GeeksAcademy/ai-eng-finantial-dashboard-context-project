# Rule: Do not assume a database or external service exists

## Rule
Treat the current implementation as a mock-data dashboard, not as a persistent application with database-backed storage.

Do not introduce a database dependency or external service requirement unless the project explicitly adds that architecture and the surrounding rules are updated accordingly.

## Repository evidence
- The backend generates financial movement data in code with `generate_mock_movements` in [backend/app/routes.py](backend/app/routes.py).
- The backend route `get_metrics` returns generated data rather than reading from a database: [backend/app/routes.py](backend/app/routes.py).
- The Docker Compose file only defines `frontend` and `backend` services in [docker-compose.yml](docker-compose.yml).
- The Python dependencies in [backend/requirements.txt](backend/requirements.txt) do not include a database client or ORM package.
- There are no repository references to PostgreSQL, MySQL, SQLite, MongoDB, Redis, SQLAlchemy, or `DATABASE_URL` in the inspected project files.

## Risk prevented
This prevents future changes from incorrectly assuming that real persisted data exists, which would create broken expectations around data availability, environment configuration, and service dependencies for the current mock-data architecture.
