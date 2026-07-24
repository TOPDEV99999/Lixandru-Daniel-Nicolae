# Implementation Plan: Local Backend Integration

## Overview

This plan implements a complete local backend to replace Base44 dependencies, transforming the project into a standalone React application with Node.js/Express backend, SQLite database, and local authentication system. The implementation follows an incremental approach, delivering working functionality at each phase.

## Tasks

- [x] 1. Foundation Setup and Dependency Management
  - Remove Base44 dependencies and set up project structure
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 2. Core Backend Infrastructure
  - Set up Express server with TypeScript, routing, and error handling
  - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6_

- [x] 3. Database Layer Implementation
  - Convert Base44 entities to Prisma schema and set up SQLite database
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 4. Authentication System
  - Implement JWT-based authentication with user registration and login
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

- [x] 5. API Endpoint Migration - Phase 1 (Contact and Meeting)
  - Migrate contact and meeting functionality from Base44 functions
  - _Requirements: 4.1, 4.2, 4.3, 4.7, 4.8, 4.9_

- [x] 6. API Endpoint Migration - Phase 2 (Visit and Admin)
  - Migrate visit tracking and admin functionality from Base44 functions
  - _Requirements: 4.5, 4.6, 4.7, 4.8, 4.9_

- [*] 7. Frontend Integration
  - Replace Base44 client with local API client and update frontend components
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

- [x] 8. Development Environment and Testing
  - Set up development workflow, testing framework, and monitoring
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8_

- [x] 9. Checkpoint - Core System Validation
  - Ensure all tests pass, ask the user if questions arise.

## Detailed Tasks

### Task 1: Foundation Setup and Dependency Management
- [x] 1.1 Update package.json to remove Base44 dependencies
  - Remove `@base44/sdk` and `@base44/vite-plugin` from dependencies
  - Update package-lock.json to reflect dependency changes
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 1.2 Create backend directory structure
  - Create `server/` directory with standard Node.js project structure
  - Set up basic package.json for backend with Express, TypeScript, and Prisma
  - _Requirements: 1.4, 1.5_

- [x] 1.3 Remove Base44 environment variables
  - Update `.env.local` to remove Base44-specific variables
  - Add local backend configuration variables (PORT, DATABASE_URL, JWT_SECRET)
  - _Requirements: 1.4_

- [x] 1.4 Write unit tests for dependency validation
  - Verify no Base44 dependencies remain in package.json
  - Test environment variable configuration
  - _Requirements: 1.6_

### Task 2: Core Backend Infrastructure
- [x] 2.1 Set up Express server with TypeScript configuration
  - Create `server/src/index.ts` as server entry point
  - Configure TypeScript with proper compiler options
  - Set up Express middleware (CORS, JSON parsing, logging)
  - _Requirements: 2.1, 2.2_

- [x] 2.2 Implement basic routing and error handling
  - Create health check endpoint (`GET /health`)
  - Implement global error handling middleware
  - Add request logging middleware
  - _Requirements: 2.3, 2.5_

- [x] 2.3 Configure server startup and process management
  - Set up server to run on configurable port (default: 3001)
  - Implement graceful shutdown handling
  - Add process error handling
  - _Requirements: 2.1, 2.6_

- [x] 2.4 Write integration tests for server infrastructure
  - Test server startup and health endpoint
  - Test error handling and CORS configuration
  - _Requirements: 2.2, 2.3_

### Task 3: Database Layer Implementation
- [x] 3.1 Convert Base44 entity schemas to Prisma schema
  - Create `server/prisma/schema.prisma` with models:
    - ContactMessage (from ContactMessage.jsonc)
    - MeetingRequest (from MeetingRequest.jsonc) 
    - User (new for authentication)
    - Visitor (from Visitor.jsonc)
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 3.2 Set up SQLite database and Prisma client
  - Configure Prisma with SQLite as local database
  - Generate Prisma client with `npx prisma generate`
  - Create initial database migration
  - _Requirements: 3.5, 3.6_

- [x] 3.3 Implement repository pattern for data access
  - Create repository interfaces in `server/src/repositories/`
  - Implement ContactRepository, MeetingRepository, UserRepository
  - Add base repository with common CRUD operations
  - _Requirements: 3.7_

