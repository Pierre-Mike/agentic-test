# Feature: Simple Greet Function

## Feature Description
This feature adds a new utility function called `greet` that takes a name as a parameter and returns a personalized greeting. The function will be properly typed with TypeScript and exported from a new utilities module at `src/utils/greet.ts`. This utility can be shared between the client and server, providing a simple greeting functionality.

## User Story
As a developer using the bhvr monorepo
I want to have a greet utility function that accepts a name parameter
So that I can generate personalized greeting messages in either the client or server applications

## Problem Statement
The codebase currently has a simple `greet()` function in `shared/src/hello-world.ts` that returns a static "Hello, World!" message. There is no utility function that accepts a name parameter to create personalized greetings. Developers need a reusable, type-safe function for generating custom greetings.

## Solution Statement
Create a new `greet` function in `shared/src/utils/greet.ts` that:
- Accepts a `name` parameter of type `string`
- Returns a greeting string in the format "Hello, {name}!"
- Is fully typed with TypeScript
- Is properly exported and can be imported from the shared package
- Follows the existing code patterns established in the codebase

## Relevant Files
- `shared/src/hello-world.ts` - Example of existing utility function pattern (reference for code style)
- `shared/src/hello-world.test.ts` - Example of test pattern to follow
- `shared/src/index.ts` - Main export file where we'll export the new utils module

### New Files
- `shared/src/utils/greet.ts` - New file containing the greet function
- `shared/src/utils/greet.test.ts` - Test file for the greet function
- `shared/src/utils/index.ts` - Barrel export file for utils module

## Implementation Plan

### Phase 1: Foundation
Create the directory structure for the utils module within the shared package. This follows the established pattern of organizing related functionality in subdirectories.

### Phase 2: Core Implementation
Implement the `greet` function with proper TypeScript typing, following the coding style established in the codebase (tabs for indentation, JSDoc comments, simple and functional approach).

### Phase 3: Integration
Update the shared package exports to include the new utils module, and create comprehensive tests following the existing test patterns.

## Step by Step Tasks

### Create utils directory structure
- Create `shared/src/utils/` directory

### Implement the greet function
- Create `shared/src/utils/greet.ts` file
- Add JSDoc comment describing the function
- Implement `greet(name: string): string` function that returns "Hello, {name}!"
- Export the function

### Create barrel export for utils
- Create `shared/src/utils/index.ts`
- Export all functions from greet.ts

### Update shared package exports
- Update `shared/src/index.ts` to export from "./utils"

### Create comprehensive tests
- Create `shared/src/utils/greet.test.ts`
- Add test: should return greeting with the provided name
- Add test: should return a string
- Add test: should handle empty string
- Add test: should handle special characters in name

### Run validation commands
- Execute `bun run test` to ensure all tests pass
- Execute `bun run build` to verify compilation succeeds
- Execute `bun run type-check` to validate TypeScript types

## Testing Strategy

### Unit Tests
- Test that `greet("Alice")` returns `"Hello, Alice!"`
- Test that the function returns a string type
- Test edge cases like empty strings, special characters, and long names
- Follow the testing pattern from `hello-world.test.ts`

### Integration Tests
- Verify the function can be imported from the shared package
- Ensure the build process includes the new module

### Edge Cases
- Empty string input: `greet("")` should return `"Hello, !"`
- Special characters: `greet("O'Brien")` should handle apostrophes correctly
- Unicode characters: `greet("José")` should preserve special characters
- Very long names: Function should handle strings of any length

## Acceptance Criteria
- [ ] File exists at `shared/src/utils/greet.ts`
- [ ] Function has TypeScript type signature: `greet(name: string): string`
- [ ] Function returns string in format: `"Hello, {name}!"`
- [ ] Function is exported from the file
- [ ] Function is re-exported from `shared/src/index.ts`
- [ ] Test file exists with comprehensive test coverage
- [ ] All tests pass without errors
- [ ] Build completes successfully
- [ ] Type checking passes with no errors
- [ ] Code follows existing patterns (tabs, JSDoc, functional style)

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run all tests to validate the feature works with zero regressions
- `bun run build` - Build all workspaces to ensure no compilation errors
- `bun run type-check` - Type check all workspaces to ensure type safety

## Notes
- The issue specifies `src/utils/greet.ts` but based on the monorepo structure, this should be implemented in `shared/src/utils/greet.ts` to be consistent with how other utilities are organized
- The existing `greet()` function in `hello-world.ts` has no parameters, while this new function will accept a `name` parameter - they serve different purposes
- Follow the exact same code style as `hello-world.ts`: tabs for indentation, JSDoc comments, simple function exports
- The function intentionally uses simple string concatenation/interpolation for clarity and simplicity (no over-engineering)
