# ExpenseFlow

ExpenseFlow is a secure, resume-ready full-stack expense tracker built with Spring Boot, MySQL, React, and Vite. It helps users register, login, manage expenses, and view spending analytics through a clean blue/white dashboard.

## Live Demo

Placeholder: add your deployed frontend URL after deployment.

## GitHub Repository

Placeholder: add your GitHub repository URL after pushing the project.

## Screenshots

Placeholder: add dashboard, expenses, login, and profile screenshots.

## Main Features

- JWT authentication with BCrypt password hashing.
- Protected expense, dashboard, user, and profile views.
- Expense CRUD with validation, pagination, sorting, searching, and date filtering.
- Dashboard summary cards for total expenses, total spending, average expense, and highest expense.
- Recharts analytics for category spending and monthly trends.
- Recent expenses table and category/monthly spending summaries.
- Profile page with account details and frontend-ready profile update forms.
- Light/dark mode with localStorage persistence.
- Friendly empty states, loading skeletons, toast notifications, and custom 404 page.
- Swagger/OpenAPI documentation for backend APIs.

## Technology Stack

- Backend: Java 21, Spring Boot 3.5.4, Spring Web, Spring Security, Spring Data JPA, Hibernate, MySQL, Maven, Springdoc OpenAPI.
- Frontend: React 18, Vite, React Router, Axios, Recharts, react-hot-toast, plain CSS.
- Architecture: Controller -> Service -> Repository on the backend; pages, reusable components, hooks, context, and services on the frontend.

## Authentication

- Public backend endpoints: `/auth/register`, `/auth/login`, Swagger/OpenAPI endpoints.
- Protected backend endpoints: users, expenses, and dashboard.
- Frontend stores the JWT in `localStorage` under `expenseflow_token`.
- Axios attaches `Authorization: Bearer <token>` automatically.
- Expired or invalid JWT responses redirect the user to `/login`.
- Passwords are hashed with BCrypt and are never returned in API responses.

## Database

ExpenseFlow uses MySQL with Hibernate/JPA. The backend expects a MySQL database to exist before startup.

Example local database:

```sql
CREATE DATABASE expenseflow_db;
```

Hibernate manages tables using:

```properties
spring.jpa.hibernate.ddl-auto=update
```

## Environment Variables

Backend:

```text
DB_URL=jdbc:mysql://localhost:3306/expenseflow_db
DB_USERNAME=root
DB_PASSWORD=your_local_mysql_password
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRATION_SECONDS=86400
FRONTEND_ORIGIN=http://localhost:5173
JPA_SHOW_SQL=false
```

Frontend:

```text
VITE_API_URL=http://localhost:8080
```

Use `frontend/.env.example` and `expenseflow/src/main/resources/application-example.properties` as references. Do not commit real `.env` files or secrets.

## Backend Setup

```bash
cd expenseflow
mvn spring-boot:run
```

Swagger UI:

```text
http://localhost:8080/swagger-ui.html
```

OpenAPI JSON:

```text
http://localhost:8080/v3/api-docs
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Local frontend:

```text
http://localhost:5173
```

## API Documentation

See [expenseflow/API_DOCUMENTATION.md](expenseflow/API_DOCUMENTATION.md).

## Project Structure

```text
expenseflow/
|-- expenseflow/              Spring Boot backend
|   |-- src/main/java/...     controllers, services, repositories, entities, DTOs, security
|   |-- src/main/resources    application configuration
|   |-- API_DOCUMENTATION.md  backend API reference
|   `-- pom.xml
|-- frontend/                 React frontend
|   |-- src/components        reusable UI components
|   |-- src/context           auth and theme context
|   |-- src/hooks             data fetching hooks
|   |-- src/pages             route-level pages
|   |-- src/services          Axios API client
|   |-- src/styles            global CSS
|   `-- package.json
`-- README.md
```

## Deployment Preparation

Frontend on Vercel:

- Set `VITE_API_URL` to the deployed backend URL.
- Build command: `npm run build`.
- Output directory: `dist`.

Backend on Render or Railway:

- Set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `JWT_EXPIRATION_SECONDS`, and `FRONTEND_ORIGIN`.
- Use Java 21.
- Deploy from the `expenseflow/` backend folder.

Database:

- Use a managed MySQL service.
- Create the database before starting the backend.
- Configure the backend with the managed database JDBC URL and credentials.

## Resume-Ready Features

- Built a layered full-stack application using Spring Boot and React.
- Implemented JWT auth, BCrypt hashing, protected routes, and CORS configuration.
- Designed REST APIs with DTOs, validation, global exception handling, and proper status codes.
- Added expense search, filtering, sorting, pagination, and analytics reporting.
- Built a responsive SaaS-style dashboard with charts, dark mode, loading states, and toasts.
- Prepared environment-based configuration for local development and deployment.
