# ChargeVilnius - EV Charging Community Forum

A Next.js-based community platform connecting Vilnius apartment residents to advocate for electric vehicle charging infrastructure. Built with TypeScript, React 19, Next.js 15, and Tailwind CSS.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Backend API Requirements](#backend-api-requirements)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)

## 🎯 Project Overview

ChargeVilnius is a bilingual (English/Lithuanian) community forum that helps apartment residents in Vilnius:
- Connect with neighbors interested in EV charging infrastructure
- Share experiences and success stories
- Coordinate advocacy efforts with building management
- Visualize population density and existing EV charging stations on an interactive map
- Track the progress of charging station installations

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.2.4 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Internationalization**: next-intl
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns
- **Analytics**: Vercel Analytics

### Maps Integration
- **ArcGIS**: Embeddable components 4.33 (for population density and EV stations)
- **Google Maps**: JavaScript API (for address picker)

## 📁 Project Structure

```
/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with i18n provider
│   ├── page.tsx                 # Home/landing page
│   ├── globals.css              # Global styles
│   ├── about/                   # About page
│   ├── auth/                    # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── contact/                 # Contact page
│   ├── faq/                     # FAQ page
│   ├── forum/                   # Forum pages
│   │   ├── page.tsx            # Forum feed (list all posts)
│   │   ├── create/             # Create new post
│   │   └── post/[id]/          # Individual post detail
│   ├── guidelines/              # Community guidelines
│   ├── map/                     # Interactive map page
│   ├── privacy/                 # Privacy policy
│   └── terms/                   # Terms of service
│
├── components/                   # React components
│   ├── auth/                    # Authentication forms
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── forum/                   # Forum components
│   │   ├── create-post-button.tsx
│   │   ├── post-card.tsx       # Forum post card component
│   │   ├── reply-card.tsx      # Reply component
│   │   ├── reply-form.tsx      # Reply submission form
│   │   └── search-bar.tsx      # Forum search
│   ├── layout/                  # Layout components
│   │   ├── header.tsx          # Navigation header
│   │   ├── footer.tsx          # Site footer
│   │   └── language-switcher.tsx
│   ├── map/                     # Map components
│   │   ├── address-picker.tsx  # Google Maps address picker
│   │   ├── arcgis-map.tsx      # ArcGIS map wrapper
│   │   ├── map-legend.tsx      # Map legend (deprecated)
│   │   └── map-stats.tsx       # Statistics display
│   └── ui/                      # Reusable UI components (Radix UI)
│
├── hooks/                        # Custom React hooks
│   ├── use-mobile.ts
│   └── use-toast.ts
│
├── i18n/                         # Internationalization
│   └── request.ts               # i18n configuration
│
├── lib/                          # Utility functions
│   ├── google-maps-loader.ts   # Google Maps API loader
│   └── utils.ts                # Tailwind class merging
│
├── messages/                     # Translation files
│   ├── en.json                 # English translations
│   └── lt.json                 # Lithuanian translations
│
├── public/                       # Static assets
│   └── [images]                # User avatars and placeholders
│
├── components.json              # shadcn/ui configuration
├── next.config.mjs              # Next.js configuration
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript configuration
└── tailwind.config.js           # Tailwind CSS configuration
```

## 🚀 Setup Instructions

### Prerequisites

- **Node.js**: 18.x or higher
- **Package Manager**: pnpm (recommended), npm, or yarn
- **Google Maps API Key**: Required for address picker functionality
- **Backend API**: RESTful API server (see [Backend API Requirements](#backend-api-requirements))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd all
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   # Google Maps API Key (required for address picker)
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

   # Backend API URL (required for production)
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   # or for production:
   # NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
   ```

4. **Set up Google Maps API**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable these APIs:
     - Maps JavaScript API
     - Places API
     - Geocoding API
   - Create an API key under "Credentials"
   - Add the API key to `.env.local`

5. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🔌 Backend API Requirements

The frontend expects a RESTful API with the following endpoints. All endpoints should return JSON responses.

### Base URL
Configure via `NEXT_PUBLIC_API_URL` environment variable (default: `http://localhost:3001/api`)

### Authentication Endpoints

#### 1. User Registration
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "address": "string"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "token": "string (JWT token)",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "address": "string",
    "createdAt": "ISO 8601 timestamp"
  }
}
```

**Error Response (400/409):**
```json
{
  "success": false,
  "message": "Error message (e.g., 'Email already exists')"
}
```

#### 2. User Login
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "string (JWT token)",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "address": "string"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

#### 3. Get Current User (Optional)
```
GET /api/auth/me
Headers: Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "address": "string",
    "avatar": "string (optional)"
  }
}
```

### Forum Endpoints

#### 4. Get All Posts
```
GET /api/posts
```

**Query Parameters (optional):**
- `status` - Filter by status: "open" | "in-progress" | "resolved"
- `language` - Filter by language: "en" | "lt"
- `search` - Search by address or title
- `limit` - Number of posts per page (default: 20)
- `offset` - Pagination offset (default: 0)

**Success Response (200):**
```json
{
  "success": true,
  "posts": [
    {
      "id": "string",
      "title": "string",
      "content": "string",
      "author": {
        "id": "string",
        "name": "string",
        "avatar": "string (optional)"
      },
      "address": "string",
      "coordinates": {
        "lat": "number",
        "lng": "number"
      },
      "status": "open | in-progress | resolved",
      "language": "en | lt",
      "createdAt": "ISO 8601 timestamp",
      "updatedAt": "ISO 8601 timestamp",
      "likes": "number",
      "replies": "number (count)"
    }
  ],
  "total": "number",
  "limit": "number",
  "offset": "number"
}
```

#### 5. Get Single Post with Replies
```
GET /api/posts/{postId}
```

**Success Response (200):**
```json
{
  "success": true,
  "post": {
    "id": "string",
    "title": "string",
    "content": "string (full content)",
    "author": {
      "id": "string",
      "name": "string",
      "avatar": "string (optional)"
    },
    "address": "string",
    "coordinates": {
      "lat": "number",
      "lng": "number"
    },
    "status": "open | in-progress | resolved",
    "language": "en | lt",
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp",
    "likes": "number"
  },
  "replies": [
    {
      "id": "string",
      "content": "string",
      "author": {
        "id": "string",
        "name": "string",
        "avatar": "string (optional)"
      },
      "createdAt": "ISO 8601 timestamp",
      "likes": "number"
    }
  ]
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Post not found"
}
```

#### 6. Create New Post
```
POST /api/posts
Headers: Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "string (required, min 10 chars)",
  "content": "string (required, min 50 chars)",
  "address": "string (required)",
  "coordinates": {
    "lat": "number",
    "lng": "number"
  },
  "status": "open | in-progress | resolved",
  "language": "en | lt"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "postId": "string",
  "post": {
    "id": "string",
    "title": "string",
    "content": "string",
    "author": {
      "id": "string",
      "name": "string",
      "avatar": "string"
    },
    "address": "string",
    "coordinates": {
      "lat": "number",
      "lng": "number"
    },
    "status": "string",
    "language": "string",
    "createdAt": "ISO 8601 timestamp",
    "likes": 0,
    "replies": 0
  }
}
```

**Error Response (401/400):**
```json
{
  "success": false,
  "message": "Error message"
}
```

#### 7. Create Reply
```
POST /api/posts/{postId}/replies
Headers: Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "content": "string (required, min 10 chars)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "reply": {
    "id": "string",
    "content": "string",
    "author": {
      "id": "string",
      "name": "string",
      "avatar": "string"
    },
    "createdAt": "ISO 8601 timestamp",
    "likes": 0
  }
}
```

#### 8. Like Post (Optional)
```
POST /api/posts/{postId}/like
Headers: Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "likes": "number (new total)"
}
```

#### 9. Like Reply (Optional)
```
POST /api/posts/{postId}/replies/{replyId}/like
Headers: Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "likes": "number (new total)"
}
```

### Map & Statistics Endpoints

#### 10. Get Map Statistics
```
GET /api/map/stats
```

**Success Response (200):**
```json
{
  "success": true,
  "stats": {
    "activeDiscussions": "number",
    "totalBuildings": "number",
    "totalResidents": "number",
    "successRate": "number (0-100)",
    "chargingStations": "number"
  }
}
```

### AI Consultant Endpoint

#### 11. AI Consultant Analysis
```
POST /api/ai-consultant/analyze
```

**Request Body:**
```json
{
  "message": "string (user's question or address)",
  "userLocation": {
    "address": "string (optional - building address)",
    "coordinates": {
      "lat": "number (optional)",
      "lng": "number (optional)"
    }
  },
  "language": "en | lt (optional - defaults to user's language setting)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "response": "string (AI-generated response text)",
  "nearbyPosts": [
    {
      "id": "string",
      "title": "string",
      "address": "string",
      "distance": "number (in kilometers)",
      "status": "open | in-progress | resolved",
      "participants": "number"
    }
  ],
  "recommendation": {
    "action": "create_new | join_existing | coordinate_nearby",
    "reasoning": "string (explanation for the recommendation)",
    "nearestDiscussionDistance": "number (in km, optional)",
    "successStoriesNearby": "number (optional)"
  },
  "statistics": {
    "discussionsWithin500m": "number",
    "discussionsWithin2km": "number",
    "averageSuccessRate": "number (0-100)"
  }
}
```

**AI System Prompt Context:**

The AI Consultant should be configured with the following context:

```
You are an AI consultant for ChargeVilnius, a platform connecting Vilnius apartment 
building residents who want to bring EV charging infrastructure to their buildings.

