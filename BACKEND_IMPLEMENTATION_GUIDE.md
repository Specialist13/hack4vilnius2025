# Backend Implementation Guide

This document provides guidance for backend developers on implementing the endpoints required by the frontend.

## API Endpoints to Implement

### 1. Forum Endpoints (Priority: HIGH)

#### Create Post
```yaml
POST /api/posts
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "title": "string (required, max 200 chars)",
  "content": "string (required, max 5000 chars)",
  "address": "string (required)",
  "status": "open | in-progress | resolved",
  "language": "en | lt",
  "coordinates": {
    "lat": number,
    "lng": number
  }
}

Response 201:
{
  "id": "string (UUID)",
  "postId": "string (UUID)", // alias for id
  "title": "string",
  "content": "string",
  "address": "string",
  "status": "string",
  "language": "string",
  "coordinates": { "lat": number, "lng": number },
  "author": {
    "id": "string",
    "name": "string",
    "avatar": "string (nullable)"
  },
  "createdAt": "ISO 8601 datetime",
  "likes": 0,
  "replies": 0
}

Response 400:
{
  "error": "Missing required fields | Invalid data"
}

Response 401:
{
  "error": "No token provided | Invalid token"
}
```

#### Get Post
```yaml
GET /api/posts/{postId}

Response 200:
{
  "id": "string",
  "title": "string",
  "content": "string",
  "address": "string",
  "status": "string",
  "language": "string",
  "coordinates": { "lat": number, "lng": number },
  "author": {
    "id": "string",
    "name": "string",
    "avatar": "string (nullable)"
  },
  "createdAt": "ISO 8601",
  "likes": number,
  "replies": number
}

Response 404:
{
  "error": "Post not found"
}
```

#### Get Replies
```yaml
GET /api/posts/{postId}/replies

Response 200:
[
  {
    "id": "string",
    "content": "string",
    "author": {
      "id": "string",
      "name": "string",
      "avatar": "string (nullable)"
    },
    "createdAt": "ISO 8601",
    "likes": number
  }
]

Response 404:
{
  "error": "Post not found"
}
```

#### Create Reply
```yaml
POST /api/posts/{postId}/replies
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "content": "string (required, max 2000 chars)"
}

Response 201:
{
  "id": "string",
  "reply": {
    "id": "string",
    "content": "string",
    "author": {
      "id": "string",
      "name": "string",
      "avatar": "string (nullable)"
    },
    "createdAt": "ISO 8601",
    "likes": 0
  }
}

Response 400:
{
  "error": "Missing content"
}

Response 401:
{
  "error": "Not authenticated"
}

Response 404:
{
  "error": "Post not found"
}
```

### 2. Map Statistics Endpoint (Priority: MEDIUM)

```yaml
GET /api/map/stats

Response 200:
{
  "totalLocations": number,      // OR "activeDiscussions"
  "totalBuildings": number,       // OR "buildings"
  "totalUsers": number,           // OR "residents"
  "successRate": "XX%",           // OR "growthRate"
}

Note: Frontend supports multiple field name variations for flexibility
```

### 3. AI Consultant Endpoint (Priority: LOW - Can return 404 for MVP)

```yaml
POST /api/ai-consultant/analyze
Authorization: Bearer {token} (optional)
Content-Type: application/json

Request Body:
{
  "message": "string (required)",
  "userLocation": {  // optional
    "address": "string",
    "coordinates": {
      "lat": number,
      "lng": number
    }
  }
}

Response 200:
{
  "response": "string (AI-generated response)",
  "nearbyPosts": [  // optional
    {
      "id": "string",
      "title": "string",
      "address": "string",
      "distance": number,  // in km
      "status": "string"
    }
  ],
  "recommendation": {  // optional
    "action": "create_new | join_existing",
    "reasoning": "string",
    "nearestDiscussions": number
  }
}

Response 404: (Frontend shows "Coming Soon" message)
{
  "error": "Endpoint not implemented"
}
```

## Database Schema Suggestions

### Users Table
```sql
CREATE TABLE users (
  code UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

### Posts Table
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(code) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  address TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open',
  language VARCHAR(2) DEFAULT 'en',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_location ON posts USING gist(
  ll_to_earth(latitude, longitude)
);
```

### Replies Table
```sql
CREATE TABLE replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(code) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_replies_post_id ON replies(post_id);
CREATE INDEX idx_replies_user_id ON replies(user_id);
CREATE INDEX idx_replies_created_at ON replies(created_at);
```

### Likes Table (Optional for MVP)
```sql
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(code) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES replies(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  
  CHECK (
    (post_id IS NOT NULL AND reply_id IS NULL) OR
    (post_id IS NULL AND reply_id IS NOT NULL)
  )
);

CREATE UNIQUE INDEX idx_likes_user_post ON likes(user_id, post_id) 
  WHERE post_id IS NOT NULL;
CREATE UNIQUE INDEX idx_likes_user_reply ON likes(user_id, reply_id) 
  WHERE reply_id IS NOT NULL;
```

## Authentication Implementation

### JWT Token Structure
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Middleware Example (Express.js)
```javascript
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
```

## Error Handling Best Practices

### Consistent Error Format
All errors should return:
```json
{
  "error": "Human-readable error message"
}
```

### Common HTTP Status Codes
- `200` - Success (GET, PUT, PATCH)
- `201` - Created (POST)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (authenticated but not allowed)
- `404` - Not Found
- `500` - Internal Server Error

## CORS Configuration

```javascript
// Express.js example
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));
```

## Environment Variables

```env
# Server
PORT=3000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/hack4vilnius

# JWT
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=http://localhost:3001

# Optional: AI Service
OPENAI_API_KEY=sk-...
```

## Testing Endpoints

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "address": "Test Address"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Create Post:**
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Post",
    "content": "Test content",
    "address": "Test Address, Vilnius",
    "status": "open",
    "language": "en",
    "coordinates": {
      "lat": 54.6872,
      "lng": 25.2797
    }
  }'
```

## Performance Considerations

1. **Indexing:** Add indexes on frequently queried fields (user_id, created_at, status)
2. **Pagination:** Implement pagination for posts and replies lists
3. **Caching:** Consider Redis for frequently accessed data
4. **Connection Pooling:** Use connection pooling for database connections
5. **Rate Limiting:** Implement rate limiting to prevent abuse

## Security Checklist

- [ ] Hash passwords with bcrypt (salt rounds: 10+)
- [ ] Validate all inputs on the server side
- [ ] Sanitize user-generated content to prevent XSS
- [ ] Use parameterized queries to prevent SQL injection
- [ ] Implement rate limiting on authentication endpoints
- [ ] Set secure HTTP headers (helmet.js)
- [ ] Use HTTPS in production
- [ ] Rotate JWT secrets regularly
- [ ] Implement CSRF protection if using cookies
- [ ] Log security events (failed logins, etc.)

## Deployment Checklist

- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Set up CORS for production frontend URL
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure logging (Winston, Morgan, etc.)
- [ ] Set up monitoring (Sentry, New Relic, etc.)
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up CI/CD pipeline
- [ ] Document API in OpenAPI spec

## Support

For questions about the frontend implementation or API contract, refer to:
- `openapi.yml` - Current API specification
- `lib/api.ts` - Frontend API client implementation
- `API_INTEGRATION_SUMMARY.md` - Integration overview
