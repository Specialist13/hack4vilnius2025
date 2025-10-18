# API Integration Summary

## Overview
This document summarizes the backend API integration work completed for the Hack4Vilnius 2025 project. All TODO comments related to backend integration have been replaced with actual API calls following the OpenAPI specification.

## Created Files

### 1. `lib/api.ts`
Central API utility module providing:
- Base API configuration with environment variable support
- Authentication token management (localStorage-based)
- Typed API request helper with error handling
- API error class for proper error handling
- Organized API modules for different features:
  - `authAPI` - Authentication endpoints
  - `userAPI` - User management endpoints
  - `forumAPI` - Forum and discussion endpoints
  - `mapAPI` - Map statistics endpoints
  - `aiAPI` - AI consultant endpoints

**Key Features:**
- Automatic Bearer token injection for authenticated requests
- Centralized error handling with `APIError` class
- Type-safe request/response handling
- Support for different HTTP methods (GET, POST, PUT, PATCH)

## Updated Components

### Authentication

#### 1. `components/auth/login-form.tsx`
**Changes:**
- Replaced mock login with actual `authAPI.login()` call
- Implemented proper error handling for 400/401/500 status codes
- Stores JWT token in localStorage using `setAuthToken()`
- Redirects to `/forum` on successful login
- Shows user-friendly error messages

**API Endpoint:** `POST /api/auth/login`
```typescript
Request: { email: string, password: string }
Response: { accessToken: string }
```

#### 2. `components/auth/register-form.tsx`
**Changes:**
- Replaced mock registration with actual `authAPI.register()` call
- Proper validation for password matching and terms agreement
- Handles 400 errors (user already exists)
- Redirects to login page after successful registration
- TypeScript type fix for checkbox handler

**API Endpoint:** `POST /api/auth/register`
```typescript
Request: { email: string, password: string, name: string, address?: string }
Response: { code: string, email: string, name: string, address?: string, createdAt: string }
```

### Header & Navigation

#### 3. `components/layout/header.tsx`
**Changes:**
- Implemented authentication state management using React hooks
- Checks `isAuthenticated()` on component mount
- Listens for storage events to sync auth state across tabs
- Implemented logout functionality with `removeAuthToken()`
- Shows/hides login/logout buttons based on auth state
- Redirects to home page on logout

**Auth Functions Used:**
- `isAuthenticated()` - Check if user has valid token
- `removeAuthToken()` - Clear auth data on logout

### Forum Features

#### 4. `app/forum/create/page.tsx`
**Changes:**
- Replaced mock post creation with `forumAPI.createPost()` call
- Sends all form data including coordinates from address picker
- Handles API errors with user-friendly alerts
- Redirects to newly created post or forum feed on success
- Proper TypeScript error handling with `APIError`

**API Endpoint:** `POST /api/posts`
```typescript
Request: {
  title: string
  content: string
  address: string
  status: string
  language: string
  coordinates: { lat: number, lng: number }
}
Response: { postId?: string, id?: string, ... }
```

#### 5. `app/forum/post/[id]/page.tsx`
**Changes:**
- Replaced mock data with actual API calls to `forumAPI.getPost()` and `forumAPI.getReplies()`
- Fetches post and replies in parallel
- Handles 404 and other errors gracefully
- Shows loading state while fetching
- Displays "Post not found" message if post doesn't exist
- Refetches data when reply is submitted

**API Endpoints:**
- `GET /api/posts/{postId}` - Get post details
- `GET /api/posts/{postId}/replies` - Get post replies

#### 6. `components/forum/reply-form.tsx`
**Changes:**
- Replaced mock reply submission with `forumAPI.createReply()` call
- Shows error alerts on failure
- Clears form and triggers parent refresh on success
- Proper error handling with `APIError`

**API Endpoint:** `POST /api/posts/{postId}/replies`
```typescript
Request: { content: string }
Response: { reply: Reply, ... }
```

### Map Features

#### 7. `components/map/map-stats.tsx`
**Changes:**
- Converted to dynamic component with `useState` and `useEffect`
- Fetches real statistics from `mapAPI.getStats()` on mount
- Shows loading state ("...") while fetching
- Falls back to default values on API error
- Supports multiple response field names for flexibility

**API Endpoint:** `GET /api/map/stats`
```typescript
Response: {
  totalLocations?: number
  activeDiscussions?: number
  totalBuildings?: number
  buildings?: number
  totalUsers?: number
  residents?: number
  successRate?: string
  growthRate?: string
}
```

### AI Features

#### 8. `app/ai-consultant/page.tsx`
**Changes:**
- Implemented actual `aiAPI.analyze()` call
- Handles API responses and displays AI messages
- Shows "Coming Soon" message gracefully if endpoint returns 404
- Proper error handling with user-friendly messages
- Supports future location-based queries (commented for now)

