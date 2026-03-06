# envctl UI

A modern Angular 17 UI for the envctl internal developer platform API.

## Features

- **Authentication**: User registration and login with JWT token management
- **Projects Management**: Full CRUD operations for projects
- **Environments Management**: Create and manage environments (ephemeral/persistent) with real-time status tracking
- **Deployments Management**: Track deployments with lifecycle status monitoring

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Angular CLI 17+
- The envctl backend API running (either locally or use the demo URL)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure the API URL:
   - For local development: Update `src/environments/environment.ts` with your local API URL (default: `http://127.0.0.1:8000`)
   - For production: Update `src/environments/environment.prod.ts` with the production API URL (default: demo URL)

### Running the Application

```bash
# Development server
npm start
# or
ng serve

# Navigate to http://localhost:4200
```

### Building for Production

```bash
npm run build
# or
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   └── auth/           # Authentication services, guards, interceptors
│   ├── features/
│   │   ├── auth/           # Login and register components
│   │   ├── projects/       # Project management
│   │   ├── environments/   # Environment management
│   │   └── deployments/    # Deployment tracking
│   ├── shared/
│   │   ├── components/     # Reusable components (status badges, loading spinner)
│   │   └── models/         # TypeScript interfaces
│   ├── layout/
│   │   └── header/         # Header navigation component
│   └── app.routes.ts       # Route configuration
├── environments/            # Environment configuration (API URLs)
└── styles.css               # Global styles
```

## Usage

1. **Register/Login**: Start by registering a new account or logging in
2. **Create Projects**: Create projects to organize your applications
3. **Create Environments**: Create environments for each project (ephemeral or persistent)
4. **Deploy**: Create deployments to track version releases

## API Configuration

The application is configured to use the envctl API. By default:
- **Development**: `http://127.0.0.1:8000`
- **Production**: `https://internal-platform-api-3vr6excz6q-uc.a.run.app`

You can change these in `src/environments/environment.ts` and `src/environments/environment.prod.ts`.

## Features Details

### Real-time Status Tracking
- Environments and deployments automatically poll for status updates
- Status badges show provisioning, running, succeeded, failed states
- Color-coded badges for easy visual feedback

### Protected Routes
- All project/environment/deployment routes are protected by authentication
- Automatic redirect to login if not authenticated
- JWT token automatically included in all API requests

### Responsive Design
- Mobile-friendly layout
- Clean, modern UI with intuitive navigation
- Breadcrumb navigation for easy hierarchy navigation

## Development

### Code Structure
- Uses Angular 17 standalone components
- Feature-based architecture
- Shared components and services
- TypeScript interfaces for type safety

### Key Services
- `AuthService`: Handles authentication, token management
- `ProjectsService`: Project CRUD operations
- `EnvironmentsService`: Environment management
- `DeploymentsService`: Deployment tracking

## License

MIT
