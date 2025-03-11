# Chat App MERN

A real-time chat application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with Socket.io for real-time communication.

## Features

- Real-time messaging
- File and media sharing capabilities
- User authentication
- User online/offline status
- User profile management
- Themes
- Responsive design for mobile and desktop

## Features to be Developed

Future enhancements planned for this application include:

- End-to-end encryption for messages
- Group chat functionality
- Voice and video calling
- Message search functionality
- Read receipts
- User typing indicators
- User blocking functionality
- Chat archiving
- Integration with third-party authentication (Google, Facebook)

## Tech Stack

### Frontend

- React.js
- Zustand for state management
- Socket.io client
- Tailwind CSS
- Daisy UI
- React Router for navigation

### Backend

- Typescript
- Node.js
- Express.js
- MongoDB for database
- Socket.io for real-time communication
- JWT for authentication
- Mongoose for MongoDB object modeling

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14.x or higher)
- npm or yarn
- MongoDB (local or Atlas connection)

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/burhanusr/chat-app-mern.git
   cd chat-app-mern
   ```
2. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies
   ```bash
   cd ../frontend
   npm install
   ```
4. Create a .env file in the backend directory with the following variables:

   ```bash
   # Mongo
   MONGO_USER=your_mongo_username
   MONGO_PASSWORD=your_mongo_password
   MONGO_URL=your_mongo_url
   MONGO_DATABASE=your_database_name

   # Server
   PORT=3000
   SERVER_HOSTNAME=localhost

   # JWT
   JWT_SECRET=your_jwt_secret

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Frontend
   FRONTEND_BASEURL=http://localhost:5173

   #Environment
   NODE_ENV=development
   ```

5. Create a .env file in the frontend directory with the following variables:
   ```bash
   VITE_REACT_APP_BACKEND_BASEURL=http://localhost:3000
   ```

## Running the Application

1. Start the backend server
   ```bash
   cd backend
   npm run build && npm start
   ```
2. Start the frontend development server
   ```bash
   cd frontend
   npm run build && npm start
   ```
3. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

- `POST /api/v1/auth/signup` - Register a new user
- `POST /api/v1/auth/login` - Login a user
- `POST /api/v1/auth/logout` - Logout a user
- `GET /api/v1/users/:id` - Get a user by ID
- `PATCH /apiv1/users/update-profile` - Update user profile
- `GET /api/v1/messages/users` - Get all chats for a user
- `GET /api/v1/messages/:receiverId` - Get messages for a specific chat
- `GET /api/v1/messages/send/:receiverId` - Send a new message
