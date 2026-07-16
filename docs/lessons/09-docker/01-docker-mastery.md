---
sidebar_position: 1
title: "Docker Mastery"
description: "Write production Dockerfiles, use multi-stage builds, and manage containers with docker-compose."
---

# Docker Mastery

Containers revolutionized deployment. Docker made them accessible. Master it.

## What You Will Learn

- Write efficient Dockerfiles with layer caching
- Use multi-stage builds to minimize image size
- Manage multi-container apps with docker-compose
- Push/pull images from registries

## A Production Dockerfile

```dockerfile
# Stage 1: Build
FROM python:3.12-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Run (minimal image)
FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY . .
USER 1000
CMD ["python", "app.py"]
```

## Essential Commands

| Command                             | Purpose                   |
| ----------------------------------- | ------------------------- |
| `docker build -t app .`             | Build an image            |
| `docker run -p 8080:80 app`         | Run a container           |
| `docker ps`                         | List running containers   |
| `docker logs container-id`          | View logs                 |
| `docker exec -it container-id bash` | Enter a container         |
| `docker-compose up -d`              | Start multi-container app |
| `docker system prune -a`            | Clean up everything       |

## docker-compose.yml

```yaml
version: "3.8"
services:
  web:
    build: .
    ports:
      - "8080:80"
    depends_on:
      - db
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

## CloudNova Exercise

Write a multi-stage Dockerfile for a Python web app. Requirements:

- Base image: python:3.12-slim
- Final image under 200MB
- Run as non-root user
- Include health check

---

[← Back to Module](index.md) | [🏠 Home](/)
