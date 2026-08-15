# ExpenseFlow API Documentation

Base URL for local development:

```text
http://localhost:8080
```

## Authentication

Public endpoints:

```http
POST /auth/register
POST /auth/login
```

All other application endpoints require:

```text
Authorization: Bearer <jwt-token>
```

### Register

```http
POST /auth/register
Content-Type: application/json
```

```json
{
  "fullName": "Varun Sharma",
  "email": "varun@example.com",
  "password": "secret123",
  "role": "USER"
}
```

Returns `201 Created`. The password is never returned.

### Login

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "varun@example.com",
  "password": "secret123"
}
```

Returns `200 OK` with a JWT token and basic user details.

## Users

All user endpoints require JWT authentication.

```http
POST /users
GET /users?page=0&size=10&sort=id,asc
GET /users/{id}
DELETE /users/{id}
GET /users/{userId}/expenses?page=0&size=10&sort=date,desc
```

### Create User

```json
{
  "fullName": "Asha Kumar",
  "email": "asha@example.com",
  "password": "secret123",
  "role": "USER"
}
```

Returns `201 Created`. The password is stored hashed and is never returned.

## Expenses

All expense endpoints require JWT authentication.

```http
POST /expenses
GET /expenses?page=0&size=10&sort=date,desc
GET /expenses/{id}
PUT /expenses/{id}
DELETE /expenses/{id}
```

### Create or Update Expense

```json
{
  "title": "Lunch",
  "amount": 250.75,
  "category": "Food",
  "date": "2026-07-26",
  "description": "Lunch with classmates",
  "userId": 1
}
```

Create returns `201 Created`. Update returns `200 OK`. Delete returns `204 No Content`.

### Pagination, Sorting, Searching, and Filtering

```http
GET /expenses?title=lunch&category=Food&startDate=2026-07-01&endDate=2026-07-31&page=0&size=10&sort=date,desc
```

Supported parameters:

- `title`: partial, case-insensitive title search.
- `category`: exact, case-insensitive category search.
- `startDate`: expenses on or after this date.
- `endDate`: expenses on or before this date.
- `page`: zero-based page number.
- `size`: records per page.
- `sort`: Spring sort format, for example `date,desc`, `amount,asc`, or `title,asc`.

Paginated responses use:

```json
{
  "content": [],
  "page": 0,
  "size": 10,
  "totalElements": 0,
  "totalPages": 0,
  "last": true
}
```

## Dashboard

All dashboard endpoints require JWT authentication.

```http
GET /dashboard/summary
GET /dashboard/monthly
GET /dashboard/categories
GET /dashboard/recent
```

Dashboard responses use DTOs and never return JPA entities directly.

## Swagger/OpenAPI

Swagger endpoints are public:

```http
GET /swagger-ui.html
GET /swagger-ui/**
GET /v3/api-docs
GET /v3/api-docs/**
```

## Error Response Format

```json
{
  "timestamp": "2026-07-26T12:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Request validation failed",
  "path": "/expenses",
  "validationErrors": {
    "title": "Title is required"
  }
}
```

Common status codes:

- `400 Bad Request`: validation or malformed request.
- `401 Unauthorized`: missing, invalid, or expired JWT.
- `404 Not Found`: requested resource does not exist.
- `409 Conflict`: duplicate email or conflicting data.
- `500 Internal Server Error`: unexpected server error.
