# AI Plan Notes - API Documentation

## Base URL
```
http://localhost:8080
```

## Authentication
All endpoints (except `/api/auth/*`) require JWT authentication.

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication APIs

### Register User
```http
POST /api/auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securePassword123",
  "email": "john@example.com"
}
```

**Response (201 Created):**
```json
{
  "code": 201,
  "message": "User registered successfully.",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securePassword123"
}
```

**Response (200 OK):**
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

---

## Category Management APIs

### Create Category
```http
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "考研数学"
}
```

**Response (201 Created):**
```json
{
  "code": 201,
  "message": "Category created successfully.",
  "data": {
    "id": 1,
    "name": "考研数学",
    "createdAt": "2023-10-27T10:00:00Z"
  }
}
```

**Error (409 Conflict) - Duplicate Name:**
```json
{
  "code": 409,
  "message": "Conflict: Category name already exists."
}
```

### Get All Categories
```http
GET /api/categories
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "考研数学",
      "createdAt": "2023-10-27T10:00:00Z"
    },
    {
      "id": 2,
      "name": "英语学习",
      "createdAt": "2023-10-27T11:00:00Z"
    }
  ]
}
```

### Update Category
```http
PUT /api/categories/{id}
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "高等数学（考研）"
}
```

**Response (200 OK):**
```json
{
  "code": 200,
  "message": "Category updated successfully.",
  "data": {
    "id": 1,
    "name": "高等数学（考研）",
    "createdAt": "2023-10-27T10:00:00Z"
  }
}
```

### Delete Category
```http
DELETE /api/categories/{id}
Authorization: Bearer <token>
```

**Response (204 No Content):** Empty body

**Error (409 Conflict) - Category Has Notes:**
```json
{
  "code": 409,
  "message": "Conflict: Cannot delete category because it contains notes."
}
```

---

## Note Management APIs

### Create Note
```http
POST /api/notes
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "微积分基本定理",
  "content": "微积分基本定理是连接微分学和积分学的桥梁...",
  "categoryId": 1,
  "isSupervised": true,
  "supervisionDurationSeconds": 30
}
```

**Note:** `categoryId` can be `null` for uncategorized notes.

**Response (201 Created):**
```json
{
  "code": 201,
  "message": "Note created successfully.",
  "data": {
    "id": 101,
    "title": "微积分基本定理",
    "content": "微积分基本定理是连接微分学和积分学的桥梁...",
    "categoryId": 1,
    "isSupervised": true,
    "supervisionDurationSeconds": 30,
    "createdAt": "2023-10-27T15:00:00Z"
  }
}
```

### Get Note Detail
```http
GET /api/notes/{id}
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": 101,
    "title": "微积分基本定理",
    "content": "微积分基本定理是连接微分学和积分学的桥梁...",
    "categoryId": 1,
    "categoryName": "考研数学",
    "isSupervised": true,
    "supervisionDurationSeconds": 30,
    "aiSummary": {
      "summaryText": "该定理描述了定积分与不定积分之间的关系...",
      "createdAt": "2023-10-27T15:01:00Z"
    },
    "currentReviewRecord": {
      "stageNumber": 3,
      "scheduledFor": "2023-10-29"
    },
    "createdAt": "2023-10-27T15:00:00Z",
    "updatedAt": "2023-10-27T15:01:00Z"
  }
}
```

### Update Note
```http
PUT /api/notes/{id}
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "微积分基本定理（修正版）",
  "content": "修正后的内容...",
  "categoryId": 2,
  "isSupervised": false,
  "supervisionDurationSeconds": 10
}
```

**Response (200 OK):**
```json
{
  "code": 200,
  "message": "Note updated successfully.",
  "data": {
    "id": 101,
    "title": "微积分基本定理（修正版）",
    "content": "修正后的内容...",
    "categoryId": 2,
    "isSupervised": false,
    "supervisionDurationSeconds": 10,
    "updatedAt": "2023-10-27T16:00:00Z"
  }
}
```

### Delete Note
```http
DELETE /api/notes/{id}
Authorization: Bearer <token>
```

**Response (204 No Content):** Empty body

**Note:** Automatically cascades to delete AI summaries and review records.

### Get Notes by Category
```http
GET /api/notes?categoryId={id}
Authorization: Bearer <token>
```

**Query Parameters:**
- `categoryId` (optional): Category ID. If null or 0, returns uncategorized notes.

