# AI Health Assistant

A modern full-stack AI Health Assistant application built with React, Node.js, MongoDB, and Google Gemini API. Features dark mode, voice input, chat export, health tips, and comprehensive FAQ sections.

## Features

- 🩺 **AI Health Assistant**: Interactive health conversations with Google Gemini AI
- 🌙 **Dark Mode**: Beautiful dark theme with persistent storage
- 🎤 **Voice Input**: Hands-free voice recognition for easy communication
- 🔍 **Chat Search**: Search through your conversation history
- 💾 **Chat Export**: Download conversations as text files
- 🚀 **Quick Actions**: Predefined health queries for common questions
- 📊 **Dashboard Stats**: View your conversation statistics
- 💡 **Health Tips**: Daily wellness tips and recommendations
- ❓ **FAQ Section**: Comprehensive answers to common health questions
- 💬 **Chat History**: Save and manage conversation history
- 👤 **User Authentication**: Secure login and registration
- 🎨 **Modern UI**: Beautiful glassmorphic design with smooth animations
- 📱 **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios for API calls
- React Markdown for message rendering
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Google Generative AI (Gemini)
- JWT for authentication
- bcryptjs for password hashing
- Rate limiting for API protection

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Google Gemini API key

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personal-ai-agent
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   - Update the `.env` file in the root directory with your actual values:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   MONGODB_URI=mongodb://localhost:27017/personal-ai-agent
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_secure_jwt_secret_here
   ```

4. **Get Google Gemini API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key and paste it in your `.env` file

5. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - For local installation: `mongod`
   - Or use MongoDB Atlas for cloud database

## Running the Application

### Development Mode
```bash
npm run dev
```
This will start both the backend server (port 5000) and React frontend (port 3000) concurrently.

### Individual Services
```bash
# Backend only
npm run server

# Frontend only
npm run client
```

## API Endpoints

### Authentication
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - Login user
- `GET /api/user/profile/:userId` - Get user profile

### Chat
- `GET /api/chat/:userId` - Get all chats for user
- `GET /api/chat/:userId/:chatId` - Get specific chat
- `POST /api/chat/:userId` - Create new chat
- `POST /api/chat/:userId/:chatId/message` - Add message to chat
- `DELETE /api/chat/:userId/:chatId` - Delete chat

### AI Features
- `POST /api/chat/search` - Search and get AI answers
- `POST /api/chat/summarize` - Summarize text

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Dashboard**: View your chat history, search, and summarize features
3. **New Chat**: Start a conversation with the AI agent
4. **Search**: Ask questions and get instant answers
5. **Summarize**: Paste text to get concise summaries

## Project Structure

```
personal-ai-agent/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── index.js           # Server entry point
│   └── package.json
├── .env                   # Environment variables
├── package.json           # Root package.json
└── README.md
```

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please create an issue in the repository.