**API Endpoint:** `POST /api/ai-consultant/analyze`
```typescript
Request: {
  message: string
  userLocation?: { address: string, coordinates: { lat: number, lng: number } }
}
Response: {
  response?: string
  message?: string
  nearbyPosts?: Array<{ id, title, address, distance, status }>
  recommendation?: { action, reasoning, nearestDiscussions }
}
```

## API Configuration

### Environment Variables
Set the backend URL in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

If not set, defaults to `http://localhost:3000`.

### Authentication Flow
1. User logs in via `POST /api/auth/login`
2. Receives JWT token (`accessToken`)
3. Token stored in localStorage as `authToken`
4. All subsequent API requests include `Authorization: Bearer {token}` header
5. Logout clears localStorage and redirects to home

### Error Handling Pattern
All API calls follow this pattern:
```typescript
try {
  const response = await someAPI.someMethod(data)
  // Handle success
} catch (error) {
  if (error instanceof APIError) {
    // Handle specific HTTP errors (400, 401, 404, 500, etc.)
    // Show user-friendly error messages
  } else {
    // Handle network or other errors
  }
}
```

## Testing Checklist

Before deploying, test these scenarios:

### Authentication
- [ ] Register new user with valid data
- [ ] Register with existing email (should show error)
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should show error)
- [ ] Logout and verify token is cleared
- [ ] Verify auth state persists on page refresh

### Forum
- [ ] Create new post with all fields
- [ ] View post details
- [ ] Add reply to post
- [ ] Verify error handling when post not found

### Map
- [ ] Load map page and verify stats load
- [ ] Verify fallback values if API fails

### AI Consultant
- [ ] Send message and receive response
- [ ] Verify error handling
- [ ] Test "Coming Soon" fallback for 404

## Backend Requirements

The backend server must implement these endpoints as per `openapi.yml`:

### Implemented in OpenAPI Spec
✅ `POST /api/auth/register` - User registration
✅ `POST /api/auth/login` - User authentication
✅ `PUT /api/users` - Update user profile (full)
✅ `PATCH /api/users` - Update user profile (partial)

### Required for Full Functionality (Not in OpenAPI spec)
⚠️ `POST /api/posts` - Create forum post
⚠️ `GET /api/posts/{id}` - Get post details
⚠️ `GET /api/posts/{id}/replies` - Get post replies
⚠️ `POST /api/posts/{id}/replies` - Create reply
⚠️ `GET /api/map/stats` - Get map statistics
⚠️ `POST /api/ai-consultant/analyze` - AI analysis

**Note:** Forum, Map, and AI endpoints are implemented in the frontend but need to be added to the backend API and OpenAPI specification.

## Security Considerations

1. **Token Storage:** Currently using localStorage. Consider httpOnly cookies for production.
2. **Token Expiration:** No token refresh logic implemented. Add JWT refresh token flow.
3. **CORS:** Ensure backend allows requests from frontend origin.
4. **Input Validation:** Backend must validate all inputs.
5. **Rate Limiting:** Implement rate limiting on backend API.
6. **XSS Protection:** Sanitize user inputs on backend.

## Next Steps

1. **Backend Implementation:**
   - Implement missing forum endpoints
   - Implement map statistics endpoint
   - Implement AI consultant endpoint
   - Add these endpoints to OpenAPI specification

2. **Frontend Enhancements:**
   - Add token refresh mechanism
   - Implement better loading states
   - Add optimistic UI updates
   - Add retry logic for failed requests
   - Implement request caching where appropriate

3. **Testing:**
   - Add unit tests for API utility functions
   - Add integration tests for API calls
   - Test error scenarios thoroughly

4. **Documentation:**
   - Update OpenAPI spec with new endpoints
   - Document API authentication flow
   - Add API usage examples

## Files Modified Summary

| File | Lines Changed | Type |
|------|---------------|------|
| `lib/api.ts` | +311 | New File |
| `components/auth/login-form.tsx` | ~30 | API Integration |
| `components/auth/register-form.tsx` | ~35 | API Integration |
| `components/layout/header.tsx` | ~40 | API Integration |
| `app/forum/create/page.tsx` | ~25 | API Integration |
| `app/forum/post/[id]/page.tsx` | ~60 | API Integration |
| `components/forum/reply-form.tsx` | ~20 | API Integration |
| `components/map/map-stats.tsx` | ~70 | API Integration |
| `app/ai-consultant/page.tsx` | ~35 | API Integration |

**Total:** 9 files modified, ~626 lines of code changed

## Conclusion

All TODO comments related to backend integration have been successfully replaced with proper API calls. The codebase now has:
- ✅ Centralized API configuration
- ✅ Type-safe API calls
- ✅ Proper error handling
- ✅ Authentication flow
- ✅ Token management
- ✅ User-friendly error messages

The frontend is now ready to communicate with the backend API once all endpoints are implemented.
