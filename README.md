# Gamified Todo App with Glassmorphism Design

A modern, gamified todo application built with React (TypeScript), Express.js, and featuring a beautiful glassmorphism UI with comprehensive gamification system.

## 🎮 Features

### Core Functionality
- **Task Management**: Create daily, weekly, and monthly tasks
- **Glassmorphism UI**: Beautiful gradient backgrounds with glass-like cards
- **Responsive Design**: Works perfectly on desktop and mobile

### Gamification System
- **Points & Levels**: Earn points for completing tasks, level up with XP
- **Smart Scoring**: Time-based bonuses and penalties
- **Badges & Achievements**: Unlock special badges for consistent performance
- **Streaks**: Track daily completion streaks
- **Progress Tracking**: Visual progress bars for all task categories

### Visual Enhancements
- **Linear Progress Bars**: Smooth animated bars with gradient fills and glow effects
- **Enhanced Calendar**: Color-coded task indicators with streak highlights
- **Completion Effects**: Confetti animations and toast notifications
- **Dashboard View**: Comprehensive progress overview with statistics

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Setup

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd mern-todo-app
npm install
```

2. **Start the development servers:**
```bash
# Start both frontend and backend concurrently
npm run dev

# Or start them separately:
# Backend (Terminal 1)
npm run server

# Frontend (Terminal 2) 
npm run client
```

3. **Access the application:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 🎯 Gamification Rules

### Points System
- **Daily Tasks**: +10 points (on time), -5 points (late/missed)
- **Weekly Tasks**: +25 points (on time), -10 points (late/missed)  
- **Monthly Tasks**: +60 points (on time), -20 points (late/missed)
- **Early Bird Bonus**: +5 points for tasks completed between 5:00-9:00 AM

### Levels & XP
- **XP Formula**: `requiredXP(level) = 100 + (level-1) * 50`
- **Level Names**: Novice → Doer → Task Master → Focus Pro → Zen Operator
- **XP Source**: Positive points earned (negative points don't affect XP)

### Badges
- **🌅 Early Bird**: Complete any task between 5:00-9:00 AM
- **👑 Consistency King**: Complete all daily tasks for 7 consecutive days
- **🏆 Weekly Champion**: Complete all weekly tasks within the week

## 🏗️ Project Structure

```
mern-todo-app/
├── src/                          # React TypeScript frontend
│   ├── components/
│   │   ├── LinearProgressBar.tsx # Animated progress bars
│   │   ├── DashboardView.tsx     # Progress dashboard modal
│   │   ├── EnhancedHeader.tsx    # Header with level/XP display
│   │   ├── EnhancedCalendar.tsx  # Calendar with task indicators
│   │   ├── TaskCard.tsx          # Individual task component
│   │   └── CompletionEffects.tsx # Animations and notifications
│   ├── hooks/
│   │   └── useGamification.ts    # Main gamification hook
│   ├── types/
│   │   └── gamification.ts       # TypeScript type definitions
│   └── App.tsx                   # Main application component
├── server/
│   ├── index.js                  # Express backend with gamification logic
│   └── seed.js                   # Demo data and testing utilities
├── frontend/                     # Original React frontend (legacy)
├── backend/                      # Original Express backend (legacy)
└── package.json                  # Root package with scripts
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   # Copy the example file
   cp env.example .env
   
   # Edit .env with your configuration
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/todo-app
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

4. **Start the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000` and automatically proxy API calls to the backend on `http://localhost:5000`.

## API Endpoints

### Authentication Routes

- `POST /api/auth/signup` - Register a new user
  - Body: `{ name, email, password }`
  - Returns: `{ user, token }`

- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ user, token }`

- `GET /api/auth/me` - Get current user profile
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ user }`

## Usage

1. **Start both servers** (backend and frontend)
2. **Open** `http://localhost:3000` in your browser
3. **Sign up** for a new account or **login** with existing credentials
4. **You'll be redirected** to the home page after successful authentication
5. **Use the logout button** to sign out

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/todo-app
JWT_SECRET=your_jwt_secret_key_here
```

### Frontend
The frontend automatically proxies API calls to `http://localhost:5000` (configured in package.json).

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 12
- **JWT Tokens**: Secure authentication with 30-day expiration
- **Input Validation**: Server-side validation for all inputs
- **Protected Routes**: Middleware protection for sensitive endpoints
- **CORS**: Configured for secure cross-origin requests

## Technologies Used

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client
- **CSS3** - Styling with modern features

## Next Steps

This is a foundation for a Todo app. You can extend it by adding:

1. **Todo CRUD operations** (Create, Read, Update, Delete)
2. **Todo categories and tags**
3. **Search and filtering**
4. **User profile management**
5. **Password reset functionality**
6. **Email verification**
7. **Social authentication**

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally or your Atlas connection string is correct
   - Check your MONGO_URI in the .env file

2. **Port Already in Use**
   - Change the PORT in your .env file
   - Kill processes using the default ports

3. **CORS Errors**
   - Ensure the backend is running on the correct port
   - Check that the frontend proxy is configured correctly

4. **JWT Token Issues**
   - Verify your JWT_SECRET is set correctly
   - Check that tokens are being stored in localStorage

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).
