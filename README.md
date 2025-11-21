# CHATNCOLLAB – Real-time Project Collaboration Platform

![CHATNCOLLAB Banner](https://img.shields.io/badge/CHATNCOLLAB-Collaboration%20Platform-blue?style=for-the-badge)


CHATNCOLLAB is a full-stack web application designed to help users create projects, collaborate, chat, and manage tasks in real time. It integrates AI assistance, authentication, project management, and a modern frontend + backend architecture.

---

## 🚀 Features

### 🔐 Authentication
- **Secure Registration & Login** – Token-based authentication system
- **Protected Routes** – Middleware to secure projects and chat endpoints
- **JWT-based Sessions** – Stateless authentication for scalability

### 📁 Project Management
- **Create New Projects** – Set up collaborative workspaces instantly
- **Add Team Members** – Invite users to collaborate
- **Update Project Details** – Edit descriptions, names, and settings
- **View Project List** – Dashboard to manage all your projects

### 💬 Real-Time Collaboration
- **WebSocket-Powered Chat** – Instant messaging using Socket.io
- **Live Project Updates** – Real-time synchronization across all users
- **Typing Indicators** – See when team members are responding
- **Message History** – Persistent chat storage with MongoDB

### 🤖 AI Assistance
- **Smart Task Suggestions** – AI-powered recommendations for project workflow
- **Automated Task Generation** – Create tasks from project descriptions using Google Gemini
- **Intelligent Responses** – Get help with project planning and execution
- **Natural Language Processing** – Understand context and provide relevant suggestions

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React** | UI library for building interactive interfaces |
| **Vite** | Fast build tool and development server |
| **TailwindCSS** | Utility-first CSS framework |
| **Axios** | HTTP client for API requests |
| **Context API** | Global state management |
| **Socket.io Client** | Real-time WebSocket communication |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Web application framework |
| **MongoDB** | NoSQL database via Mongoose ODM |
| **Redis** | **Required** - In-memory caching for sessions & performance |
| **Socket.io Server** | Real-time bidirectional communication |
| **JWT** | JSON Web Tokens for authentication |

### Development Tools
- **ESLint** – Code linting
- **Prettier** – Code formatting
- **PostCSS** – CSS transformation
- **Nodemon** – Auto-restart for development

---

## 📂 Project Structure

```
CHATNCOLLAB/
│
├── backend/
│   ├── controllers/          # Request handlers
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── chatController.js
│   ├── models/               # Database schemas
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Message.js
│   ├── routes/               # API endpoints
│   │   ├── auth.js
│   │   ├── projects.js
│   │   └── chat.js
│   ├── services/             # Business logic
│   │   ├── aiService.js
│   │   └── redisService.js
│   ├── middleware/           # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── db/                   # Database configuration
│   │   └── connection.js
│   ├── server.js             # Entry point
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── screens/          # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Project.jsx
│   │   │   └── Chat.jsx
│   │   ├── auth/             # Authentication components
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── config/           # Configuration files
│   │   │   └── axios.js
│   │   ├── context/          # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── routes/           # Routing configuration
│   │   │   └── AppRoutes.jsx
│   │   ├── assets/           # Static assets
│   │   ├── App.jsx           # Root component
│   │   └── main.jsx          # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env
│
├── .gitignore
├── README.md
└── temp.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or Atlas)
- **Redis** (required for caching) - [Install Redis](https://redis.io/docs/getting-started/installation/)
- **Google Gemini API Key** (required for AI features) - [Get API Key](https://makersuite.google.com/app/apikey)
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/SravikaPadakanti/CHATNCOLLAB.git
cd CHATNCOLLAB
```

### 2. Backend Setup

```bash
cd backend
npm install
```

**Install and Start Redis:**

For **macOS** (using Homebrew):
```bash
brew install redis
brew services start redis
```

For **Ubuntu/Debian**:
```bash
sudo apt-get update
sudo apt-get install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

For **Windows**:
- Download Redis from [Redis Windows](https://github.com/microsoftarchive/redis/releases)
- Or use Docker: `docker run -d -p 6379:6379 redis`

**Verify Redis is running:**
```bash
redis-cli ping
# Should return: PONG
```

**Get Google Gemini API Key:**

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key
5. Add it to your `.env` file

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/chatncollab
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/chatncollab

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# Redis Configuration (Required for Caching)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
REDIS_HOST=localhost
REDIS_PORT=6379

# AI Service (Required - Google Gemini)
GEMINI_API_KEY=your_google_gemini_api_key_here
# Get your API key from: https://makersuite.google.com/app/apikey

# CORS
ALLOWED_ORIGINS=http://localhost:5173
```

Start the backend server:

```bash
npm start
# For development with auto-restart:
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

Start the frontend development server:

```bash
npm run dev
```

---

## 🔌 Environment Variables

### Backend Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | No (default: 3000) |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `JWT_EXPIRE` | JWT expiration time | No (default: 7d) |
| `REDIS_URL` | Redis connection URL | **Yes (Required)** |
| `REDIS_HOST` | Redis host address | **Yes (Required)** |
| `REDIS_PORT` | Redis port number | **Yes (Required)** |
| `REDIS_PASSWORD` | Redis password (if configured) | No |
| `GEMINI_API_KEY` | Google Gemini API key for AI features | **Yes (Required)** |
| `ALLOWED_ORIGINS` | CORS allowed origins | No |

### Frontend Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_BACKEND_URL` | Backend API URL | Yes |
| `VITE_SOCKET_URL` | WebSocket server URL | Yes |

---

## 🧪 Run the App

### Development Mode

1. **Start Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs at: `http://localhost:3000`

2. **Start Frontend Development Server:**
   ```bash
   cd frontend
   npm run dev
   ```
   Application runs at: `http://localhost:5173`

3. **Access the Application:**
   Open your browser and navigate to `http://localhost:5173`

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

**Backend:**
```bash
cd backend
npm start
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` – Register new user
- `POST /api/auth/login` – Login user
- `GET /api/auth/me` – Get current user (protected)

### Projects
- `GET /api/projects` – Get all user projects (protected)
- `POST /api/projects` – Create new project (protected)
- `GET /api/projects/:id` – Get project details (protected)
- `PUT /api/projects/:id` – Update project (protected)
- `DELETE /api/projects/:id` – Delete project (protected)
- `POST /api/projects/:id/members` – Add member to project (protected)

### Chat
- `GET /api/chat/:projectId` – Get chat messages (protected)
- `POST /api/chat/:projectId` – Send message (protected)

### WebSocket Events
- `connection` – Client connects
- `join_project` – Join project room
- `send_message` – Send chat message
- `typing` – User typing indicator
- `disconnect` – Client disconnects

---

## 🎨 Features in Detail

### Real-Time Chat
- Instant message delivery using WebSockets
- Message persistence in MongoDB
- Typing indicators for better UX
- Online/offline status tracking

### Project Collaboration
- Create and manage multiple projects
- Invite team members via email
- Role-based access control
- Activity logs and notifications

### AI-Powered Assistance
- Generate task lists from project descriptions using Google Gemini AI
- Get intelligent suggestions for project milestones
- Smart recommendations for task prioritization
- Natural language understanding for better collaboration

---

## 🤝 Contribution Guidelines

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/CHATNCOLLAB.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit Your Changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

4. **Push to Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**
   - Describe your changes clearly
   - Reference any related issues
   - Ensure all tests pass

### Code Style
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages
- Add comments for complex logic

---

## 📝 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Sravika Padakanti** – [GitHub](https://github.com/SravikaPadakanti)

---

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature idea? Please open an issue:

- **Bug Report:** [Create Issue](https://github.com/SravikaPadakanti/CHATNCOLLAB/issues/new?template=bug_report.md)
- **Feature Request:** [Create Issue](https://github.com/SravikaPadakanti/CHATNCOLLAB/issues/new?template=feature_request.md)

---

## 📧 Contact

For questions or support, reach out via:
- **GitHub Issues:** [CHATNCOLLAB Issues](https://github.com/SravikaPadakanti/CHATNCOLLAB/issues)
- **Email:** your.email@example.com

---

## 🙏 Acknowledgments

- Built with ❤️ using React and Node.js
- Socket.io for real-time communication
- MongoDB for reliable data storage
- TailwindCSS for beautiful UI components
- Google Gemini AI for intelligent assistance

---

## 📚 Additional Resources

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Socket.io Documentation](https://socket.io/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Redis Documentation](https://redis.io/docs/)
- [React Documentation](https://react.dev/)

---

**⭐ If you find this project useful, please consider giving it a star on GitHub!**
