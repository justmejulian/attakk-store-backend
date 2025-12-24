# Attakk Store Backend

Lightweight REST API for temporary e-commerce campaign.

## Tech Stack

- Node.js 22+
- TypeScript (strict mode)
- Express
- SQLite (node:sqlite)
- Zod (validation)

## Installation

```bash
npm install
```

## Development

```bash
npm run dev          # Start dev server with hot reload
npm run test         # Run all tests
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint check
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Prettier check
npm run format:fix   # Auto-format code
```

## Build

```bash
npm run build        # Compile TypeScript
npm start            # Start production server
```

## API Documentation

See [api.md](api.md) for complete API reference including endpoints, request/response formats, and examples.

## Database Schema

See [schema.md](schema.md) for database structure, types, and query details.

## Project Structure

```
src/
  db/              # Database layer (schema, queries, types)
  middleware/      # Express middleware
  routes/          # API route handlers
  schemas/         # Zod validation schemas
  services/        # Business logic
  types/           # TypeScript type definitions
  utils/           # Utility functions
  app.ts           # Express app configuration
  config.ts        # Environment configuration
  index.ts         # Application entry point
tests/             # Node.js built-in test runner
```

## Code Style

- Import extensions: Always use `.ts`
- Types: Strict mode, no `any` (use `unknown`), prefer `interface` for objects
- Format: Single quotes, no semicolons, 2 spaces, 100 char width
- Error handling: Zod validation, throw errors, standardized response format

## License

ISC
