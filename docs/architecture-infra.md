# Architecture - Infrastructure

## Executive Summary
Infrastructure is managed through a Helm chart and GitHub Actions deployment workflow targeting staging and production Kubernetes namespaces.

## Technology Stack
- Helm chart (`helm/`)
- Kubernetes manifests via templates
- GitHub Actions for CI/CD and deploy orchestration
- Container images hosted on GHCR

## Deployment Pattern
- CI validates lint/typecheck/unit/integration tests.
- Build job publishes backend/frontend/migrations images.
- Deploy job runs `helm upgrade --install` with environment-specific host and secrets.

## Key Files
- Chart metadata: `helm/Chart.yaml`
- Values: `helm/values.yaml`
- Templates: `helm/templates/*.yaml`
- Pipeline: `.github/workflows/deploy.yml`
