# Google Maps Integration Setup

This project uses Google Maps for address selection when creating forum posts.

## Setup Instructions

### 1. Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API**
4. Go to "Credentials" and create an API key
5. (Optional but recommended) Restrict your API key:
   - Application restrictions: HTTP referrers
   - Add your domain (e.g., `localhost:3000/*` for development)
   - API restrictions: Select the three APIs mentioned above

### 2. Add API Key to Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`

2. Open `.env.local` and add your API key:
   \`\`\`
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...your_actual_key_here
   \`\`\`

3. Restart your development server:
   \`\`\`bash
   pnpm dev
   \`\`\`

### 3. Features

The address picker includes:
- **Interactive map** centered on Vilnius, Lithuania
- **Click to select** - Click anywhere on the map to select a location
- **Draggable marker** - Drag the marker to fine-tune the location
- **Address search** - Type to search for addresses with autocomplete
- **Reverse geocoding** - Automatically converts coordinates to addresses
- **Lithuania-focused** - Search results are restricted to Lithuania

### 4. API Usage and Billing

Google Maps APIs have a free tier with generous limits:
- Maps JavaScript API: 28,000 loads per month free
- Places API: $17 of free usage per month
- Geocoding API: $200 of free usage per month

For most small to medium projects, you'll stay within the free tier.

### 5. Troubleshooting

**Map not loading?**
- Check that your API key is correct in `.env.local`
- Verify the APIs are enabled in Google Cloud Console
- Check browser console for error messages
- Make sure you've restarted the dev server after adding the API key

**"This page can't load Google Maps correctly"?**
- Your API key may have restrictions that block localhost
- Try removing restrictions temporarily for testing
- Check that billing is enabled on your Google Cloud project
