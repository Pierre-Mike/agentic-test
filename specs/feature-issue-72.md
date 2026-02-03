# Feature: Test Endpoint

## Feature Description
Add a simple GET `/test` endpoint that returns a basic JSON response to verify API functionality. This endpoint serves as a simple health check and validation mechanism for automated testing workflows. The endpoint returns a static JSON object `{"test": "ok"}` with proper content-type headers and a 200 status code.

## User Story
As a developer or automated testing system
I want to call a simple test endpoint
So that I can verify the API server is responding correctly with proper JSON formatting

## Problem Statement
Currently, there is no dedicated test endpoint for automated workflows to validate basic API functionality. While other endpoints like `/version` exist, they may have dependencies or complexity that makes them unsuitable for simple connectivity and format validation tests. A dedicated `/test` endpoint provides:
- A simple, dependency-free validation target for CI/CD pipelines
- A quick health check mechanism for automated tests
- A minimal endpoint to verify JSON response formatting
- A consistent test target that won't change with application logic

## Solution Statement
Implement a GET `/test` endpoint in the Hono server that returns a static JSON response `{"test": "ok"}` with a 200 status code and proper `application/json` content-type. The endpoint will be simple, stateless, and have no dependencies, making it ideal for automated testing scenarios.

## Relevant Files
Use these files to implement the feature:

- `server/src/index.ts` - Main Hono application where the new `/test` endpoint will be added (around line 29, after the `/version` endpoint)
- `shared/src/types/index.ts` - Shared types directory where we'll add the TestResponse type for type safety

### New Files
- `server/src/index.test.ts` - Will be updated with new test cases for the `/test` endpoint (file already exists)

## Implementation Plan
### Phase 1: Foundation
Create the shared TypeScript type for the test response to ensure type safety between the server implementation and tests. This establishes the contract for the API response structure and ensures consistency.

### Phase 2: Core Implementation
Implement the `/test` endpoint in the Hono server. The endpoint will:
1. Define a route handler for GET `/test`
2. Create a response object matching the TestResponse type
3. Return the JSON response with a 200 status code

### Phase 3: Integration
Add comprehensive unit tests to verify the endpoint works correctly, returns the expected data format, and has the proper content-type header. Ensure the endpoint integrates seamlessly with existing CORS middleware and doesn't interfere with other routes.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Define the TestResponse type
- Open `shared/src/types/index.ts`
- Add a new exported type `TestResponse` with a single field:
  - `test: "ok"` - Use a string literal type to ensure the value is always "ok"

### Step 2: Write unit tests for the /test endpoint
- Open `server/src/index.test.ts`
- Add a new test suite with describe block for "/test endpoint"
- Add test case: "should return status 200"
  - Make request to `/test`
  - Assert response status is 200
- Add test case: "should return JSON with correct structure"
  - Make request to `/test`
  - Parse response as TestResponse
  - Assert response has `test` property
  - Assert `test` property value is "ok"
- Add test case: "should have application/json content-type"
  - Make request to `/test`
  - Get content-type header
  - Assert it contains "application/json"

### Step 3: Implement the /test endpoint
- Open `server/src/index.ts`
- Import TestResponse type from shared/dist
- Add a new GET route handler for `/test` after the `/version` endpoint
- Create response object: `{ test: "ok" }` with TestResponse type annotation
- Return JSON response with status 200 using `c.json(data, { status: 200 })`

### Step 4: Run validation commands
- Execute `bun run test` to ensure all tests pass
- Execute `bun run build` to verify no compilation errors
- Execute `bun run type-check` to verify type safety across all workspaces

## Testing Strategy
### E2E Tests
While this feature focuses on unit tests, the endpoint can be tested end-to-end by:
- Making a real HTTP request to the running server
- Verifying the response status, headers, and body
- This can be validated manually or through integration test frameworks

### Unit Tests
- Test that the `/test` endpoint returns a 200 status code
- Test that the response body contains the `test` field with value "ok"
- Test that the response content-type is application/json
- Verify the response structure matches the TestResponse type

### Integration Tests
- Verify the endpoint works with the existing CORS middleware
- Ensure the endpoint doesn't break other existing routes (/, /hello, /version)
- Test that the endpoint is accessible via HTTP GET method

### Edge Cases
- Verify the endpoint only responds to GET requests (not POST, PUT, etc.)
- Ensure the endpoint returns consistent results on multiple calls
- Verify JSON formatting is valid and parseable
- Test that the content-type header is set correctly

## Acceptance Criteria
- [ ] GET `/test` endpoint exists and is accessible
- [ ] Endpoint returns HTTP 200 status code
- [ ] Response body is exactly `{"test": "ok"}`
- [ ] Response content-type is application/json
- [ ] TestResponse type is defined in shared types with literal type "ok"
- [ ] Unit tests cover status code, response body, and content-type
- [ ] All tests pass with zero failures
- [ ] Build completes successfully with no errors
- [ ] Type checking passes across all workspaces
- [ ] No regressions to existing endpoints

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run tests to validate the feature works with zero regressions
- `bun run build` - Build all workspaces to ensure no compilation errors
- `bun run type-check` - Type check all workspaces

## Notes
- This endpoint is intentionally simple and stateless for testing purposes
- The response value "ok" is hardcoded as a string literal type for maximum type safety
- Following the existing pattern from `/version` and `/hello` endpoints for consistency
- The endpoint can be used by CI/CD workflows, monitoring tools, and automated tests
- No external dependencies or environment variables are required
- This is a temporary endpoint for automated workflow validation and may be cleaned up after testing
