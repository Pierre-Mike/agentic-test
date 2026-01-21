# Feature: Version Endpoint

## Feature Description
Add a GET `/version` endpoint that returns the current application version and name as JSON. This provides a simple way for clients, monitoring tools, and developers to verify the deployed version of the application. The endpoint will read version information from the root package.json file to ensure the version is always in sync with the project metadata.

## User Story
As a developer or monitoring tool
I want to query an API endpoint to get the application version
So that I can verify which version is deployed and track deployments across environments

## Problem Statement
Currently, there is no programmatic way to determine which version of the application is running. This makes it difficult for:
- Monitoring and observability tools to track deployments
- Developers to verify that the correct version is deployed
- Automated systems to check version compatibility
- Debugging and support to identify which version a user is running

## Solution Statement
Implement a GET `/version` endpoint in the Hono server that returns a JSON response containing the version number and application name. The endpoint will dynamically read this information from the root package.json file at runtime, ensuring the API always returns the current version without requiring manual updates.

## Relevant Files
Use these files to implement the feature:

- `server/src/index.ts` - Main Hono application where the new `/version` endpoint will be added
- `package.json` - Root package.json containing the version ("0.5.1") and name ("agentic-test") that will be returned
- `shared/src/types/index.ts` - Shared types directory where we'll add the VersionResponse type

### New Files
- `server/src/index.test.ts` - New test file for testing the /version endpoint

## Implementation Plan
### Phase 1: Foundation
Create the shared TypeScript type for the version response to ensure type safety between the server implementation and any future client usage. This establishes the contract for the API response structure.

### Phase 2: Core Implementation
Implement the `/version` endpoint in the Hono server. The endpoint will:
1. Read the root package.json file using Bun's file reading capabilities
2. Parse the JSON to extract version and name
3. Return the data in the defined VersionResponse format with a 200 status code

### Phase 3: Integration
Add comprehensive tests to verify the endpoint works correctly and returns the expected data format. Ensure the endpoint integrates seamlessly with existing CORS and middleware configuration.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Define the VersionResponse type
- Open `shared/src/types/index.ts`
- Add a new exported type `VersionResponse` with fields:
  - `version: string` - The application version
  - `name: string` - The application name

### Step 2: Implement the /version endpoint
- Open `server/src/index.ts`
- Add a new GET route handler for `/version`
- Read the root package.json file (located at `../../package.json` relative to server/src)
- Parse the JSON and extract the `version` and `name` fields
- Return a JSON response with type `VersionResponse` and status 200

### Step 3: Create tests for the endpoint
- Create a new file `server/src/index.test.ts`
- Add test to verify the endpoint returns status 200
- Add test to verify the response has the correct JSON structure
- Add test to verify the version matches the package.json version
- Add test to verify the name matches the package.json name

### Step 4: Run validation commands
- Execute `bun run test` to ensure all tests pass
- Execute `bun run build` to verify no compilation errors
- Execute `bun run type-check` to verify type safety across all workspaces

## Testing Strategy
### Unit Tests
- Test that the `/version` endpoint returns a 200 status code
- Test that the response body contains both `version` and `name` fields
- Test that the returned values match the actual package.json content
- Test that the response content-type is application/json

### Integration Tests
- Verify the endpoint works with the existing CORS middleware
- Ensure the endpoint doesn't break other existing routes
- Test that the endpoint is accessible via HTTP GET

### Edge Cases
- Verify behavior if package.json cannot be read (should not occur in normal operation, but good to be aware)
- Ensure the endpoint works in both development and production builds
- Verify JSON parsing handles the package.json structure correctly

## Acceptance Criteria
- [ ] GET `/version` endpoint exists and is accessible
- [ ] Endpoint returns HTTP 200 status code
- [ ] Response is valid JSON with content-type application/json
- [ ] Response contains `version` field with value "0.5.1"
- [ ] Response contains `name` field with value "agentic-test"
- [ ] Version and name are read from package.json, not hardcoded
- [ ] VersionResponse type is defined in shared types
- [ ] All tests pass with zero failures
- [ ] Build completes successfully with no errors
- [ ] Type checking passes across all workspaces

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run tests to validate the feature works with zero regressions
- `bun run build` - Build all workspaces to ensure no compilation errors
- `bun run type-check` - Type check all workspaces

## Notes
- The endpoint reads from the root package.json which is two levels up from server/src/index.ts
- Using Bun.file() and .json() methods for efficient file reading and JSON parsing
- The response format is intentionally simple and follows REST API best practices
- This endpoint can be extended in the future to include additional metadata like build date, git commit hash, or environment information
- No external dependencies are required for this implementation
