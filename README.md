<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Super Todo System

A task management SaaS platform built with NestJS that offers different features based on user plans (free vs paid).

## Live Demo

The application is deployed on Railway at:
- URL: [https://super-todo-system-production.up.railway.app/](https://super-todo-system-production.up.railway.app/)
- Swagger Documentation: [https://super-todo-system-production.up.railway.app/api/docs](https://super-todo-system-production.up.railway.app/api/docs)

**Note**: If you encounter any issues with the public domain, please clone the repository and run it locally.

## Repository

The source code is available on GitHub:
[https://github.com/luuphuc6297/super-todo-system](https://github.com/luuphuc6297/super-todo-system)

## Features

- Task management with CRUD operations
- User role-based access control (Free vs Paid users)
- Different data visibility based on user role
- RESTful API with Swagger documentation

## Debug APIs

The application includes special debug endpoints to inspect the database tables:

- **List All Tables**: `GET /api/debug/tables`
  - Returns a list of all tables in the database
  - Useful for understanding the database schema

- **View Table Data**: `GET /api/debug/tables/:tableName`
  - Returns all records from the specified table
  - Replace `:tableName` with the name of the table you want to view (e.g., `users`, `tasks`, `categories`)

These endpoints are particularly useful when working with the in-memory database to verify data structure and content.

## Setup Instructions

### Prerequisites

- Node.js (v18 or later)
- pnpm (v8 or later)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/luuphuc6297/super-todo-system.git
cd super-todo-system
```

2. Install dependencies:
```bash
pnpm install
```

3. Copy the environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
pnpm run start:dev
```

5. Access the application:
- API: http://localhost:8080
- Swagger Documentation: http://localhost:8080/api/docs
- Debug Tables: http://localhost:8080/api/debug/tables

## Architecture Decisions

### Backend Architecture

The application follows a modular architecture based on NestJS framework:

1. **Modules**: Organized by domain (tasks, users, auth, etc.)
2. **Controllers**: Handle HTTP requests and responses
3. **Services**: Contain business logic
4. **Repositories**: Handle data access
5. **Models**: Define data structures
6. **DTOs**: Define data transfer objects
7. **Guards**: Handle authentication and authorization
8. **Interceptors**: Process requests/responses (e.g., filtering data based on user role)
9. **Middlewares**: Process requests (e.g., extracting user role from URL)

### Module Architecture

The application is structured around several key modules that interact with each other:

```
                                  ┌─────────────┐
                                  │  AppModule  │
                                  └──────┬──────┘
                                         │
                 ┌────────────────┬──────┴───────┬────────────────┐
                 │                │              │                │
        ┌────────▼─────────┐     ┌▼─────────┐    ▼          ┌─────▼─────┐
        │  InfrasModule    │     │RouterModule    │          │HealthModule│
        └────────┬─────────┘     └┬─────────┘                └─────┬─────┘
                 │                │                                 │
┌────────────────┼────────────────┼─────────────────────┐          │
│                │                │                     │          │
▼                ▼                ▼                     ▼          ▼
DatabaseModule  AuthModule    ErrorModule        ┌─────────────┐  Health
     │             │             │               │RoutesModules│  Checks
     │             │             │               └──────┬──────┘
     │             │             │                      │
     │             │             │         ┌────────────┼───────────┐
     │             │             │         │            │           │
     ▼             ▼             ▼         ▼            ▼           ▼
  Database      Security      Exception  UserModule  TaskModule  CategoryModule
  Services                    Handling      │            │           │
                                            │            │           │
                                            ▼            ▼           ▼
                                         Models       Models      Models
                                         Services     Services    Services
                                         Repos        Repos       Repos
```

Key module interactions:
- **AppModule**: The root module that imports and coordinates all other modules
- **InfrasModule**: Provides infrastructure services like database, authentication, error handling
- **RouterModule**: Configures API routes and connects them to the appropriate controllers
- **Domain Modules** (User, Task, Category, Tag): Implement business logic for specific domains
- **Authentication**: Handles user authentication and authorization across the application

### Folder Structure

The project follows a well-organized folder structure:

```
src/
├── app/                      # Application core
│   ├── controllers/          # Main application controllers
│   ├── services/             # Main application services
│   ├── constants/            # Application constants
│   ├── docs/                 # Documentation related files
│   └── serializations/       # Response serialization
├── configs/                  # Configuration files
├── infrastructures/          # Infrastructure components
│   ├── authentication/       # Authentication services and guards
│   ├── database/             # Database configuration and services
│   ├── error/                # Error handling
│   ├── health/               # Health check endpoints
│   ├── helper/               # Helper utilities
│   ├── http/                 # HTTP related utilities
│   ├── logging/              # Logging services
│   ├── seed/                 # Database seeding
│   └── validation/           # Input validation
├── languages/                # Internationalization files
├── modules/                  # Domain modules
│   ├── category/             # Category domain
│   │   ├── controllers/      # Category controllers
│   │   ├── dtos/             # Category data transfer objects
│   │   ├── models/           # Category data models
│   │   ├── repositories/     # Category data access
│   │   └── services/         # Category business logic
│   ├── task/                 # Task domain (similar structure)
│   ├── tag/                  # Tag domain (similar structure)
│   ├── user/                 # User domain (similar structure)
│   ├── payment/              # Payment domain (similar structure)
│   └── subscription/         # Subscription domain (similar structure)
├── router/                   # API routing
│   └── routes/               # Route definitions
├── main.ts                   # Application entry point
└── swagger.ts               # Swagger documentation setup
```

### Database

- In-memory SQLite database is used for simplicity and ease of setup
- Sequelize ORM is used for database operations
- Database tables can be inspected using the debug APIs

### Authentication

- JWT-based authentication
- Role-based access control (FREE, PAID, ADMIN)

### User Role Recognition

The system recognizes two types of users via URL parameter:
- Free users: `/?userRole=free`
- Paid users: `/?userRole=paid`

This allows testing different user experiences without changing the actual user role in the database.

## User Roles and Features

### Free Plan Users

- Can see basic todo information (title, status, dates)
- Can perform CRUD operations on TodoItems
- Cannot see or add notes to todos

### Paid Plan Users

- All features available to Free users
- Can see and add notes for each todo
- Additional features for task management

### Admin Users

- Full access to all features
- Can manage users and their roles

## Default Credentials

- Admin: admin@example.com / password
- Free User: free@example.com / password
- Paid User: paid@example.com / password

## API Documentation

The API is documented using Swagger. After starting the application, you can access the documentation at:

```
http://localhost:8080/api/docs
```

For the deployed version:

```
https://super-todo-system-production.up.railway.app/api/docs
```

### API debug tables

- **Debug**: `/api/debug/tables`, `/api/debug/tables/:tableName`

## Testing

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Assumptions and Notes

1. **User Role from URL**: The system allows overriding the user role via URL parameter (`/?userRole=free` or `/?userRole=paid`) for testing purposes. This doesn't change the actual user role in the database.

2. **Data Filtering**: When a free user accesses task data, the notes field is automatically filtered out from the response.

3. **Security**: In a production environment, additional security measures would be implemented, such as rate limiting, HTTPS, and more robust authentication.

4. **Database**: In-memory SQLite is used for simplicity. In a production environment, a more robust database like PostgreSQL would be used.

5. **Deployment**: The application is deployed on Railway with an in-memory database, which means data will be reset when the service restarts.

## License

This project is [MIT licensed](LICENSE).