**Response (200 OK):**
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "id": 101,
      "title": "微积分基本定理",
      "isSupervised": true,
      "aiSummaryPreview": "该定理描述了定积分与不定积分之间的关系...",
      "createdAt": "2023-10-27T15:00:00Z"
    },
    {
      "id": 102,
      "title": "导数的定义",
      "isSupervised": false,
      "aiSummaryPreview": null,
      "createdAt": "2023-10-27T16:00:00Z"
    }
  ]
}
```

---

## Review Task APIs

### Get Today's Tasks
```http
GET /api/tasks/today
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "noteId": 101,
      "title": "微积分基本定理",
      "categoryName": "考研数学",
      "isSupervised": true,
      "supervisionDurationSeconds": 30,
      "currentReviewStage": 3,
      "aiSummary": "该定理描述了定积分与不定积分之间的关系..."
    }
  ]
}
```

**Note:** Returns notes with `scheduledFor <= today` and `reviewedAt = null`.

### Submit Review Result
```http
POST /api/reviews/submit
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "noteId": 101,
  "result": "REMEMBERED",
  "reviewDurationSeconds": 35
}
```

**Valid Results:**
- `REMEMBERED` - Successfully recalled, progress to next stage
- `FUZZY` - Partially recalled, reset to stage 1
- `FORGOTTEN` - Failed to recall, reset to stage 1

**Response (200 OK):**
```json
{
  "code": 200,
  "message": "Review result submitted successfully.",
  "data": {
    "nextReviewDate": "2023-11-03"
  }
}
```

**Review Algorithm:**
- **REMEMBERED**: Stage increases, next review scheduled based on Ebbinghaus curve [1, 2, 4, 7, 15, 30, 60, 120 days]
- **FUZZY/FORGOTTEN**: Reset to stage 1, next review scheduled for tomorrow

**Error (400 Bad Request):**
```json
{
  "code": 400,
  "message": "Invalid task: No pending review found for this note."
}
```

---

## AI Summary APIs

### Generate AI Summary
```http
POST /api/ai/summarize
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "noteId": 101
}
```

**Response (200 OK):**
```json
{
  "code": 200,
  "message": "AI summary generated successfully.",
  "data": {
    "summaryText": "这是一篇关于微积分基本定理的笔记，主要内容包括...",
    "modelUsed": "mock-v1.0",
    "createdAt": "2023-10-27T15:30:00Z"
  }
}
```

**Note:** V1.0 uses mock implementation (extracts first 200 characters). Calling this endpoint multiple times will update the existing summary.

---

## Common Error Responses

### 400 Bad Request
```json
{
  "code": 400,
  "message": "Invalid request: <validation error details>"
}
```

### 401 Unauthorized
```json
{
  "code": 401,
  "message": "Unauthorized: Invalid username or password."
}
```

### 403 Forbidden
```json
{
  "code": 403,
  "message": "Access Denied"
}
```

### 404 Not Found
```json
{
  "code": 404,
  "message": "Note not found"
}
```

### 409 Conflict
```json
{
  "code": 409,
  "message": "Conflict: <specific conflict reason>"
}
```

### 500 Internal Server Error
```json
{
  "code": 500,
  "message": "Internal server error: <error details>"
}
```

---

## Data Flow Examples

### Complete Note Creation and Review Flow

1. **Register and Login**
   ```bash
   # Register
   curl -X POST http://localhost:8080/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"student","password":"pass123","email":"student@edu.com"}'
   
   # Login
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"student","password":"pass123"}'
   ```

2. **Create Category**
   ```bash
   curl -X POST http://localhost:8080/api/categories \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"name":"数学"}'
   ```

3. **Create Note**
   ```bash
   curl -X POST http://localhost:8080/api/notes \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{
       "title":"极限定理",
       "content":"极限是微积分的基础...",
       "categoryId":1,
       "isSupervised":true,
       "supervisionDurationSeconds":30
     }'
   ```

4. **Generate AI Summary**
   ```bash
   curl -X POST http://localhost:8080/api/ai/summarize \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"noteId":101}'
   ```

5. **Get Today's Tasks**
   ```bash
   curl -X GET http://localhost:8080/api/tasks/today \
     -H "Authorization: Bearer <token>"
   ```

6. **Submit Review**
   ```bash
   curl -X POST http://localhost:8080/api/reviews/submit \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{
       "noteId":101,
       "result":"REMEMBERED",
       "reviewDurationSeconds":28
     }'
   ```

---

## Security Notes

- All endpoints except authentication require valid JWT token
- Tokens expire after 24 hours (86400 seconds)
- Users can only access their own resources
- Attempting to access another user's resource returns 404 (not 403 to avoid information leakage)
- All passwords are hashed using BCrypt before storage

---

## Technical Details

- **API Response Format**: All responses follow the same structure with `code`, `message`, and `data` fields
- **Timestamps**: All timestamps are in UTC format: `yyyy-MM-dd'T'HH:mm:ss'Z'`
- **Date Format**: Review dates use ISO 8601 format: `yyyy-MM-dd`
- **Pagination**: Not implemented in V1.0
- **Rate Limiting**: Not implemented in V1.0

---

## Development Server

To run the development server:
```bash
mvn spring-boot:run
```

To run tests:
```bash
mvn test
```

To build the project:
```bash
mvn clean package
```
