# HistorySnap - Educational History Content Generator

## Overview

HistorySnap is a full-stack educational web application that transforms historical topics into engaging 4-page comic books using OpenAI's GPT-4o and DALL-E 3. The application is designed for young learners aged 10+ and includes content filtering to ensure age-appropriate material.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and build processes
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React hooks with TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js 20 with TypeScript
- **Framework**: Express.js for REST API
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Development**: tsx for TypeScript execution in development

### Build and Deployment
- **Development**: Concurrent client and server with hot reload
- **Production Build**: Vite for client, esbuild for server bundling
- **Deployment**: Replit autoscale with PostgreSQL 16 module

## Key Components

### Client-Side Components
1. **Home Page (`/`)**: Main interface for topic input and comic book generation
2. **UI Components**: Comprehensive shadcn/ui component library including:
   - Form controls (Input, Button, Select, etc.)
   - Layout components (Card, Dialog, Sheet, etc.)
   - Feedback components (Toast, Alert, Progress, etc.)
3. **Content Filtering**: Built-in topic validation to block inappropriate content
4. **Comic Generation Interface**: OpenAI-powered comic book creation with real-time image display

### Server-Side Components
1. **Express Server**: RESTful API with middleware for logging and error handling
2. **OpenAI Integration**: GPT-4o for script generation and DALL-E 3 for image creation
3. **Comic Generation API**: `/api/generate-comic` endpoint for full comic book creation
4. **Storage Interface**: Abstracted storage layer with in-memory implementation
5. **User Management**: Basic user schema with authentication support
6. **Route Structure**: Organized API routes with `/api` prefix

### Database Schema
- **Users Table**: Basic user management with username/password authentication
- **Schema Validation**: Zod integration for type-safe database operations
- **Migrations**: Drizzle Kit for database schema management

## Data Flow

1. **User Input**: Historical topic entered through web interface
2. **Content Filtering**: Client-side validation against blocked topics list
3. **API Request**: Validated requests sent to Express backend
4. **Script Generation**: OpenAI GPT-4o creates 4-page comic book scripts separated by "HUZZAA"
5. **Image Generation**: DALL-E 3 creates historically accurate comic images for each page
6. **Response Handling**: Generated comic pages displayed directly on webpage
7. **Client Updates**: React state management updates UI with comic book results

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Type-safe database ORM
- **@radix-ui/react-***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight React router
- **openai**: OpenAI API client for GPT-4o and DALL-E 3 integration

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Development Environment
- **Port Configuration**: Client on port 5000, external port 80
- **Hot Reload**: Vite dev server with HMR enabled
- **Database**: PostgreSQL 16 module with automatic provisioning
- **Environment**: Node.js 20 with stable Nix channel

### Production Build
- **Client Build**: Static assets generated to `dist/public`
- **Server Build**: Bundled ESM output to `dist/index.js`
- **Asset Serving**: Express serves static files in production
- **Database Migrations**: Manual push via `npm run db:push`

### Replit Configuration
- **Autoscale Deployment**: Automatic scaling based on demand
- **Module Integration**: PostgreSQL, Node.js, and web modules
- **Workflow Support**: Custom run button and shell execution

## Changelog

```
Changelog:
- June 14, 2025. Initial setup
- June 14, 2025. Migrated from Replit Agent to standard Replit environment
- June 14, 2025. Integrated OpenAI GPT-4o and DALL-E 3 for comic book generation
- June 14, 2025. Implemented 4-page comic book creation with script and image generation
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```