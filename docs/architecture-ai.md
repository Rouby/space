# Architecture - AI

## Executive Summary
The AI package provides reusable prompt and chat/completion helper modules for game-related AI features.

## Technology Stack
- TypeScript
- `zod` dependency for schema-oriented validation patterns

## Architecture Pattern
Small library package with prompt templates and chat/completion composition helpers.

## Key Areas
- `src/prompts`: prompt content and variants
- `src/chats`: chat-oriented utility modules
- `src/createChat.ts`, `src/createCompletion.ts`: construction helpers

## Development Notes
- Typecheck: `yarn workspace @space/ai typecheck`
