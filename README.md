# MERN Todo App with Authentication

A full-stack Todo application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring user authentication using JWT tokens.

## Features

### Backend
- ✅ User authentication (signup/login) with JWT
- ✅ Password hashing with bcrypt
- ✅ MongoDB database with Mongoose ODM
- ✅ Input validation with express-validator
- ✅ Protected routes with middleware
- ✅ Error handling and validation

### Frontend
- ✅ React with modern hooks and Context API
- ✅ Protected and public routes
- ✅ Form validation and error handling
- ✅ Responsive design with modern UI
- ✅ JWT token storage in localStorage
- ✅ Automatic token management

## Project Structure

```
mern-todo-app/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   └── authController.js     # Authentication logic
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT protection middleware
│   ├── models/
│   │   └── userModel.js          # User schema and methods
│   ├── routes/
│   │   └── authRoutes.js         # Authentication routes
│   ├── server.js                 # Express server
│   ├── package.json
│   └── env.example               # Environment variables template
└── frontend/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx   # Authentication context
    │   ├── pages/
    │   │   ├── Login.jsx         # Login page
    │   │   ├── Signup.jsx        # Signup page
    │   │   ├── Home.jsx          # Home page
    │   │   ├── Auth.css          # Auth pages styles
    │   │   └── Home.css          # Home page styles
    │   ├── App.jsx               # Main app component
    │   └── App.css               # App styles
    └── package.json
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
