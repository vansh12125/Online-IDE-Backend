# Online IDE Backend

Backend service for a browser-based Online IDE built with Node.js, Express, TypeScript, PostgreSQL, and Prisma.

The backend is designed to provide a foundation for a scalable cloud-based development environment where users can create projects, manage files, execute code in isolated environments, interact with terminals, collaborate in real time, connect GitHub repositories, and eventually deploy applications.

The project is being developed incrementally. The current implementation focuses on establishing a clean backend architecture, authentication, project management, database integration, and the infrastructure required for future code execution and real-time capabilities.

---

## Table of Contents

* [Overview](#overview)
* [Goals](#goals)
* [Technology Stack](#technology-stack)
* [Architecture](#architecture)
* [Request Flow](#request-flow)
* [Project Structure](#project-structure)
* [Environment Setup](#environment-setup)
* [Installation](#installation)
* [Configuration](#configuration)
* [Running the Project](#running-the-project)
* [Build and Production](#build-and-production)
* [Database](#database)
* [Prisma](#prisma)
* [Database Architecture](#database-architecture)
* [API Architecture](#api-architecture)
* [Authentication Flow](#authentication-flow)
* [Project Flow](#project-flow)
* [File System Architecture](#file-system-architecture)
* [Code Execution Architecture](#code-execution-architecture)
* [WebSocket Architecture](#websocket-architecture)
* [Redis and Job Queues](#redis-and-job-queues)
* [Docker Execution Architecture](#docker-execution-architecture)
* [GitHub Integration](#github-integration)
* [Real-Time Collaboration](#real-time-collaboration)
* [Security](#security)
* [Error Handling](#error-handling)
* [Development Guidelines](#development-guidelines)
* [Git Workflow](#git-workflow)
* [Future Roadmap](#future-roadmap)
* [Scalability Plan](#scalability-plan)
* [Contributing](#contributing)
* [License](#license)

---

# Overview

The Online IDE Backend is the server-side component of a browser-based development environment.

The application allows a frontend IDE to communicate with a backend that is responsible for:

* User authentication
* User management
* Project management
* File and folder management
* Persistent project storage
* Code execution
* Execution status tracking
* Terminal sessions
* Real-time communication
* Collaborative editing
* Git and GitHub integration
* Environment variables
* Project previews
* Application deployment
* Future AI-powered development features

The backend is intentionally designed using separate layers so individual parts can be scaled independently.

---

# Goals

The main goals of the project are:

1. Build a production-oriented backend architecture.
2. Learn and implement TypeScript with Node.js.
3. Build REST APIs using Express.
4. Use PostgreSQL as the primary relational database.
5. Use Prisma as the ORM.
6. Implement secure authentication.
7. Build an isolated code execution system.
8. Use WebSockets for real-time features.
9. Use Redis for caching and job queues.
10. Use Docker to isolate user code execution.
11. Support multiple programming languages.
12. Integrate GitHub.
13. Support collaborative development.
14. Design the system so individual services can be scaled independently.

---

# Technology Stack

## Backend

* Node.js
* Express
* TypeScript

## Database

* PostgreSQL
* Prisma ORM

## Authentication

* JWT
* Password hashing
* Access tokens
* Refresh tokens

## Real-Time Communication

* WebSocket

WebSockets will be used for features that require continuous communication between the browser and server.

Examples:

* Code execution output
* Terminal output
* Collaborative editing
* Cursor synchronization
* User presence
* Typing indicators
* Live preview events

## Queue and Cache

* Redis
* Redis-based job queues

Redis will eventually be used to distribute code execution jobs and other background workloads.

## Code Execution

* Docker
* Isolated execution containers

Docker containers will be used to execute untrusted user code separately from the main backend server.

## Development

* tsx
* TypeScript compiler
* dotenv

---

# Architecture

The backend is designed around multiple logical layers.

```text
Frontend
   |
   | HTTP
   v
Express API
   |
   +--------------------+
   |                    |
   v                    v
Controllers          Middleware
   |
   v
Services
   |
   v
Repositories
   |
   v
Prisma
   |
   v
PostgreSQL
```

Real-time communication follows a separate path:

```text
Frontend
   |
   | WebSocket
   v
WebSocket Server
   |
   +----------------------+
   |                      |
   v                      v
Collaboration          Execution
   |                      |
   v                      v
Redis / Database       Workers
                          |
                          v
                       Docker
```

The eventual complete architecture is:

```text
                         Browser
                            |
                +-----------+-----------+
                |                       |
              HTTP                  WebSocket
                |                       |
                v                       v
          Express API             WebSocket Server
                |                       |
       +--------+---------+       +-----+------+
       |        |         |       |            |
      Auth   Projects    Files  Presence   Collaboration
       |        |         |                    |
       +--------+---------+                    |
                |                              |
                v                              |
           PostgreSQL                          |
                |                              |
                +--------------+---------------+
                               |
                             Redis
                               |
                         Job Queue
                               |
                    +----------+----------+
                    |                     |
                 Worker 1              Worker 2
                    |                     |
                 Docker                Docker
                    |                     |
                 Node.js              Python/Java/etc.
                    |
                    v
                Execution
                    |
                    v
               stdout/stderr
                    |
                    v
                WebSocket
                    |
                    v
                 Browser
```

---

# Request Flow

A normal API request follows this structure:

```text
Client
  |
  v
Route
  |
  v
Middleware
  |
  v
Controller
  |
  v
Service
  |
  v
Repository
  |
  v
Prisma
  |
  v
PostgreSQL
```

The responsibility of each layer is intentionally separated.

## Route

Routes define API endpoints.

Example:

```text
POST /projects
GET /projects
GET /projects/:projectId
PATCH /projects/:projectId
DELETE /projects/:projectId
```

## Middleware

Middleware handles cross-cutting concerns such as:

* Authentication
* Authorization
* Request validation
* Error handling
* Logging

## Controller

Controllers handle HTTP-specific responsibilities.

A controller should:

* Read request data
* Call the appropriate service
* Return the HTTP response

Controllers should not contain large amounts of business logic.

## Service

Services contain business logic.

Example:

```text
Create Project
    |
    +-- Validate project information
    |
    +-- Check authenticated user
    |
    +-- Create project
    |
    +-- Create initial files
    |
    +-- Return project
```

## Repository

Repositories handle database operations.

Example:

```text
project.repository.ts

createProject()
findProjectById()
findProjectsByUser()
updateProject()
deleteProject()
```

The service should not need to know how Prisma queries are implemented.

---

# Project Structure

```text
Backend/
|
├── prisma/
│   ├── migrations/
│   └── schema.prisma
|
├── src/
│   |
│   ├── config/
│   │   ├── env.ts
│   │   └── prisma.ts
│   |
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── project.controller.ts
│   │   └── file.controller.ts
│   |
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   |
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── project.routes.ts
│   │   └── file.routes.ts
│   |
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── project.service.ts
│   │   ├── file.service.ts
│   │   └── execution.service.ts
│   |
│   ├── repositories/
│   │   ├── user.repository.ts
│   │   ├── project.repository.ts
│   │   └── file.repository.ts
│   |
│   ├── websocket/
│   │   ├── server.ts
│   │   ├── handlers/
│   │   └── events/
│   |
│   ├── workers/
│   │   ├── execution.worker.ts
│   │   └── terminal.worker.ts
│   |
│   ├── queues/
│   │   ├── execution.queue.ts
│   │   └── terminal.queue.ts
│   |
│   ├── errors/
│   │   ├── app.error.ts
│   │   ├── auth.error.ts
│   │   └── validation.error.ts
│   |
│   ├── types/
│   │   ├── error-response.ts
│   │   ├── data-response.ts
│   │   └── index.ts
│   |
│   ├── utils/
│   │   ├── response.ts
│   │   ├── password.ts
│   │   └── jwt.ts
│   |
│   ├── app.ts
│   └── index.ts
|
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

Some directories are planned for future functionality and may not yet contain implementation.

---

# Environment Setup

## Requirements

Install the following software:

* Node.js
* npm
* PostgreSQL
* Git
* Docker Desktop

Redis will be required when the queue and real-time infrastructure is implemented.

Verify Node.js:

```bash
node --version
```

Verify npm:

```bash
npm --version
```

Verify Git:

```bash
git --version
```

Verify Docker:

```bash
docker --version
```

Verify PostgreSQL:

```bash
psql --version
```

---

# Installation

Clone the repository:

```bash
git clone <repository-url>
```

Move into the backend directory:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

---

# Configuration

Create a `.env` file in the backend root:

```env
SERVER_PORT=3000

DATABASE_URL="postgresql://postgres:password@localhost:5432/code_editor"
```

Do not commit `.env` to Git.

The `.gitignore` file should contain:

```text
node_modules/
dist/
.env
.env.*
!.env.example
```

For development, create an `.env.example` file:

```env
SERVER_PORT=3000
DATABASE_URL="postgresql://postgres:password@localhost:5432/code_editor"
```

The `.env.example` file can be committed because it does not contain real credentials.

---

# Running the Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The development server uses `tsx` to execute TypeScript directly.

Expected output:

```text
Database connected
Server is running on http://localhost:3000
```

---

# Package Scripts

Recommended scripts:

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

Development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Production:

```bash
npm start
```

---

# Build and Production

The production build follows:

```text
TypeScript
    |
    v
TypeScript Compiler
    |
    v
dist/
    |
    v
Node.js
```

Run:

```bash
npm run build
```

Then:

```bash
npm start
```

The compiled JavaScript files are placed inside the `dist` directory.

---

# Database

PostgreSQL is used as the primary relational database.

The database stores persistent application data such as:

* Users
* Projects
* Files
* Folders
* File versions
* Executions
* Project members
* Environment variables
* Git integrations
* Deployment metadata

The database is accessed through Prisma.

---

# Prisma

Initialize Prisma:

```bash
npx prisma init
```

The Prisma schema is located at:

```text
prisma/schema.prisma
```

A typical datasource configuration:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Generate Prisma Client:

```bash
npx prisma generate
```

Create a migration:

```bash
npx prisma migrate dev --name init
```

Apply migrations in production:

```bash
npx prisma migrate deploy
```

Open Prisma Studio:

```bash
npx prisma studio
```

Prisma Studio can be used to inspect database records during development.

---

# Database Architecture

The core relationship is:

```text
User
 |
 | 1:N
 v
Project
 |
 | 1:N
 v
FileNode
 |
 | 1:N
 v
FileVersion
```

A future execution relationship:

```text
Project
 |
 | 1:N
 v
Execution
 |
 v
ExecutionResult
```

Collaboration:

```text
Project
 |
 | 1:N
 v
ProjectMember
 |
 v
User
```

The project owner should be represented through a relationship to the User model.

Example conceptual model:

```text
User
----------------
id
name
email
passwordHash
createdAt
updatedAt

Project
----------------
id
name
language
ownerId
createdAt
updatedAt

FileNode
----------------
id
projectId
parentId
name
type
content
createdAt
updatedAt
```

The schema will evolve as additional features are implemented.

---

# API Architecture

The API is organized around resources.

Example API structure:

```text
/api
    /auth
        POST /register
        POST /login
        POST /refresh
        POST /logout

    /projects
        GET /
        POST /
        GET /:projectId
        PATCH /:projectId
        DELETE /:projectId

    /projects/:projectId/files
        GET /
        POST /

    /files
        GET /:fileId
        PATCH /:fileId
        DELETE /:fileId

    /executions
        POST /
        GET /:executionId
```

The exact routes may change as the application develops.

---

# Authentication Flow

Authentication is based on access and refresh tokens.

Registration:

```text
Client
  |
  v
POST /auth/register
  |
  v
Validate input
  |
  v
Hash password
  |
  v
Create User
  |
  v
Return response
```

Login:

```text
Client
  |
  v
POST /auth/login
  |
  v
Validate credentials
  |
  v
Generate access token
  |
  v
Generate refresh token
  |
  v
Return authentication data
```

Protected request:

```text
Client
  |
  | Authorization: Bearer <access-token>
  v
Authentication Middleware
  |
  v
Verify JWT
  |
  v
Attach authenticated user
  |
  v
Controller
```

Authentication middleware should reject requests when:

* Token is missing
* Token is malformed
* Token is expired
* Token is invalid
* User cannot be authenticated

---

# Project Flow

A typical project creation flow:

```text
User
 |
 v
POST /projects
 |
 v
Authentication Middleware
 |
 v
Project Controller
 |
 v
Project Service
 |
 v
Project Repository
 |
 v
Prisma
 |
 v
PostgreSQL
 |
 v
Project Created
 |
 v
Response
```

A project should have a stable ID.

For example:

```text
Project ID: 8f3b9a2c
Project Name: My React Application
```

If the user renames the project:

```text
Project ID: 8f3b9a2c
Project Name: Portfolio Website
```

The project ID remains unchanged.

The ID is used internally while the name is user-facing metadata.

---

# File System Architecture

The IDE requires a hierarchical file system.

Example:

```text
My Project
|
├── src
│   ├── components
│   │   ├── Button.tsx
│   │   └── Header.tsx
│   |
│   ├── App.tsx
│   └── main.tsx
|
├── public
│   └── logo.png
|
├── package.json
└── README.md
```

Files and folders can be represented using a tree structure.

A `parentId` can be used to represent hierarchy:

```text
Root
 |
 +-- src
      |
      +-- components
      |     |
      |     +-- Button.tsx
      |
      +-- App.tsx
```

Possible operations:

* Create file
* Create folder
* Rename file
* Rename folder
* Delete file
* Delete folder
* Move file
* Move folder
* Copy file
* Search files

---

# Auto-Save Flow

The frontend should not send a database request for every keystroke.

Instead:

```text
User types
   |
   v
Frontend state
   |
   v
Debounce
   |
   v
PATCH /files/:fileId
   |
   v
File Service
   |
   v
File Repository
   |
   v
PostgreSQL
```

Auto-save can use a debounce period such as 500-1000 milliseconds.

Manual save through Ctrl+S can also be supported.

---

# Code Execution Architecture

User code must never be executed directly inside the main API process.

Unsafe architecture:

```text
Express
   |
   v
Execute user code directly
```

This creates a major security risk.

The intended architecture is:

```text
Browser
   |
   v
POST /executions
   |
   v
Execution Service
   |
   v
Create Execution Record
   |
   v
Redis Queue
   |
   v
Execution Worker
   |
   v
Docker Container
   |
   v
Execute Code
   |
   +---- stdout
   |
   +---- stderr
   |
   +---- exit code
   |
   v
Execution Result
```

The API server should not perform long-running code execution.

---

# Code Execution Flow

Example:

```text
User clicks Run
       |
       v
POST /executions
       |
       v
Create execution ID
       |
       v
Queue execution job
       |
       v
Return execution ID
       |
       v
Worker receives job
       |
       v
Start isolated Docker container
       |
       v
Copy project files
       |
       v
Install required dependencies
       |
       v
Execute requested program
       |
       v
Capture output
       |
       v
Store execution result
       |
       v
Notify frontend
```

---

# WebSocket Architecture

WebSockets are used when the application needs continuous real-time communication.

REST is used for normal request/response operations.

REST examples:

```text
Create project
Rename project
Delete project
Create file
Save file
Get project
Get user
```

WebSocket examples:

```text
Execution output
Terminal output
Collaborative editing
Cursor movement
User presence
Typing indicators
Live preview events
```

---

# Execution WebSocket Flow

Starting execution:

```text
POST /executions
       |
       v
Execution created
       |
       v
executionId returned
```

The frontend then establishes a WebSocket connection:

```text
WebSocket /executions/:executionId
```

The worker produces output:

```text
Worker
  |
  +--> stdout
  |
  +--> stdout
  |
  +--> stderr
  |
  +--> completed
```

The WebSocket server forwards these events:

```text
Worker
  |
  v
WebSocket Server
  |
  v
Browser
```

This allows output to appear in the terminal while the program is still running.

---

# Terminal Architecture

The terminal will eventually provide an interactive shell inside an isolated project environment.

Flow:

```text
Browser
   |
   | WebSocket
   v
WebSocket Server
   |
   v
Terminal Session
   |
   v
Docker Container
   |
   v
Shell
```

The browser can send:

```text
ls
npm install
npm run dev
node index.js
```

The container sends output back through WebSocket.

The terminal should not execute commands directly on the host server.

---

# Redis and Job Queues

Redis will be used to decouple long-running workloads from the API server.

Example:

```text
API Server
   |
   v
Redis Queue
   |
   +---- Worker 1
   |
   +---- Worker 2
   |
   +---- Worker 3
```

This allows execution jobs to be distributed among multiple workers.

Example:

```text
User 1 -> Execution Job A
User 2 -> Execution Job B
User 3 -> Execution Job C

             |
             v

          Redis

       /     |     \
      v      v      v
 Worker  Worker  Worker
```

This architecture allows workers to be scaled horizontally.

---

# Docker Execution Architecture

Each execution should run inside an isolated container.

Example:

```text
Node.js Execution
       |
       v
node-runtime container
```

Python:

```text
Python Execution
       |
       v
python-runtime container
```

Java:

```text
Java Execution
       |
       v
java-runtime container
```

Future supported languages may include:

* JavaScript
* TypeScript
* Python
* Java
* C
* C++
* Go
* Rust
* PHP

---

# Execution Limits

User code must be restricted.

Potential restrictions include:

* CPU limit
* Memory limit
* Execution timeout
* Disk usage limit
* Process limit
* Network restrictions
* Container isolation
* Read-only host filesystem
* Restricted system access

Example:

```text
Execution
|
+-- CPU limit
+-- Memory limit
+-- Timeout
+-- Disk limit
+-- Network policy
```

These restrictions are essential because the platform executes untrusted code.

---

# GitHub Integration

A future GitHub integration will allow users to:

* Authenticate with GitHub
* Import repositories
* Clone repositories
* Push changes
* Pull changes
* Create commits
* Create branches
* Switch branches
* View Git history
* View diffs

Import flow:

```text
GitHub
   |
   v
Select Repository
   |
   v
Create IDE Project
   |
   v
Clone Repository
   |
   v
Project Files
```

Push flow:

```text
IDE
 |
 v
Git Changes
 |
 v
Commit
 |
 v
Push
 |
 v
GitHub Repository
```

---

# Real-Time Collaboration

The collaboration system will allow multiple users to work on the same project.

Example:

```text
Project
 |
 +-- User A
 |
 +-- User B
 |
 +-- User C
```

Each connected client establishes a WebSocket connection.

```text
User A
   |
   | WebSocket
   v
Collaboration Server
   ^
   | WebSocket
   |
User B
```

For collaborative editing, a CRDT-based solution such as Yjs can eventually be introduced.

The collaboration system can synchronize:

* File content
* Cursor position
* Text selections
* Active file
* User presence
* Typing state

---

# Presence

The system can show currently active users:

```text
Project Members

User A - Online
User B - Online
User C - Offline
```

WebSocket events can represent:

```text
connected
disconnected
presence_changed
file_opened
file_closed
```

---

# Version History

A future version history system will allow users to restore previous versions of files.

Example:

```text
App.tsx

Version 5
Version 4
Version 3
Version 2
Version 1
```

A version record can contain:

```text
id
fileId
content
createdAt
```

Future improvements can use Git-style diffs instead of storing complete copies.

---

# Environment Variables

Projects will support environment variables.

Example:

```text
DATABASE_URL
API_KEY
JWT_SECRET
PORT
```

The frontend should never expose sensitive project secrets.

The execution environment can receive variables when the container starts.

Example:

```text
Project Settings
      |
      v
Environment Variables
      |
      v
Execution Worker
      |
      v
Docker Container
```

---

# Live Preview

Web projects will eventually be able to run development servers.

Example:

```text
Project
   |
   v
Docker Container
   |
   v
npm run dev
   |
   v
Port 5173
   |
   v
Reverse Proxy
   |
   v
Project Preview URL
```

The preview URL could eventually look like:

```text
https://project-id.preview.example.com
```

---

# Deployment

A future deployment system can use the same container infrastructure.

Flow:

```text
Project
   |
   v
Build
   |
   v
Docker Image
   |
   v
Deployment
   |
   v
Running Container
   |
   v
Reverse Proxy
   |
   v
Public URL
```

This would allow the Online IDE to evolve into a complete development and deployment platform.

---

# Security

Security is a major requirement because the application executes user-provided code.

Important security areas include:

## Authentication

* Password hashing
* JWT validation
* Refresh token security
* Token expiration
* Secure cookies where applicable

## Authorization

Every protected resource should verify ownership or membership.

Example:

```text
User A
 |
 v
Project A
```

User A should not be able to access:

```text
Project B
```

unless User A has permission.

## Input Validation

Validate:

* Request body
* Query parameters
* Route parameters
* File names
* Project names
* Language selections

## Code Execution

Never execute untrusted code directly on the API server.

Use isolated containers and resource limits.

## Secrets

Never commit:

```text
.env
passwords
database credentials
JWT secrets
API keys
GitHub tokens
```

---

# Error Handling

The backend should return consistent error responses.

Example:

```json
{
  "status": 400,
  "message": "Validation failed",
  "error": "Invalid project name"
}
```

A common response structure can be represented using:

```text
ErrorResponse
```

and successful responses using:

```text
DataResponse<T>
```

The application should have centralized error handling middleware.

Flow:

```text
Controller
   |
   v
Service
   |
   v
Error
   |
   v
Error Middleware
   |
   v
Standard JSON Response
```

---

# Development Guidelines

## TypeScript

Use strict TypeScript.

The project uses:

```json
"strict": true
```

Avoid unnecessary `any`.

Prefer explicit types where they improve readability.

## Controllers

Controllers should remain small.

Avoid putting database queries directly inside controllers.

Bad:

```text
Controller
   |
   +-- Prisma query
   +-- Business logic
   +-- Validation
   +-- Response formatting
```

Preferred:

```text
Controller
   |
   v
Service
   |
   v
Repository
   |
   v
Prisma
```

## Services

Services contain business logic.

## Repositories

Repositories contain database access logic.

## Utilities

Utilities should contain reusable stateless functions.

## Types

Shared TypeScript interfaces and types should be placed in the types directory.

---

# Git Workflow

Create a feature branch:

```bash
git checkout -b feature/project-management
```

Make changes:

```bash
git add .
```

Commit:

```bash
git commit -m "Add project management"
```

Push:

```bash
git push origin feature/project-management
```

Keep commits focused.

Examples:

```text
Add authentication middleware
Add project repository
Add project creation API
Add Prisma project model
Add execution queue
Add WebSocket execution events
```

---

# Future Roadmap

The project is planned to evolve through the following stages.

## Phase 1: Backend Foundation

* Express configuration
* TypeScript configuration
* Environment configuration
* Error handling
* Response utilities
* PostgreSQL
* Prisma

## Phase 2: Authentication

* Registration
* Login
* Logout
* JWT access tokens
* Refresh tokens
* Password hashing
* Email verification
* Password reset

## Phase 3: Project Management

* Create project
* Rename project
* Delete project
* Project listing
* Project ownership
* Project templates

## Phase 4: File System

* Files
* Folders
* File tree
* File CRUD
* File movement
* File search
* Auto-save

## Phase 5: Code Execution

* Execution API
* Execution records
* Redis queue
* Worker architecture
* Docker sandbox
* Execution limits
* stdout/stderr handling

## Phase 6: WebSocket

* Execution streaming
* Terminal streaming
* Connection management
* WebSocket authentication
* Real-time execution status

## Phase 7: Multiple Languages

* Node.js
* Python
* Java
* C
* C++
* Go
* Rust

## Phase 8: Terminal

* Interactive terminal
* Persistent terminal sessions
* Container shell
* Terminal input/output streaming

## Phase 9: Git

* Git initialization
* Commits
* Branches
* Checkout
* Diff
* History

## Phase 10: GitHub

* GitHub authentication
* Repository import
* Clone
* Push
* Pull
* Repository synchronization

## Phase 11: Collaboration

* Shared projects
* Project members
* Permissions
* Collaborative editing
* Cursor synchronization
* Presence

## Phase 12: Preview

* Development servers
* Port management
* Reverse proxy
* Live preview
* Hot module replacement

## Phase 13: AI

* Code explanation
* Error explanation
* Code generation
* Refactoring
* Test generation
* Project-aware AI assistance

## Phase 14: Deployment

* Build environments
* Container deployment
* Domains
* Deployment logs
* Environment variables
* Application monitoring

## Phase 15: SaaS

* Organizations
* Teams
* Workspaces
* Subscription plans
* Usage limits
* Billing
* Usage analytics

---

# Scalability Plan

The initial implementation can run as a modular monolithic backend.

```text
Express
 |
 +-- Auth
 +-- Projects
 +-- Files
 +-- Execution
 +-- WebSocket
```

As usage increases, individual components can be separated.

Future architecture:

```text
                    Load Balancer
                         |
             +-----------+-----------+
             |           |           |
           API 1       API 2       API 3
             |           |           |
             +-----------+-----------+
                         |
                       Redis
                         |
              +----------+----------+
              |                     |
          Execution Queue       WebSocket
              |                     |
       +------+------+          Collaboration
       |      |      |
    Worker Worker Worker
       |      |      |
    Docker Docker Docker
```

The database remains:

```text
PostgreSQL
```

and project assets can eventually be moved to:

```text
Object Storage
```

such as S3-compatible storage.

---

# Scaling Principles

The system should follow these principles:

## Stateless API

API servers should avoid storing user session state locally.

This allows multiple API instances:

```text
Load Balancer
   |
   +-- API 1
   +-- API 2
   +-- API 3
```

## Horizontal Scaling

Workers should be independently scalable.

For example:

```text
Low traffic

2 execution workers
```

During high traffic:

```text
20 execution workers
```

## Queue-Based Execution

Long-running workloads should not block HTTP requests.

```text
HTTP Request
    |
    v
Queue
    |
    v
Worker
```

## Redis

Redis can provide:

* Job queues
* Caching
* Pub/Sub
* Distributed coordination
* Real-time event distribution

## Database Optimization

As the number of users grows:

* Add indexes
* Optimize queries
* Use transactions where necessary
* Use connection pooling
* Monitor slow queries
* Consider read replicas when required

---

# Current Development Philosophy

The project is intentionally being built incrementally.

The initial goal is not to build every feature immediately.

The development order is:

```text
Authentication
      |
      v
Project Management
      |
      v
File System
      |
      v
Monaco Editor Integration
      |
      v
Database Persistence
      |
      v
Code Execution
      |
      v
Docker Sandbox
      |
      v
Redis Queue
      |
      v
WebSocket Streaming
      |
      v
Terminal
      |
      v
Multiple Languages
      |
      v
Git
      |
      v
GitHub
      |
      v
Collaboration
      |
      v
Preview
      |
      v
AI
      |
      v
Deployment
      |
      v
Teams and Billing
```

This approach keeps the initial system manageable while ensuring that architectural decisions support future scaling.

---

# Contributing

Contributions are welcome.

Before making a major change:

1. Create a feature branch.
2. Keep changes focused.
3. Follow the existing project structure.
4. Use TypeScript types appropriately.
5. Avoid placing business logic inside controllers.
6. Add validation for external input.
7. Add tests for important functionality.
8. Update documentation when architecture changes.

---

# License

This project is currently under development.

Add the appropriate license here when the project license is finalized.

---

# Project Status

The project is actively under development.

The architecture is being built incrementally with the long-term goal of providing a scalable browser-based development environment supporting:

```text
Online IDE
Code Execution
Docker Sandboxing
Terminal
WebSockets
Real-Time Collaboration
Git
GitHub
Live Preview
AI Assistance
Deployment
Teams
```

The implementation status of individual features may differ from the architecture described in this document. Planned functionality is documented here to communicate the intended direction of the project.