- [x] 3.4 Create validation layer with Zod schemas
  - Implement Zod validation schemas for all models
  - Create validation utilities in `server/src/validation/`
  - Add input sanitization for security
  - _Requirements: 3.8_

- [x] 3.5 Write property tests for data model validation
  - Test Zod validation schemas with edge cases
  - Test model conversion from Base44 schemas
  - _Requirements: 3.8_

### Task 4: Authentication System
- [x] 4.1 Implement User model and registration
  - Create User model with email, password hash, name, and role fields
  - Implement password hashing with bcrypt
  - Create user registration service
  - _Requirements: 5.1, 5.8_

- [x] 4.2 Create JWT-based authentication middleware
  - Implement JWT token generation and verification
  - Create authentication middleware for protected routes
  - Add token refresh mechanism
  - _Requirements: 5.2, 5.3, 5.5_

- [x] 4.3 Implement authentication API endpoints
  - Create `POST /api/auth/register` for user registration
  - Create `POST /api/auth/login` for user login
  - Create `POST /api/auth/refresh` for token refresh
  - Create `GET /api/auth/me` for current user info
  - _Requirements: 5.2, 5.4_

- [x] 4.4 Add role-based access control
  - Implement middleware to check user roles
  - Add admin role verification for protected endpoints
  - Create permission checking utilities
  - _Requirements: 5.4, 5.6_

- [x] 4.5 Write integration tests for authentication flow
  - Test user registration and login flow
  - Test JWT token validation and expiration
  - Test role-based access control
  - _Requirements: 5.7_

### Task 5: API Endpoint Migration - Phase 1 (Contact and Meeting)
- [x] 5.1 Migrate `submitContact` function to Express endpoint
  - Create `POST /api/contact` endpoint
  - Implement validation using ContactMessage Zod schema
  - Add business logic for contact message processing
  - _Requirements: 4.1, 4.7, 4.8_

- [x] 5.2 Migrate `submitMeeting` function to Express endpoint
  - Create `POST /api/meeting` endpoint
  - Implement validation using MeetingRequest Zod schema
  - Add availability checking logic
  - _Requirements: 4.2, 4.7, 4.8_

- [x] 5.3 Migrate `getAvailability` function to Express endpoint
  - Create `GET /api/availability` endpoint
  - Implement date/time availability checking
  - Add caching for performance optimization
  - _Requirements: 4.3, 4.7, 4.8_

- [x] 5.4 Migrate `respondMeeting` function to Express endpoint
  - Create `POST /api/meeting/:id/respond` endpoint
  - Implement meeting response validation
  - Add notification logic for meeting responses
  - _Requirements: 4.4, 4.7, 4.8_

- [x] 5.5 Write integration tests for contact and meeting endpoints
  - Test contact form submission with validation
  - Test meeting creation and response flow
  - Test availability checking functionality
  - _Requirements: 4.9_

### Task 6: API Endpoint Migration - Phase 2 (Visit and Admin)
- [x] 6.1 Migrate `trackVisit` function to Express endpoint
  - Create `POST /api/visit` endpoint
  - Implement visitor tracking with IP and user agent
  - Add geolocation lookup for country detection
  - _Requirements: 4.5, 4.7, 4.8_

- [x] 6.2 Migrate `getAdminData` function to Express endpoint
  - Create `GET /api/admin/data` endpoint
  - Implement admin data aggregation (contacts, meetings, visitors)
  - Add role-based access control (admin only)
  - _Requirements: 4.6, 4.7, 4.8, 5.6_

- [x] 6.3 Create admin dashboard endpoints
  - Add `GET /api/admin/contacts` for contact management
  - Add `GET /api/admin/meetings` for meeting management
  - Add `GET /api/admin/visitors` for visitor analytics
  - _Requirements: 4.6_

- [x] 6.4 Write integration tests for visit and admin endpoints
  - Test visitor tracking with IP detection
  - Test admin endpoint access control
  - Test data aggregation functionality
  - _Requirements: 4.9_

### Task 7: Frontend Integration
- [x] 7.1 Create new API client to replace Base44 SDK
  - Create `src/api/localClient.js` with Axios configuration
  - Implement request/response interceptors for authentication
  - Add error handling and retry logic
  - _Requirements: 8.1, 8.2, 8.5, 8.7_

