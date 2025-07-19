# CodeMaster Academy - Educational Web Application

## Overview

CodeMaster Academy is a full-stack educational web application designed to help users learn programming languages, become certified-ready Solutions Architects and DevOps Engineers, and understand AI tools and practices. The application provides interactive learning paths for the top 10 programming languages with hands-on coding exercises, quizzes, and progress tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Code Editor**: Custom CodeEditor component (placeholder for Monaco Editor integration)

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Authentication**: Replit Auth with OpenID Connect integration
- **Session Management**: Express sessions with PostgreSQL storage

### Database Schema
The application uses a comprehensive schema supporting:
- User management with XP, levels, and streak tracking
- Course structure with tracks (programming, devops, architecture)
- Chapter-based learning progression
- Quiz system with attempts tracking
- Certificate management
- User progress tracking per course/chapter

## Key Components

### Authentication System
- **Provider**: Replit Auth with OIDC
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **User Management**: Automatic user creation and profile management
- **Authorization**: Route-level protection with middleware

### Educational Content Structure
- **Courses**: Organized by track (programming, devops, architecture)
- **Chapters**: Sequential learning units within courses
- **Quizzes**: Interactive assessments with multiple choice questions
- **Progress Tracking**: XP system, completion percentages, streak tracking
- **Certificates**: Achievement system for course completion

### Interactive Learning Features
- **Code Editor**: In-browser code editing with syntax highlighting
- **Code Execution**: Server-side or client-side code running capability
- **Quiz System**: Modal-based quizzes with immediate feedback
- **Progress Visualization**: Progress bars, XP tracking, and achievement badges

### UI/UX Components
- **Design System**: Consistent component library using shadcn/ui
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode**: CSS variable-based theming support
- **Navigation**: Sticky navigation with user profile and progress indicators

## Data Flow

### Authentication Flow
1. Unauthenticated users see landing page
2. Login redirects to Replit Auth OIDC flow
3. Successful auth creates/updates user in database
4. Session established with PostgreSQL storage
5. Protected routes accessible with user context

### Learning Content Flow
1. User selects course from dashboard
2. Course chapters loaded from database
3. Progress tracked per chapter completion
4. Quiz attempts stored with scoring
5. XP and achievements updated based on progress

### API Structure
- **Auth Routes**: `/api/auth/*` for authentication flow
- **Course Routes**: `/api/courses/*` for course management
- **Progress Routes**: `/api/progress/*` for tracking user advancement
- **Quiz Routes**: `/api/quiz/*` for assessment functionality

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless database
- **Authentication**: Replit Auth OIDC service
- **UI Components**: Radix UI primitives for accessibility
- **Code Editor**: Placeholder for Monaco Editor integration
- **Date Handling**: date-fns for date manipulation

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **Drizzle Kit**: Database schema migrations and management
- **ESBuild**: Production build optimization
- **Vite**: Development server with HMR

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite development server with Express API proxy
- **Database**: Neon development database with schema synchronization
- **Authentication**: Replit Auth development configuration
- **Hot Reload**: Full-stack development with automatic reloading

### Production Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: ESBuild bundles Express server to `dist/index.js`
3. **Database Setup**: Drizzle migrations ensure schema consistency
4. **Static Serving**: Express serves built frontend files

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **SESSION_SECRET**: Session encryption key (required)
- **REPLIT_DOMAINS**: Allowed domains for Replit Auth
- **ISSUER_URL**: OIDC issuer URL for authentication
- **NODE_ENV**: Environment flag for development/production modes

### Scalability Considerations
- **Database**: Serverless PostgreSQL allows automatic scaling
- **Session Storage**: PostgreSQL sessions support horizontal scaling
- **Static Assets**: Frontend builds can be served via CDN
- **API**: Stateless Express server supports load balancing