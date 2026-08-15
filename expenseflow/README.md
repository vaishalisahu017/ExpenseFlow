# ExpenseFlow Backend

This folder contains the Spring Boot backend for ExpenseFlow.

For the full project overview, frontend setup, deployment notes, and resume-ready feature list, see the root [README.md](../README.md).

## Backend Stack

- Java 21
- Spring Boot 3.5.4
- Spring Web
- Spring Security
- JWT authentication
- BCrypt password hashing
- Spring Data JPA
- Hibernate
- MySQL
- Maven
- Springdoc OpenAPI

## Local Configuration

Set these environment variables before running the backend:

```text
DB_URL=jdbc:mysql://localhost:3306/expenseflow_db
DB_USERNAME=root
DB_PASSWORD=your_local_mysql_password
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRATION_SECONDS=86400
FRONTEND_ORIGIN=http://localhost:5173
JPA_SHOW_SQL=false
```

See `src/main/resources/application-example.properties` for a non-secret example configuration.

## API Documentation

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

Swagger UI is available after startup at:

```text
http://localhost:8080/swagger-ui.html
```
