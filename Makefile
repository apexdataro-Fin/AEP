# AEP - Educational Platform
# Makefile for common operations

.PHONY: install dev build test lint clean

# Install dependencies
install:
	pip install -r requirements.txt

# Run development server
dev:
	python manage.py runserver 0.0.0.0:8000

# Build: collect static files and run migrations
build:
	python manage.py collectstatic --noinput
	python manage.py migrate

# Run tests
test:
	pytest --cov=aep_core --cov=aep_project --cov-report=term-missing

# Lint
lint:
	ruff check .
	mypy .

# Clean build artifacts
clean:
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	rm -rf staticfiles/ 2>/dev/null || true
