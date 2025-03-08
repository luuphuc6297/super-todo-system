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

A task management SaaS platform built with NestJS.

## Description

Super Todo System is a full-featured task management platform that offers different features based on user plans (free vs paid).

## Features

- Task management with CRUD operations
- User role-based access control
- Premium features for paid users
- RESTful API with Swagger documentation

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## API Documentation

After starting the application, you can access the Swagger documentation at:

```
http://localhost:8080/api/docs
```

## License

This project is [MIT licensed](LICENSE).

## Docker Guide

### Requirements
- Docker
- Docker Compose

### Installation and Running with Docker

#### Development Environment

```bash
# Copy .env.example to .env
cp .env.example .env

# Start the application in development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

#### Production Environment

```bash
# Copy .env.example to .env and configure for production
cp .env.example .env

# Start the application in production environment
docker-compose up -d

# View logs
docker-compose logs -f
```

### Version Management

When changes are made and version needs to be updated:

```bash
# Stop current containers
docker-compose down

# Rebuild image with new changes
docker-compose build

# Restart with new image
docker-compose up -d
```

### Useful Docker Commands

```bash
# View container status
docker-compose ps

# Stop all containers
docker-compose down

# Remove all containers and volumes
docker-compose down -v

# View logs of specific container
docker-compose logs -f api

# Access container shell
docker-compose exec api sh
```

## SQLite Web UI & Seed Data

The application includes:

1. **SQLite Web UI**: A web-based interface to view and manage the SQLite database
   - Access at http://localhost:8080 after starting the application with Docker
   - View tables, run queries, and explore data

2. **Seed Data**: Automatically populates the database with test data on startup
   - Users (admin and regular users)
   - Categories
   - Tags
   - Tasks
   - Task-Tag relationships

### Default Credentials

- Admin: admin@example.com / Password123!
- Free User: user1@example.com / Password123!
- Paid User: user2@example.com / Password123!
