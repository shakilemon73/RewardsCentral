# Overview

RewardsPay is a mobile-first rewards application that allows users to earn points by completing various tasks such as surveys, watching ads, and signing up for offers. Users can then redeem their accumulated points for gift cards and PayPal cash rewards. The application features a clean, modern interface with a vibrant color scheme optimized for mobile devices while maintaining desktop compatibility.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built using React with TypeScript, utilizing a component-based architecture. The application uses Vite as the build tool and development server. Key architectural decisions include:

- **UI Framework**: shadcn/ui components built on Radix UI primitives for consistent, accessible design
- **State Management**: React Query (TanStack Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **Mobile-First Design**: Responsive layout with dedicated mobile navigation and desktop sidebar
- **Authentication**: Session-based authentication integrated with Replit Auth

## Backend Architecture
The backend follows a RESTful API design pattern using Express.js with TypeScript:

- **Server Framework**: Express.js with middleware for JSON parsing, logging, and error handling
- **Database Layer**: Drizzle ORM with PostgreSQL using Neon serverless database
- **Authentication**: Replit Auth with OpenID Connect for user authentication and session management
- **API Design**: RESTful endpoints organized by feature (tasks, rewards, user management)
- **Data Validation**: Zod schemas for request/response validation integrated with Drizzle

## Database Design
PostgreSQL database with the following core entities:

- **Users**: Store user profiles, points balance, and statistics
- **Tasks**: Define available tasks with type, points value, and metadata
- **User Task Completions**: Track completed tasks and points earned
- **Rewards**: Define available rewards with point costs and brand information
- **User Reward Redemptions**: Track redeemed rewards and processing status
- **Sessions**: Store user session data for authentication

## Authentication System
Replit Auth integration providing:

- OpenID Connect authentication flow
- Session-based user management with PostgreSQL session storage
- User profile synchronization from Replit identity
- Protected API endpoints with middleware-based authorization

## Task and Reward System
Core business logic handling:

- **Task Types**: Surveys (50-200 points), Ads (10 points), Offers (100 points)
- **Points Management**: Atomic point transactions with user balance updates
- **Reward Redemption**: Gift card and PayPal cash redemption with processing workflow
- **Activity Tracking**: Complete audit trail of user actions and point transactions

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## Authentication
- **Replit Auth**: OpenID Connect provider for user authentication
- **openid-client**: OpenID Connect client library for authentication flow

## Frontend Libraries
- **React Query**: Server state management and API data fetching
- **shadcn/ui**: Component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Wouter**: Lightweight client-side routing library

## Development Tools
- **Vite**: Build tool and development server with HMR
- **Drizzle Kit**: Database schema management and migrations
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds

## Future Integrations (Planned)
- **Pollfish SDK**: Survey integration for task completion
- **AdMob**: Rewarded video ad integration
- **Tango API**: Gift card fulfillment and reward processing