- [ ] 7.2 Update frontend components to use new API client
  - Replace imports from `base44Client.js` to `localClient.js`
  - Update component methods to use new API endpoints
  - Maintain existing component interfaces
  - _Requirements: 8.1_

- [x] 7.3 Implement authentication context for React
  - Create authentication context provider
  - Add login/logout functionality with token management
  - Implement protected route component
  - _Requirements: 8.2_

- [ ] 7.4 Add error handling and loading states
  - Implement global error handling for API failures
  - Add loading indicators for async operations
  - Create user-friendly error messages
  - _Requirements: 8.3, 8.5_

- [ ] 7.5 Update environment configuration
  - Add `VITE_API_BASE_URL` environment variable
  - Update build configuration for local backend
  - Test frontend-backend connectivity
  - _Requirements: 8.6_

- [x] 7.6 Write end-to-end tests for critical user flows
  - Test user registration and login flow
  - Test contact form submission
  - Test meeting scheduling flow
  - _Requirements: 8.8_

### Task 8: Development Environment and Testing
- [x] 8.1 Set up concurrent development server
  - Update root package.json scripts for `npm run dev`
  - Configure concurrently to run backend and frontend together
  - Add hot reload for backend development
  - _Requirements: 7.1, 7.2_

- [x] 8.2 Implement comprehensive testing framework
  - Set up Jest for backend unit and integration tests
  - Configure test database for integration tests
  - Add test utilities and fixtures
  - _Requirements: 7.6_

- [x] 8.3 Add monitoring and logging configuration
  - Implement request logging middleware
  - Add error tracking and reporting
  - Set up performance monitoring
  - _Requirements: 9.1, 9.2, 9.3_

- [x] 8.4 Create development utilities and scripts
  - Add database seeding script for development
  - Create API testing utilities (Postman/Insomnia collections)
  - Add development documentation
  - _Requirements: 7.3, 7.4, 7.5_

- [x] 8.5 Write performance and load tests
  - Test API endpoint response times
  - Test database query performance
  - Test concurrent user handling
  - _Requirements: 9.4_

### Task 9: Checkpoint - Core System Validation
- [ ] 9.1 Run all tests and verify passing status
  - Execute unit tests for all modules
  - Run integration tests for API endpoints
  - Verify test coverage meets requirements
  - _Requirements: All testing requirements_

- [ ] 9.2 Test end-to-end user workflows
  - Test complete user registration and login flow
  - Test contact form submission and admin viewing
  - Test meeting scheduling and response flow
  - _Requirements: Critical user workflows_

- [ ] 9.3 Verify database migration and data integrity
  - Test database schema creation and migration
  - Verify data model conversions from Base44
  - Test backup and restore functionality
  - _Requirements: 3.6, 3.7_

- [ ] 9.4 Validate development environment setup
  - Test `npm run dev` starts both backend and frontend
  - Verify hot reload works for code changes
  - Test debugging configuration
  - _Requirements: 7.1, 7.2, 7.3_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP development
- Each task references specific requirements for traceability and validation
- Checkpoints ensure incremental validation and catch issues early
- Property tests are included for validation logic where applicable (design indicates property-based testing is NOT appropriate for infrastructure features)
- The implementation follows an incremental approach, delivering working functionality at each phase
- Core focus is on removing Base44 dependencies and establishing a functional local backend

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["2.1", "2.2", "3.1"] },
    { "id": 2, "tasks": ["2.3", "3.2", "4.1"] },
    { "id": 3, "tasks": ["3.3", "3.4", "4.2"] },
    { "id": 4, "tasks": ["4.3", "4.4", "5.1"] },
    { "id": 5, "tasks": ["5.2", "5.3", "5.4"] },
    { "id": 6, "tasks": ["6.1", "6.2", "7.1"] },
    { "id": 7, "tasks": ["6.3", "7.2", "7.3"] },
    { "id": 8, "tasks": ["7.4", "7.5", "8.1"] },
    { "id": 9, "tasks": ["8.2", "8.3", "8.4"] },
    { "id": 10, "tasks": ["9.1", "9.2", "9.3", "9.4"] }
  ]
}
```