Your role is to:
1. Analyze the user's location (building address and coordinates)
2. Calculate distances to all existing forum posts about EV charging
3. Consider factors like:
   - Distance to nearest discussions (< 500m = very close, < 2km = nearby, > 2km = far)
   - Status of nearby discussions (open/in-progress/resolved)
   - Number of active participants in nearby discussions
   - Population density in the area from map data
   - Existing EV charging stations in the vicinity
4. Provide personalized recommendations:
   - If nearby active discussions exist (< 500m): Strongly recommend joining
   - If discussions 500m-2km away: Suggest joining or coordinating
   - If no discussions within 2km: Recommend creating new post
   - If nearby resolved discussions: Highlight success stories and learnings
5. Be conversational, helpful, and encouraging
6. Provide specific data: distances, number of interested residents, success rate
7. Always respond in the user's language (Lithuanian or English)

Decision Logic:
- Distance < 500m AND status is "open" → "Join this existing discussion"
- Distance 500m-2km AND active participants > 3 → "Consider coordinating with nearby"
- Distance > 2km OR no active discussions → "Create a new post for your location"
- Nearby resolved posts → "Learn from these successful initiatives"
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid request or unable to analyze location"
}
```

### Error Responses

All endpoints should follow consistent error response format:

**Authentication Error (401):**
```json
{
  "success": false,
  "message": "Unauthorized - Invalid or missing token"
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "field": "Error message"
  }
}
```

**Server Error (500):**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## ✨ Features

### Current Features
- ✅ Bilingual support (English/Lithuanian) with language switcher
- ✅ Responsive design for mobile, tablet, and desktop
- ✅ Forum post creation with address selection via Google Maps
- ✅ Forum feed with filtering by status (open/in-progress/resolved)
- ✅ Address-based search functionality
- ✅ Individual post pages with replies
- ✅ Reply submission system
- ✅ User authentication UI (login/register forms)
- ✅ ArcGIS embedded map showing population density and EV charging stations
- ✅ Dark/light mode support (via next-themes)
- ✅ Static pages: About, FAQ, Contact, Guidelines, Privacy, Terms

### Pending Backend Integration
- 🔄 User authentication (currently mock data)
- 🔄 Forum post CRUD operations (currently mock data)
- 🔄 Reply system (currently mock data)
- 🔄 Like/upvote functionality
- 🔄 Real-time statistics
- 🔄 User profiles and avatars

## 🌍 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Required
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Required for backend integration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Optional - for production deployment
NEXT_PUBLIC_SITE_URL=https://chargevilnius.com
```

