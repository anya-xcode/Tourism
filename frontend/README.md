# Tourism Explorer - Frontend

An AI-powered community travel exploration platform built with React, TypeScript, and Vite.

## 🚀 Live Deployment

**Frontend**: https://tourismfront-sigma.vercel.app/  
**Backend API**: https://tourism-two-lovat.vercel.app/

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + PostCSS
- **State Management**: Context API
- **Maps**: Google Maps API
- **Routing**: React Router v7
- **Animation**: Framer Motion
- **UI Icons**: Lucide React

## 📋 Prerequisites

- Node.js (v20+)
- npm or yarn
- A backend API server running

## 🚀 Getting Started

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create `.env` file** (for local development):
   ```env
   VITE_API_URL=http://localhost:5001/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   
   Opens at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output files in `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── auth/         # Authentication components
│   ├── layout/       # Layout wrapper components
│   └── places/       # Place-related components
├── pages/            # Page components
├── services/         # API service calls
├── context/          # React Context (Auth)
├── types/            # TypeScript definitions
├── assets/           # Static assets
├── App.tsx           # Main App component
└── main.tsx          # Entry point
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🌐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API endpoint | `https://tourism-two-lovat.vercel.app/api` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | From Google Cloud Console |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API Key | From Google Cloud Console |

## 🚢 Deployment to Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy - Vercel auto-deploys on `git push`

## ✨ Features

- 🗺️ Interactive map explore
- 🏆 Place discovery and bookmarks
- 👥 Community reviews
- 🎬 Travel reels feed
- 🚗 Ride sharing
- 💬 Discussion threads
- 🤖 AI recommendations
- 📱 Responsive design

## 📝 License

MIT
