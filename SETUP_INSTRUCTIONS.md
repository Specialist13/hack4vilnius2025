# ChargeVilnius Forum - Local Setup Instructions

## Project Structure

\`\`\`
your-project-folder/
├── .env.local              ← Create this file in the root directory
├── .env.local.example      ← Template provided
├── package.json
├── next.config.mjs
├── tsconfig.json
├── app/
├── components/
├── lib/
├── public/
└── ... other files
\`\`\`

## Setup Steps

### 1. Install Dependencies

\`\`\`bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
\`\`\`

### 2. Configure Google Maps API Key

Create a `.env.local` file in the **root directory** (same level as `package.json`):

\`\`\`env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
\`\`\`

**Important:** 
- The file must be named exactly `.env.local`
- Place it in the root folder, NOT in any subdirectory
- Replace `your_actual_api_key_here` with your actual Google Maps API key

### 3. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Go to "Credentials" and create an API key
5. Copy the API key to your `.env.local` file

### 4. Run the Development Server

\`\`\`bash
pnpm dev
# or npm run dev
# or yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Troubleshooting

### "Google Maps API key not found" error
- Make sure `.env.local` exists in the root directory
- Verify the variable name is exactly `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- Restart the development server after creating/modifying `.env.local`

### Map not loading
- Check that all three APIs are enabled in Google Cloud Console
- Verify your API key has no restrictions preventing localhost access
- Check browser console for specific error messages

### TypeScript errors
- Run `pnpm install` to ensure all dependencies are installed
- The Google Maps types are loaded globally via the script tag

## Backend Integration

The project currently uses mock data. To integrate with your backend:

1. Search for `// TODO: Backend integration` comments in the code
2. Replace mock data with actual API calls
3. Add your backend URL to `.env.local` if needed:
   \`\`\`env
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
