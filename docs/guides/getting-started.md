# Getting Started with Synor

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- pnpm (v8 or higher)
- Docker (optional, for containerized development)
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/synor.git
cd synor
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration settings.

## Project Structure

The project follows a monorepo structure:

- `apps/web`: Frontend application
- `apps/api`: Backend API service
- `packages/core`: Core optimization engine
- `packages/ai`: AI models and training
- `packages/common`: Shared utilities

## Development Setup

### Frontend Development

1. Start the frontend development server:
```bash
cd apps/web
pnpm dev
```

The application will be available at `http://localhost:3000`

### Backend Development

1. Start the API service:
```bash
cd apps/api
pnpm dev
```

The API will be available at `http://localhost:4000`

### Full Stack Development

Use the root level command to start all services:
```bash
pnpm dev
```

## Running Tests

### Unit Tests
```bash
pnpm test
```

### Integration Tests
```bash
pnpm test:integration
```

### E2E Tests
```bash
pnpm test:e2e
```

## Building for Production

1. Build all packages:
```bash
pnpm build
```

2. Production startup:
```bash
pnpm start
```

## Docker Deployment

1. Build Docker images:
```bash
docker-compose build
```

2. Start services:
```bash
docker-compose up -d
```

## Common Development Tasks

### Creating a New Component

1. Create component file in `apps/web/src/components/`
2. Export from index file
3. Add tests in `apps/web/src/components/__tests__/`

### Adding an API Endpoint

1. Create controller in `apps/api/src/controllers/`
2. Add service in `apps/api/src/services/`
3. Define routes in `apps/api/src/routes/`
4. Add tests in `apps/api/tests/`

### Working with Smart Contracts

1. Add test contracts in `tests/contracts/`
2. Update core engine in `packages/core/src/`
3. Add corresponding tests

## Development Guidelines

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Follow component naming conventions
- Write meaningful commit messages

### Testing

- Write unit tests for all new features
- Include integration tests for API endpoints
- Add E2E tests for critical paths
- Maintain test coverage above 80%

### Documentation

- Document all public APIs
- Include JSDoc comments for functions
- Update README files when needed
- Keep architecture docs current

## Troubleshooting

### Common Issues

1. Package Resolution Issues
```bash
pnpm clean && pnpm install
```

2. Build Errors
```bash
pnpm clean:build && pnpm build
```

3. Test Database Issues
```bash
pnpm db:reset:test
```

### Getting Help

- Check existing issues on GitHub
- Join our Discord community
- Review documentation in `/docs`
- Contact the maintainers

## Next Steps

1. Review architecture documentation
2. Try the optimization features
3. Run example contracts
4. Join the community

## Contributing

Please read `CONTRIBUTING.md` for details on:
- Code of Conduct
- Development process
- Pull request guidelines
- Documentation requirements