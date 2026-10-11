# Module 1: Engineering foundations

**Time:** 2 weeks

**Outcome:** Build a tested Python service that moves validated data between an API, files, and a relational database.

## Learn

- Python values, control flow, functions, collections, modules, exceptions, classes, typing, and file I/O.
- Virtual environments, dependencies, command-line use, logs, debugging, and unit/integration tests.
- Git commits, branches, diffs, pull requests, and README-driven reproducibility.
- JSON, CSV, HTTP, REST, status codes, headers, pagination, authentication, timeouts, retries, and rate limits.
- SQL tables, keys, joins, indexes, transactions, and migrations.
- Service basics with FastAPI: routes, request/response schemas, errors, and generated API docs.

## Core resources

- [CS50’s Introduction to Programming with Python](https://cs50.harvard.edu/python/): free, complete beginner course with exercises.
- [The Python Tutorial](https://docs.python.org/3/tutorial/): primary reference.
- [Pro Git](https://git-scm.com/book/en/v2): free official book; focus on chapters 1–3.
- [SQLBolt](https://sqlbolt.com/): interactive SQL introduction.
- [FastAPI tutorial](https://fastapi.tiangolo.com/tutorial/): build the service incrementally.
- [HTTP overview on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview): the protocol beneath model and business APIs.

## Labs

1. **API notebook:** fetch a paginated public dataset, handle non-200 responses, normalize records, and save JSON/CSV.
2. **Database worker:** upsert the records into SQLite, enforce uniqueness, and answer three SQL questions.
3. **Service:** expose filtered records through FastAPI with validated inputs and explicit errors.
4. **Failure lab:** simulate a timeout, malformed JSON, a duplicate, and a database exception.

## Project acceptance

- clean setup from the README succeeds;
- secrets and local data are not committed;
- validation rejects malformed records;
- repeated ingestion is idempotent;
- tests cover success and four failure paths;
- logs explain failures without exposing credentials;
- the learner can diagram client → API → validation → database → endpoint.

## Stretch

Add PostgreSQL, Docker Compose, a scheduled GitHub Actions job, and a CI test workflow. Explain what becomes easier and what new operational risks appear.
