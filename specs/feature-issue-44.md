# Feature: Simple Greet Function with Name Parameter

## Feature Description
Create a simple utility function that takes a name as a parameter and returns a personalized greeting message. This function will be strongly typed with TypeScript and exported from the shared package for use across the monorepo.

## User Story
As a developer using the bhvr monorepo
I want to have a greet function that accepts a name parameter
So that I can generate personalized greeting messages in both client and server code

## Problem Statement
Currently, the codebase has a basic `greet()` function in `shared/src/hello-world.ts` that returns a static "Hello, World!" message. There is no utility function that accepts a name parameter and returns a personalized greeting. The issue requests a new greet function at `src/utils/greet.ts` that provides this functionality.

## Solution Statement
Create a new utility module at `shared/src/utils/greet.ts` that exports a strongly-typed `greet` function. This function will accept a string parameter (name) and return a formatted greeting string. The function will be properly typed with TypeScript, tested, and exported from the shared package index for use throughout the monorepo.

Note: The issue specifies `src/utils/greet.ts`, which we interpret as `shared/src/utils/greet.ts` following the established monorepo pattern where shared utilities belong in the shared workspace.

## Relevant Files
Use these files to implement the feature:

- `shared/src/index.ts` - Main export file for the shared package, needs to export the new greet function
- `shared/src/hello-world.ts` - Existing utility function example to follow for code style and documentation
- `shared/src/hello-world.test.ts` - Existing test example to follow for testing patterns

### New Files
- `shared/src/utils/greet.ts` - New greet function implementation
- `shared/src/utils/greet.test.ts` - Unit tests for the greet function

## Implementation Plan
### Phase 1: Foundation
Create the directory structure for utilities in the shared package. The `shared/src/utils/` directory needs to be created to house the new greet function.

### Phase 2: Core Implementation
Implement the greet function with proper TypeScript typing. The function signature will be `greet(name: string): string` and will return a formatted greeting message in the format "Hello, <name>!".

### Phase 3: Integration
Export the new greet function from the shared package index so it can be imported and used in both client and server workspaces.

## Step by Step Tasks

### 1. Create utils directory structure
- Create `shared/src/utils/` directory

### 2. Implement the greet function
- Create `shared/src/utils/greet.ts` file
- Implement `greet(name: string): string` function
- Add JSDoc documentation following the pattern in `hello-world.ts`
- Return greeting in format "Hello, <name>!"

### 3. Create unit tests
- Create `shared/src/utils/greet.test.ts` file
- Test that function returns correct greeting format
- Test that function accepts a string parameter
- Test edge cases (empty string, special characters)
- Follow the testing pattern from `hello-world.test.ts`

### 4. Export from shared package
- Update `shared/src/index.ts` to export from `./utils/greet`

### 5. Validate implementation
- Run `bun run test` to validate all tests pass
- Run `bun run build` to ensure no compilation errors
- Run `bun run type-check` to validate TypeScript types

## Testing Strategy
### Unit Tests
- Test basic functionality: `greet("World")` returns `"Hello, World!"`
- Test with different names: `greet("Alice")` returns `"Hello, Alice!"`
- Test return type is string
- Test edge cases like empty string, names with spaces, special characters

### Integration Tests
No integration tests needed for this simple utility function.

### Edge Cases
- Empty string input: `greet("")` should return `"Hello, !"`
- Names with spaces: `greet("John Doe")` should return `"Hello, John Doe!"`
- Special characters: `greet("José")` should return `"Hello, José!"`
- Very long names should work without issues

## Acceptance Criteria
- [ ] Function is created at `shared/src/utils/greet.ts`
- [ ] Function has TypeScript type signature: `greet(name: string): string`
- [ ] Function returns greeting in exact format: `"Hello, <name>!"`
- [ ] Function is exported from `shared/src/index.ts`
- [ ] Unit tests are created and all pass
- [ ] All existing tests continue to pass (zero regressions)
- [ ] Build completes without errors
- [ ] Type checking passes without errors

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run all tests to validate the feature works with zero regressions
- `bun run build` - Build all workspaces to ensure no compilation errors
- `bun run type-check` - Type check all workspaces to ensure type safety

## Notes
- The issue specifies `src/utils/greet.ts` but doesn't specify which workspace. Based on the monorepo architecture where shared utilities belong in the `shared` package, we're implementing this at `shared/src/utils/greet.ts`.
- This follows the established pattern where utility functions are in the shared package and exported for use in both client and server.
- The existing `greet()` function in `hello-world.ts` has no parameters. This new function with a name parameter serves a different purpose and can coexist.
