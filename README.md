# bhvr 🦫

![cover](https://cdn.stevedylan.dev/ipfs/bafybeievx27ar5qfqyqyud7kemnb5n2p4rzt2matogi6qttwkpxonqhra4)

## Production Environment

**Live Application:** [https://Pierre-Mike.github.io/agentic-test/](https://Pierre-Mike.github.io/agentic-test/)
![Client Status](https://img.shields.io/website?url=https%3A%2F%2FPierre-Mike.github.io%2Fagentic-test%2F&label=Client&up_message=online&down_message=offline)

**API Server:** [https://server.pierre-michael-twagirayezu.workers.dev](https://server.pierre-michael-twagirayezu.workers.dev)
![Server Status](https://img.shields.io/website?url=https%3A%2F%2Fserver.pierre-michael-twagirayezu.workers.dev%2Fversion&label=API&up_message=online&down_message=offline)

---

A full-stack TypeScript monorepo starter with shared types, using Bun, Hono, Vite, and React.

## Why bhvr?

While there are plenty of existing app building stacks out there, many of them are either bloated, outdated, or have too much of a vendor lock-in. bhvr is built with the opinion that you should be able to deploy your client or server in any environment while also keeping type safety.

## Quickstart

Make sure [bun](https://bun.sh) is installed

```bash
bun --version
```

Run the command below to make a new bhvr project

```bash
bun create bhvr@latest my-app
```

Once complete run the dev server

```bash
cd my-app
bun dev
```

> [!NOTE]
> Visit [bhvr.dev](https://bhvr.dev) for the full documentation!

## Features

- **Full-Stack TypeScript**: End-to-end type safety between client and server
- **Shared Types**: Common type definitions shared between client and server
- **Monorepo Structure**: Organized as a workspaces-based monorepo with Turbo for build orchestration
- **Modern Stack**:
  - [Bun](https://bun.sh) as the JavaScript runtime and package manager
  - [Hono](https://hono.dev) as the backend framework
  - [Vite](https://vitejs.dev) for frontend bundling
  - [React](https://react.dev) for the frontend UI
  - [Turbo](https://turbo.build) for monorepo build orchestration and caching

## Project Structure

```
.
├── client/               # React frontend
├── server/               # Hono backend
├── shared/               # Shared TypeScript definitions
│   └── src/types/        # Type definitions used by both client and server
├── package.json          # Root package.json with workspaces
└── turbo.json            # Turbo configuration for build orchestration
```

### Server

bhvr uses Hono as a backend API for its simplicity and massive ecosystem of plugins. If you have ever used Express then it might feel familiar. Declaring routes and returning data is easy.

```
server
├── bun.lock
├── package.json
├── README.md
├── src
│   └── index.ts
└── tsconfig.json
```

```typescript src/index.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { ApiResponse, VersionResponse } from 'shared/dist'

const app = new Hono()

app.use(cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/hello', async (c) => {

  const data: ApiResponse = {
    message: "Hello BHVR!",
    success: true
  }

  return c.json(data, { status: 200 })
})

app.get('/version', async (c) => {
  const data: VersionResponse = {
    version: "0.5.1",
    name: "agentic-test"
  }

  return c.json(data, { status: 200 })
})

export default app
```

#### API Endpoints

The server provides the following endpoints:

**GET /** - Simple text response
```typescript
Response: "Hello Hono!"
```

**GET /hello** - Returns a JSON response with type-safe data
```typescript
Response: ApiResponse
{
  message: string
  success: boolean
}
```

**GET /version** - Returns application version information
```typescript
Response: VersionResponse
{
  version: string
  name: string
}
```

**GET /test** - Test endpoint for verifying API connectivity
```typescript
Response: TestResponse
{
  test: string
}
```

All response types are defined in the `shared` package for type safety across client and server.

If you wanted to add a database to Hono you can do so with a multitude of Typescript libraries like [Supabase](https://supabase.com), or ORMs like [Drizzle](https://orm.drizzle.team/docs/get-started) or [Prisma](https://www.prisma.io/orm)

### Client

bhvr uses Vite + React Typescript template, which means you can build your frontend just as you would with any other React app. This makes it flexible to add UI components like [shadcn/ui](https://ui.shadcn.com) or routing using [React Router](https://reactrouter.com/start/declarative/installation).

```
client
├── eslint.config.js
├── index.html
├── package.json
├── public
│   └── vite.svg
├── README.md
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── assets
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

```typescript src/App.tsx
import { useState } from 'react'
import beaver from './assets/beaver.svg'
import { ApiResponse } from 'shared'
import './App.css'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8787"

function App() {
  const [data, setData] = useState<ApiResponse | undefined>()

  async function sendRequest() {
    try {
      const req = await fetch(`${SERVER_URL}/hello`)
      const res: ApiResponse = await req.json()
      setData(res)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div>
        <a href="https://github.com/stevedylandev/bhvr" target="_blank">
          <img src={beaver} className="logo" alt="beaver logo" />
        </a>
      </div>
      <h1>bhvr</h1>
      <h2>Bun + Hono + Vite + React</h2>
      <p>A typesafe fullstack monorepo</p>
      <div className="card">
        <button onClick={sendRequest}>
          Call API
        </button>
        {data && (
          <pre className='response'>
            <code>
            Message: {data.message} <br />
            Success: {data.success.toString()}
            </code>
          </pre>
        )}
      </div>
      <p className="read-the-docs">
        Click the beaver to learn more
      </p>
    </>
  )
}

export default App
```

### Shared

The Shared package is used for anything you want to share between the Server and Client. This could be types, utility functions, or libraries that you use in both environments.

```
shared
├── package.json
├── src
│   ├── index.ts
│   └── types
│       └── index.ts
└── tsconfig.json
```

Inside the `src/index.ts` we export any of our code from the folders so it's usable in other parts of the monorepo

```typescript
export * from "./types"
export * from "./hello-world"
```

By running `bun run dev` or `bun run build` it will compile and export the packages from `shared` so it can be used in either `client` or `server`

```typescript
// Import types
import { ApiResponse, VersionResponse } from 'shared'

// Import utility functions
import { greet } from 'shared'
```

The shared package includes utility functions like `greet()`:

```typescript src/hello-world.ts
export function greet(): string {
  return "Hello, World!";
}
```

## Getting Started

### Quick Start

You can start a new bhvr project using the [CLI](https://github.com/stevedylandev/create-bhvr)

```bash
bun create bhvr
```

### Installation

```bash
# Install dependencies for all workspaces
bun install
```

### Development

```bash
# Run all workspaces in development mode with Turbo
bun run dev

# Or run individual workspaces directly
bun run dev:client    # Run the Vite dev server for React
bun run dev:server    # Run the Hono backend
```

### Building

```bash
# Build all workspaces with Turbo
bun run build

# Or build individual workspaces directly
bun run build:client  # Build the React frontend
bun run build:server  # Build the Hono backend
```

### Additional Commands

```bash
# Lint all workspaces with Biome
bun run lint

# Format code with Biome
bun run format

# Type check all workspaces
bun run type-check

# Run tests across all workspaces
bun run test
```

## Code Quality & Development Workflow

bhvr uses [Biome](https://biomejs.dev) for fast linting and formatting, along with Husky for pre-commit hooks to ensure code quality.

### Biome Configuration

The project is configured with Biome for consistent code style:
- Automatic import organization
- Tab-based indentation
- Double quotes for strings
- VCS integration with Git
- Recommended linting rules enabled

### Pre-commit Hooks

Husky runs automatically before each commit to maintain code quality:

```bash
# Pre-commit hook runs:
bun run lint    # Checks for linting issues
bun run format  # Formats code automatically
```

If there are any linting errors, the commit will be blocked until they're fixed. To manually run these checks:

```bash
# Check for issues
bun run lint

# Auto-fix formatting
bun run format
```

### Automation & CI/CD

The project includes GitHub Actions workflows for:
- **Auto-implement**: Automatically plans and implements issues labeled with `auto-implement`
- **Continuous Integration**: Runs tests, type checking, and builds on every push
- **Automated Code Review**: Uses Claude for intelligent code review
- **Preview Deployments**: Automatically deploys preview environments for pull requests
- **Production Deployments**: Handles production deployment automation

See `.github/AUTO-IMPLEMENT.md` for details on the auto-implementation workflow.

### Deployment

Deplying each piece is very versatile and can be done numerous ways, and exploration into automating these will happen at a later date. Here are some references in the meantime.

**Client**
- [Orbiter](https://bhvr.dev/deployment/client/orbiter)
- [GitHub Pages](https://bhvr.dev/deployment/client/github-pages)
- [Netlify](https://bhvr.dev/deployment/client/netlify)
- [Cloudflare Pages](https://bhvr.dev/deployment/client/cloudflare-pages)

**Server**
- [Orbiter](https://bhvr.dev/deployment/server/orbiter)
- [Cloudflare Worker](https://bhvr.dev/deployment/server/cloudflare-workers)
- [Bun](https://bhvr.dev/deployment/server/railway)
- [Node.js](https://bhvr.dev/deployment/server/railway)

## Type Sharing

Types are automatically shared between the client and server thanks to the shared package and TypeScript path aliases. You can import them in your code using:

```typescript
import { ApiResponse } from 'shared/types';
```

## Learn More

- [bhvr Documentation](https://bhvr.dev)
- [Bun Documentation](https://bun.sh/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/learn)
- [Hono Documentation](https://hono.dev/docs)
- [Turbo Documentation](https://turbo.build/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