### Environment Variable Details

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Yes | Google Maps JavaScript API key for address picker |
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL |
| `NEXT_PUBLIC_SITE_URL` | No | Full site URL for production (used in metadata) |

## 💻 Development

### Available Scripts

```bash
# Start development server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint
```

### Development Workflow

1. **Finding TODO comments**: Search for `// TODO:` in the codebase to find areas requiring backend integration
2. **Mock data locations**: 
   - Forum posts: `app/forum/page.tsx`
   - Post details: `app/forum/post/[id]/page.tsx`
   - Authentication: `components/auth/login-form.tsx`, `components/auth/register-form.tsx`
3. **Adding translations**: Edit `messages/en.json` and `messages/lt.json`
4. **Styling**: Uses Tailwind CSS - edit component classes or `app/globals.css`

### Code Structure Notes

- **TypeScript interfaces**: Check `components/forum/post-card.tsx` for `ForumPost` interface
- **Form validation**: Uses React Hook Form + Zod (see form components)
- **API calls**: Replace console.log statements in TODO sections with actual fetch/axios calls
- **Authentication flow**: Should store JWT token in localStorage or httpOnly cookies
- **State management**: Currently uses React useState (consider Zustand/Redux for complex state)

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub/GitLab
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The project can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Self-hosted with PM2

**Build command**: `pnpm build`  
**Output directory**: `.next`  
**Node version**: 18.x or higher

## 📝 Notes

### Current State
- The application currently uses **mock data** for all forum posts, replies, and user authentication
- Backend integration is required for full functionality
- All areas requiring backend integration are marked with `// TODO:` comments

### Google Maps
- Ensure API key has proper restrictions for security
- Required APIs: Maps JavaScript, Places, Geocoding
- Consider adding billing alerts in Google Cloud Console

### ArcGIS Map
- The embedded map uses ArcGIS embeddable components
- Map ID: `fdcad931c33b4fd09efadcf3d52b7b92`
- Shows population density squares and existing EV charging stations
- Portal URL: `https://licejus.maps.arcgis.com/`

### Internationalization
- Default language: English
- Language stored in cookie: `NEXT_LOCALE`
- Add new languages by creating `messages/{locale}.json` and updating `i18n/request.ts`

## 🤝 Contributing

When contributing:
1. Follow existing code style and TypeScript conventions
2. Add translations for both English and Lithuanian
3. Test responsive design on mobile/tablet/desktop
4. Update this README if adding new features or API endpoints
5. Mark incomplete features with TODO comments

## 📄 License

[Add your license here]

## 📧 Contact

[Add contact information here]

---

**Last Updated**: October 2025  
**Version**: 0.1.0  
**Built with**: Next.js 15, React 19, TypeScript, Tailwind CSS
