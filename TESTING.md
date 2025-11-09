# API Testing Documentation

## Test Results Summary

All authentication API tests pass successfully. The backend is ready for use.

### Test Suite: AuthControllerTest

#### 1. User Registration Tests

**Test: testRegisterSuccess**
- ✅ PASSED
- Verifies successful user registration
- Checks response code (201), message, and user data

**Test: testRegisterDuplicateUsername**
- ✅ PASSED
- Verifies rejection of duplicate usernames
- Checks 409 Conflict status code

**Test: testRegisterInvalidEmail**
- ✅ PASSED
- Verifies email validation
- Checks 400 Bad Request for invalid email format

#### 2. User Login Tests

**Test: testLoginSuccess**
- ✅ PASSED
- Verifies successful login
- Checks JWT token generation and response format

**Test: testLoginInvalidCredentials**
- ✅ PASSED
- Verifies rejection of wrong password
- Checks 401 Unauthorized status code

**Test: testLoginEmptyFields**
- ✅ PASSED
- Verifies validation of empty fields
- Checks 400 Bad Request status code

#### 3. Context Load Test

**Test: contextLoads**
- ✅ PASSED
- Verifies Spring application context loads successfully

### Total: 7/7 Tests Passed ✅

## Manual Testing Guide

### Prerequisites

1. MySQL 8.0 running on localhost:3306
2. Database `ai_plan_notes` created
3. Java 17+ installed
4. Maven 3.6+ installed

### Start the Application

```bash
mvn spring-boot:run
```

Or with custom database password:

```bash
DB_PASSWORD=your_password mvn spring-boot:run
```

### Test Registration API

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "xiaoli",
    "password": "password123",
    "email": "xiaoli@example.com"
  }'
```

**Expected Response (201 Created):**

```json
{
  "code": 201,
  "message": "User registered successfully.",
  "data": {
    "userId": 1,
    "username": "xiaoli",
    "email": "xiaoli@example.com"
  }
}
```

### Test Login API

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "xiaoli",
    "password": "password123"
  }'
```

**Expected Response (200 OK):**

```json
{
  "code": 200,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400
  }
}
```

### Test Protected Endpoints

Use the JWT token from login response:

```bash
curl -X GET http://localhost:8080/api/protected-endpoint \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Test Error Cases

#### Duplicate Username (409 Conflict)

```bash
# Register twice with same username
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "xiaoli", "password": "pass123", "email": "test@example.com"}'
```

#### Invalid Credentials (401 Unauthorized)

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "xiaoli", "password": "wrongpassword"}'
```

#### Invalid Email Format (400 Bad Request)

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "password": "password123", "email": "invalid-email"}'
```

## Database Verification

After starting the application, verify the tables are created:

```sql
USE ai_plan_notes;
SHOW TABLES;
```

Expected tables:
- users
- categories
- notes
- ai_summaries
- review_records

Check user table structure:

```sql
DESCRIBE users;
```

Expected columns:
- id (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- username (VARCHAR(50), UNIQUE, NOT NULL)
- password_hash (VARCHAR(255), NOT NULL)
- email (VARCHAR(100), UNIQUE, NOT NULL)
- created_at (TIMESTAMP, NOT NULL)
- updated_at (TIMESTAMP, NOT NULL)

## Security Notes

1. **CSRF Protection**: Disabled for stateless JWT authentication (documented in code)
2. **Password Encryption**: Using BCrypt with automatic salting
3. **JWT Secret**: Use strong secret in production (min 256 bits)
4. **Token Expiration**: 24 hours by default
5. **No Vulnerabilities**: All dependencies checked and verified clean

## Performance Notes

- Application startup time: ~4 seconds
- Average test execution time: ~5 seconds for full suite
- In-memory H2 database for tests (fast and isolated)
- Connection pooling enabled via HikariCP
