# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server on port 4000 with Next.js Turbo
- `npm run build` - Build production application
- `npm run check` - Run Biome linter to check code quality (read-only)
- `npm run typecheck` - TypeScript type checking

### Lint Command Restrictions ⚠️
**CRITICAL GUIDELINES FOR LINTING:**

**Why These Restrictions Exist:**
- The codebase maintains specific formatting standards through Biome
- Broad lint operations should be avoided to prevent unintended changes
- ONLY fix files you're actively working on

**Mandatory Rules:**
- **ALWAYS** use `npm run check` for read-only code quality checks
- **NEVER** use `npm run check:unsafe` - contains unsafe transformations
- Use `npm run check:write` ONLY on files you've modified
- Use `biome check --write <file>` for specific file fixes

**Correct Usage Examples:**
```bash
# ✅ CORRECT - Check specific file
biome check --write src/app/api/new-feature/route.ts

# ✅ CORRECT - Read-only checking
npm run check

# ❌ AVOID - Directory-wide writes
npm run check:write
```

### Database Commands
- `npm run db:generate` - Generate Drizzle migrations from schema changes
- `npm run db:migrate` - Apply database migrations to Turso
- `npm run db:push` - Push schema changes directly (development only)
- `npm run db:studio` - Open Drizzle Studio for database inspection

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 15 with App Router and Turbo
- **API Layer**: tRPC for type-safe APIs
- **Database**: Turso (SQLite edge database) + Drizzle ORM
- **Authentication**: Clerk with protected routes
- **Styling**: Tailwind CSS v4
- **State Management**: TanStack Query via tRPC

### Key Architectural Patterns

#### tRPC API Layer
- All API endpoints defined in `src/server/api/routers/`
- Two procedure types: `publicProcedure` and `protectedProcedure`
- Routers registered in `src/server/api/root.ts`
- Context includes database connection and user ID
- Input validation with Zod schemas

#### Database Architecture
- Schema defined in `src/server/db/schema.ts`
- Turso configuration in `drizzle.config.ts`
- SQLite-specific syntax with Drizzle ORM
- Timestamp handling via `unixepoch()` and mode timestamps
- Indexed fields for performance optimization

#### Authentication Flow
- Clerk middleware in `src/middleware.ts` protects routes
- Public routes: `/sign-in`, `/sign-up`, `/api/trpc`
- Protected routes require authentication via `auth.protect()`
- User ID available in tRPC context for protected procedures

### Code Organization Patterns

#### Frontend Structure
- **App Router**: Routes in `src/app/` using Next.js 15 conventions
- **Components**: Feature components in `src/app/_components/`
- **Layouts**: Nested layouts for dashboard and auth flows
- **API Routes**: RESTful endpoints in `src/app/api/`

#### Backend Structure
- **tRPC Routers**: Business logic in `src/server/api/routers/`
- **Database**: Schema and connections in `src/server/db/`
- **tRPC Setup**: Core configuration in `src/server/api/trpc.ts`

### Development Guidelines

#### TypeScript Configuration
- Strict mode enabled with `noUncheckedIndexedAccess`
- Path alias: `~/*` maps to `./src/*`
- ES2022 target with ESNext modules

#### Database Operations
- Use Drizzle query builder for type safety
- Always use prepared statements for user input
- Timestamps stored as Unix epoch integers
- Relations defined separately from table schemas

#### tRPC Procedures
```typescript
// Public procedure example
hello: publicProcedure
  .input(z.object({ text: z.string() }))
  .query(({ input }) => { /* ... */ })

// Protected procedure example
create: protectedProcedure
  .input(z.object({ name: z.string().min(1) }))
  .mutation(async ({ ctx, input }) => {
    // ctx.userId available here
    // ctx.db for database access
  })
```

#### Component Patterns
- Server components by default in App Router
- Client components marked with `"use client"`
- tRPC hooks available via `~/trpc/react`
- Async components supported for data fetching

### Code Quality Standards
- **Linting**: Biome for formatting and linting (NOT ESLint/Prettier)
- **Type Safety**: End-to-end type safety with tRPC and Drizzle
- **Import Organization**: Biome auto-sorts imports
- **CSS**: Tailwind directives supported in Biome config

## Task Execution Guidelines

### Task Flow Rules
1. **Complete Requested Tasks** - Finish current task completely before asking about next steps
2. **No Auto-Progression** - Never automatically move to subsequent tasks
3. **Wait for User Direction** - Always pause and confirm before starting new work
4. **Stay Focused** - Only work on the specific task user has requested

### When Task is Complete
- Provide brief completion summary
- Stop and wait for user instruction
- Ask "What would you like me to work on next?" if unclear

### Quality Checks
- Run `npm run typecheck` after TypeScript changes
- Run `npm run check` to verify code quality
- Test database migrations with `npm run db:push` before finalizing
- Verify tRPC procedures are registered in `root.ts`