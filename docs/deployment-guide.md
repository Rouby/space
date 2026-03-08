# Deployment Guide

## Pipeline
Deployment is defined in `.github/workflows/deploy.yml` and runs on pushes to `main` after lint, typecheck, unit tests, integration tests, and image builds succeed.

## Build Artifacts
Built images:
- `ghcr.io/rouby/space-backend`
- `ghcr.io/rouby/space-frontend`
- `ghcr.io/rouby/space-migrations`

## Runtime Platform
- Kubernetes via Helm chart in `helm/`
- Environments: `staging`, `production`
- Namespaces: `space-staging`, `space-production`

## Helm Deployment
Core deployment command pattern:
```sh
helm upgrade space -n <namespace> --install --create-namespace \
  --set image.repository=ghcr.io/rouby/space \
  --set image.tag=<ref-sha> \
  --set ingress.host=<host> \
  --set-string secrets.JWT_SECRET=<base64> \
  --set-string secrets.APP_ORIGIN=<base64> \
  ./helm
```

## Infrastructure Inputs
- `helm/values.yaml` sets chart defaults.
- `helm/templates` includes backend/frontend/database deployments, ingress, migrations, and secrets templates.
