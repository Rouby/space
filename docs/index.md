# Project Documentation Index

## Project Overview
- **Name:** space
- **Type:** monorepo with 7 parts
- **Primary Language:** TypeScript
- **Architecture:** Multi-part web platform (frontend + backend + shared data/domain packages + infra)
- **Scan Depth:** quick

## Quick Reference By Part
### Frontend (`frontend`)
- Type: web
- Root: `packages/frontend`
- Stack: React, Vite, TanStack Router, URQL

### Backend (`backend`)
- Type: backend
- Root: `packages/backend`
- Stack: Node.js, GraphQL Yoga, RxJS

### Data (`data`)
- Type: data
- Root: `packages/data`
- Stack: Drizzle ORM, PostgreSQL

### Gameloop (`gameloop`)
- Type: game
- Root: `packages/gameloop`
- Stack: TypeScript simulation engine

### AI (`ai`)
- Type: library
- Root: `packages/ai`
- Stack: TypeScript, zod

### Integration (`integration`)
- Type: cli
- Root: `packages/integration`
- Stack: Playwright

### Infra (`infra`)
- Type: infra
- Root: `helm`
- Stack: Helm, Kubernetes, GitHub Actions

## Generated Documentation
- [Project Overview](./project-overview.md)
- [Source Tree Analysis](./source-tree-analysis.md)
- [Integration Architecture](./integration-architecture.md)
- [Project Parts Metadata](./project-parts.json)
- [API Contracts - Backend](./api-contracts-backend.md)
- [Data Models - Data](./data-models-data.md)
- [Deployment Guide](./deployment-guide.md)

### Architecture Docs
- [Architecture - Frontend](./architecture-frontend.md)
- [Architecture - Backend](./architecture-backend.md)
- [Architecture - Data](./architecture-data.md)
- [Architecture - Gameloop](./architecture-gameloop.md)
- [Architecture - AI](./architecture-ai.md)
- [Architecture - Integration](./architecture-integration.md)
- [Architecture - Infra](./architecture-infra.md)

### Component Inventories
- [Component Inventory - Frontend](./component-inventory-frontend.md)

### Development Guides
- [Development Guide - Frontend](./development-guide-frontend.md)
- [Development Guide - Backend](./development-guide-backend.md)
- [Development Guide - Data](./development-guide-data.md)
- [Development Guide - Integration](./development-guide-integration.md)

## Existing Documentation
- [Root README](../README.md)
- [Data README](../packages/data/README.md)

## Getting Started
1. Read `project-overview.md` for context.
2. Read architecture docs for the parts you will change.
3. Use `integration-architecture.md` for cross-package changes.
4. Use `deployment-guide.md` when preparing release/deploy changes.
