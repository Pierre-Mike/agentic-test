# Feature: Create greet function with name parameter

## Feature Description
Create a simple utility function `greet` in the shared package that accepts a name parameter and returns a personalized greeting. This function will be properly typed with TypeScript and exported for use across the monorepo in both client and server applications.

## User Story
As a developer using the bhvr monorepo
I want to use a greet function that accepts a name parameter
So that I can generate personalized greeting messages throughout the application

## Problem Statement
Currently, the shared package contains a `greet()` function that returns a static "Hello, World!" message with no personalization. There's a need for a more flexible greeting utility that can accept a name parameter and return a personalized greeting message in the format "Hello, {name}!".

## Solution Statement
Create a new utility function in `shared/src/utils/greet.ts` that:
- Accepts a `name` parameter of type `string`
- Returns a greeting string in the format "Hello, {name}!"
- Is properly typed with TypeScript
- Is exported from the shared package for use in client and server workspaces

This follows the existing pattern of utility functions in the shared package and maintains the monorepo's type safety principles.

## Relevant Files
Use these files to implement the feature:

- `shared/src/hello-world.ts` - Reference for existing function pattern and TSDoc comments
- `shared/src/hello-world.test.ts` - Reference for testing patterns using Bun's test framework
- `shared/src/index.ts` - Export file where new utility will be added

### New Files
- `shared/src/utils/greet.ts` - New utility function file
- `shared/src/utils/greet.test.ts` - Test file for the new greet function

## Implementation Plan
### Phase 1: Foundation
Create the directory structure for utils within the shared package and set up the base file with proper TypeScript typing.

### Phase 2: Core Implementation
Implement the greet function with:
- TypeScript type annotations
- TSDoc documentation following existing patterns
- Proper string interpolation for the greeting message

### Phase 3: Integration
Export the new function from the shared package index and add comprehensive tests following the existing test patterns.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create utils directory structure
- Create the `shared/src/utils/` directory if it doesn't exist

### Step 2: Implement the greet function
- Create `shared/src/utils/greet.ts` with:
  - TypeScript function signature accepting `name: string` parameter
  - Return type annotation of `string`
  - TSDoc comment describing the function
  - Implementation returning "Hello, {name}!" using template literal

### Step 3: Create comprehensive tests
- Create `shared/src/utils/greet.test.ts` following the pattern from `hello-world.test.ts`:
  - Test that function returns correct greeting format with a given name
  - Test return type is string
  - Test edge cases (empty string, special characters)

### Step 4: Export from shared package
- Update `shared/src/index.ts` to export the new greet function from utils

### Step 5: Run validation commands
- Execute all validation commands to ensure no regressions and proper functionality

## Testing Strategy
### Unit Tests
- **Basic functionality**: Test that `greet("Alice")` returns `"Hello, Alice!"`
- **Return type validation**: Verify function returns a string type
- **Different inputs**: Test with various names to ensure string interpolation works correctly

### Integration Tests
- **Package export**: Verify the function is properly exported from shared package
- **Import verification**: Ensure function can be imported using `import { greet } from 'shared'`

### Edge Cases
- Empty string input: `greet("")` should return `"Hello, !"`
- Names with special characters: `greet("O'Brien")` should handle apostrophes
- Unicode characters: `greet("José")` should handle accented characters
- Very long names: Should handle strings of any reasonable length

## Acceptance Criteria
- [ ] Function is created at `shared/src/utils/greet.ts`
- [ ] Function accepts a `name` parameter of type `string`
- [ ] Function returns a string in the format "Hello, {name}!"
- [ ] Function has proper TypeScript type annotations
- [ ] Function is documented with TSDoc comments
- [ ] Function is exported from `shared/src/index.ts`
- [ ] Comprehensive test suite exists at `shared/src/utils/greet.test.ts`
- [ ] All tests pass with `bun run test`
- [ ] Project builds successfully with `bun run build`
- [ ] Type checking passes with `bun run type-check`

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run all tests including new greet function tests
- `bun run build` - Build all workspaces to ensure no compilation errors
- `bun run type-check` - Type check all workspaces to verify TypeScript correctness

## Notes
- The issue specification mentions `src/utils/greet.ts`, but given the monorepo structure where utility functions belong in the `shared` package, this will be created at `shared/src/utils/greet.ts`
- This follows the existing pattern where the current `greet()` function exists in `shared/src/hello-world.ts`
- The new function will be a different utility with a name parameter, while the existing parameterless `greet()` can remain for backwards compatibility
- The function will be available for import in both client and server packages via `import { greet } from 'shared'`
