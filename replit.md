# TTS Explorer - Crossword Game

## Overview

TTS Explorer is a progressive crossword puzzle game built with a modern full-stack architecture. The application features 4 difficulty levels with increasing complexity, a comprehensive scoring system, and an automatic hint mechanism. Players progress through levels by solving crossword puzzles, earning points, and unlocking new challenges.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks with custom game state management
- **UI Framework**: Shadcn/UI components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom game-specific color variables
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript throughout the stack
- **API Design**: RESTful API with clear resource endpoints
- **Session Management**: Express sessions with PostgreSQL storage
- **Error Handling**: Centralized error middleware with proper HTTP status codes

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM
- **Cloud Provider**: Neon Database for serverless PostgreSQL
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Development Storage**: In-memory storage class for rapid development

## Key Components

### Game Engine
- **Grid System**: Dynamic crossword grid generation with cell state management
- **Clue System**: Directional clues (across/down) with automatic validation
- **Progress Tracking**: Real-time score calculation and completion detection
- **Hint Mechanism**: Automatic letter reveals on wrong answers with point penalties

### User Interface
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Component Library**: Comprehensive UI components from Shadcn/UI
- **Game Views**: Homepage, level selection, and gameplay interfaces
- **Modal System**: Completion dialogs and instruction overlays

### Data Models
- **Users**: Basic authentication with username/password
- **Game Progress**: Level-specific progress with completion tracking
- **Game Stats**: Global player statistics and unlock requirements
- **Grid State**: Serialized crossword state with JSON storage

## Data Flow

### Game Progression
1. Player selects level from homepage
2. Level data loads with crossword grid and clues
3. Player interacts with grid cells and submits answers
4. System validates answers and updates score
5. Wrong answers trigger automatic hint system
6. Level completion updates global stats and unlocks next level

### State Management
- React hooks manage local game state
- TanStack Query handles server state synchronization
- Optimistic updates for responsive user experience
- Automatic cache invalidation on mutations

### API Communication
- RESTful endpoints for CRUD operations
- JSON request/response format
- Error handling with appropriate HTTP status codes
- Automatic retry logic for failed requests

## External Dependencies

### Core Libraries
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe database ORM
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **wouter**: Lightweight React router
- **date-fns**: Date manipulation utilities

### UI Components
- **@radix-ui/***: Accessible UI primitives
- **lucide-react**: Icon library
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management

### Development Tools
- **vite**: Fast build tool and dev server
- **typescript**: Type safety and development experience
- **drizzle-kit**: Database schema management
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Build Process
- Vite builds optimized client bundle to `dist/public`
- ESBuild compiles server TypeScript to `dist/index.js`
- Shared schema compiled for both client and server

### Environment Configuration
- Database URL configuration through environment variables
- Development vs production environment detection
- Automatic PostgreSQL connection management

### Hosting Considerations
- Static frontend assets served from Express
- Single server deployment with built-in static file serving
- PostgreSQL database hosted on Neon serverless platform

### Development Workflow
- Hot module replacement in development
- TypeScript compilation checking
- Database schema push commands for rapid iteration

## Changelog

- July 07, 2025. Initial setup
- July 07, 2025. Updated Level 1 to car brand questions (10 total), implemented 2-hint limit per clue

## User Preferences

Preferred communication style: Simple, everyday language.