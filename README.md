# Tourism Explorer - AI-Powered Community Travel Platform

A full-stack travel exploration application that combines community insights with AI recommendations to help discover amazing travel destinations.

##  Live Deployment

| Component | URL |
|-----------|-----|
| **Frontend** | https://tourismfront-sigma.vercel.app/ |
| **Backend API** | https://tourism-two-lovat.vercel.app/api |

##  Project Structure

```
tourism/
├── frontend/          # React + TypeScript + Vite
├── backend/           # Express.js + TypeScript + MongoDB
└── docs/              # Architecture & diagrams
```

##  Tech Stack

### Frontend
- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS + PostCSS
- React Router v7
- Framer Motion
- Google Maps API
- Lucide React Icons

### Backend
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (image hosting)
- Helmet (security)
- CORS support

##  Features

-  **Interactive Map** - Explore places on an interactive map
-  **Place Discovery** - Find unique places with community reviews
-  **Media Sharing** - Upload and share travel photos
-  **Reels Feed** - Discover travel video content
-  **Community Reviews** - Read and write reviews
-  **Ride Comparison** - Compare ride sharing options
-  **Visit Events** - Schedule and RSVP for travel events
-  **AI Recommendations** - Get personalized place recommendations
-  **Bookmarks** - Save favorite places
-  **Discussion Threads** - Join travel discussions
-  **User Profiles** - Manage your travel profile

##  Getting Started

### Prerequisites
- Node.js v20+
- MongoDB Atlas account
- Firebase/Google OAuth credentials
- Cloudinary account

### Frontend Setup

```bash
cd frontend
npm install

# Create .env file
VITE_API_URL=https://tourism-two-lovat.vercel.app/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_MAPS_API_KEY=your_maps_key

# Start dev server
npm run dev
```

### Backend Setup

```bash
cd backend
npm install

# Create .env file
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_MAPS_API_KEY=your_maps_key
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
CORS_ORIGIN=https://tourismfront-sigma.vercel.app

# Start dev server
npm run dev
```

##  Documentation

See the [docs/](docs/) folder for:
- Architecture diagrams
- Entity Relationship Diagram (ERD)
- Sequence diagrams
- Use case diagrams

##  Environment Variables

### Frontend (.env)
```env
VITE_API_URL=https://tourism-two-lovat.vercel.app/api
VITE_GOOGLE_CLIENT_ID=your_client_id
VITE_GOOGLE_MAPS_API_KEY=your_maps_key
```

### Backend (.env)
```env
PORT=5001
MONGODB_URI=mongodb+srv://user:pass@cluster...
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=cloud_name
CLOUDINARY_API_KEY=api_key
CLOUDINARY_API_SECRET=api_secret
GOOGLE_MAPS_API_KEY=maps_key
GOOGLE_CLIENT_ID=client_id
GOOGLE_CLIENT_SECRET=client_secret
NODE_ENV=production
CORS_ORIGIN=https://tourismfront-sigma.vercel.app
```

## Deployment

### Vercel Deployment

**Frontend**:
1. Push code to GitHub
2. Connect repo to Vercel
3. Set environment variables
4. Auto-deploys on push

**Backend**:
1. Push code to GitHub
2. Connect repo to Vercel (root: `backend/`)
3. Set environment variables
4. Configure as Node.js app
5. Auto-deploys on push

## API Endpoints

### Health Check
- `GET /health` - Server status

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth

### Places
- `GET /api/places` - Get all places
- `POST /api/places` - Create place
- `GET /api/places/:id` - Get place details

### Reviews
- `GET /api/reviews/:placeId` - Get place reviews
- `POST /api/reviews` - Create review

### Bookmarks
- `GET /api/bookmarks` - Get user bookmarks
- `POST /api/bookmarks` - Create bookmark

*See backend routes for complete API documentation*

## Contributing

Contributions welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your fork
5. Submit a Pull Request

## 📄 License

MIT License - feel free to use this project

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

