# Feature: Add /test endpoint

## Feature Description
Add a new GET endpoint `/test` to the Hono server that returns a simple JSON response containing `{"test": "ok"}`. This endpoint provides a minimal test endpoint for validating server health and basic API functionality. The endpoint will follow the existing server patterns using Hono's routing and response handling.

## User Story
As a developer or automated system
I want to call a simple `/test` endpoint
So that I can verify the API server is running and responding correctly

## Problem Statement
The application currently lacks a simple, lightweight test endpoint that can be used for quick validation of server availability and basic JSON response handling. This makes it difficult to quickly verify that the server is operational without inspecting more complex endpoints.

## Solution Statement
Implement a new GET endpoint at `/test` that returns a JSON response with status 200 and body `{"test": "ok"}`. The endpoint will use Hono's built-in JSON response handling and follow the same patterns as existing endpoints like `/hello` and `/version`. A shared TypeScript type will be created to ensure type safety across the application.

## Relevant Files
Use these files to implement the feature:

- **server/src/index.ts** - Main server file where routes are defined. Need to add the new `/test` endpoint using the `.get()` method chaining pattern.
- **server/src/index.test.ts** - Server tests using Bun's test framework. Need to add comprehensive tests for the new endpoint covering status code, response structure, and content type.
- **shared/src/types/index.ts** - Shared type definitions. Need to define a `TestResponse` type for the endpoint response.
- **shared/src/index.ts** - Shared exports. Need to export the new `TestResponse` type.

### New Files
No new files need to be created. All implementation will use existing files.

## Implementation Plan
### Phase 1: Foundation
Define the shared TypeScript type for the test endpoint response. This ensures type safety across the server and enables potential future use by the client.

### Phase 2: Core Implementation
Implement the `/test` endpoint in the server following the existing Hono routing patterns. Use type-safe JSON response handling with explicit status codes.

### Phase 3: Integration
Ensure the endpoint integrates seamlessly with the existing server routes and CORS middleware. Validate through comprehensive testing.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### 1. Define Shared Types
- Add `TestResponse` type to `shared/src/types/index.ts` with the structure `{ test: string }`
- Export the `TestResponse` type from `shared/src/index.ts`

### 2. Write E2E Tests
- Add a new describe block in `server/src/index.test.ts` for the `/test` endpoint
- Test that `GET /test` returns status 200
- Test that the response body matches `{"test": "ok"}`
- Test that the response content-type is `application/json`
- Test that the response structure matches the `TestResponse` type

### 3. Implement the /test Endpoint
- Add a new `.get("/test", ...)` route in `server/src/index.ts`
- Import the `TestResponse` type from shared package
- Create a typed response object with `{ test: "ok" }`
- Return the JSON response with explicit status 200 using `c.json(data, { status: 200 })`

### 4. Run Validation Commands
- Execute `bun run test` to ensure all tests pass with zero regressions
- Execute `bun run build` to ensure no TypeScript compilation errors
- Execute `bun run type-check` to verify type safety across all workspaces

## Testing Strategy
### E2E Tests
- **Status Code Test**: Verify that `GET /test` returns HTTP 200
- **Response Body Test**: Verify the exact response body is `{"test": "ok"}`
- **Content Type Test**: Verify the response has `application/json` content type
- **Type Safety Test**: Verify the response structure matches the `TestResponse` type definition

### Unit Tests
No separate unit tests are needed as this is a simple endpoint with no business logic. The E2E tests provide full coverage.

### Integration Tests
Integration testing will be handled through the E2E test suite by making actual HTTP requests to the Hono app using `app.request("/test")`. This validates:
- CORS middleware integration
- Route registration and matching
- JSON serialization and response handling
- Type safety through TypeScript compilation

### Edge Cases
- **Direct request**: Test basic GET request returns correct response
- **Type validation**: Ensure response structure matches shared type definition
- **CORS handling**: Verify endpoint is accessible with CORS enabled (inherited from app-level CORS middleware)

## Acceptance Criteria
- `GET /test` endpoint exists and is accessible
- Endpoint returns HTTP status 200
- Response body is exactly `{"test": "ok"}`
- Response content-type is `application/json; charset=UTF-8`
- Response structure matches the `TestResponse` shared type
- All existing tests continue to pass with zero regressions
- TypeScript compilation succeeds with no errors
- Type checking passes across all workspaces

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run all tests including the new `/test` endpoint tests to validate functionality with zero regressions
- `bun run build` - Build all workspaces to ensure no TypeScript compilation errors
- `bun run type-check` - Type check all workspaces to ensure type safety

## Notes
- This endpoint follows the exact same pattern as the existing `/hello` endpoint in terms of structure and response handling
- The endpoint is intentionally minimal as specified in the requirements
- No environment variables or configuration are needed for this endpoint
- The `TestResponse` type is created in the shared package for consistency with other API response types, even though the client may not currently use it
- CORS is automatically enabled for this endpoint through the app-level `.use(cors())` middleware
- No additional dependencies need to be installed; all required packages are already in the project
