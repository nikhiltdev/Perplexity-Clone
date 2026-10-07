# 🧠 Perplexity Clone - Backend API

A robust, AI-powered conversational backend designed for the **Perplexity Clone** application. Built with **Node.js**, **Express**, **MongoDB**, **Socket.io**, and **LangChain** (powered by Cohere LLM), this backend handles user authentication, conversation thread management, context-aware AI response generation, and real-time communication.

---

## 📌 Project Overview

The backend acts as the core intelligence engine of the Perplexity Clone. It allows users to:
1. **Authenticate Securely**: Register and log in using encrypted passwords and HTTP-only JWT cookies.
2. **Start AI Conversations**: Ask questions and receive intelligent answers powered by Cohere's language models.
3. **Auto-Generate Chat Titles**: Automatically analyze the user's first query to create clean, human-friendly titles (3–7 words) for threads.
4. **Context-Aware Chat History**: Retain full multi-turn conversation context so follow-up queries make sense to the AI.
5. **Manage Threads**: Browse past conversations, fetch thread messages, and delete threads along with all associated messages.
6. **Real-Time Communication**: Pre-configured Socket.io server to support live updates.

---

## 🛠️ Tech Stack

- **Runtime Environment:** [Node.js](https://nodejs.org/) (ES Modules)
- **Web Framework:** [Express.js v5](https://expressjs.com/)
- **Database & ODM:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **AI & LLM Integration:** [LangChain](https://js.langchain.com/) (`@langchain/cohere`, `@langchain/google`, `langchain`)
- **Primary LLM:** Cohere `command-r7b-12-2024` (also configurable with Google Gemini)
- **Real-Time Engine:** [Socket.io](https://socket.io/)
- **Authentication & Security:** [JWT (JSON Web Token)](https://jwt.io/), [bcryptjs](https://www.npmjs.com/package/bcryptjs), [cookie-parser](https://www.npmjs.com/package/cookie-parser), [cors](https://www.npmjs.com/package/cors)
- **Logging & Dev Tools:** [Morgan](https://www.npmjs.com/package/morgan), [Nodemon](https://nodemon.io/), [dotenv](https://www.npmjs.com/package/dotenv)

---

## 📁 Backend Folder Structure

```text
Backend/
├── package.json               # Dependencies and execution scripts
├── server.js                  # Application entry point (HTTP & Socket server startup)
├── .env                       # Environment variables (secret keys, DB connection)
└── src/
    ├── app.js                 # Express application setup, middlewares, and route mounting
    ├── config/
    │   └── db.js              # MongoDB database connection configuration
    ├── controllers/
    │   ├── auth.controller.js # Logic for user registration, login, and profile fetching
    │   └── chat.controller.js # Logic for creating chats, generating AI answers, fetching & deleting threads
    ├── middleware/
    │   └── user.middleware.js # JWT authentication guard for protected routes
    ├── models/
    │   ├── user.model.js      # User schema (email, username, password)
    │   ├── chat.model.js      # Chat thread schema (title, user reference)
    │   └── message.model.js   # Message schema (role: user/ai, content, chat reference)
    ├── routes/
    │   ├── auth.routes.js     # Routes for /api/auth
    │   └── chat.routes.js     # Routes for /api/chat
    ├── services/
    │   └── ai.service.js      # LangChain & Cohere LLM logic (answers & title generation)
    ├── sockets/
    │   └── server.socket.js   # Socket.io server initialization and event handlers
    └── utils/
        └── generateToken.js   # JWT token generation helper function
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `Backend` directory and define the following variables:

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/perplexity?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
COHERE_API_KEY=your_cohere_api_key
GOOGLE_API_KEY=your_google_gemini_api_key  # Optional: if using Gemini
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/nikhiltdev/Perplexity-Clone.git
cd Perplexity-Clone/Backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start MongoDB
Ensure you have a running MongoDB instance locally or have configured your MongoDB Atlas connection string in `.env`.

### 4. Run the Server

- **Development Mode (with auto-reload):**
  ```bash
  npm run dev
  ```

- **Production Mode:**
  ```bash
  npm start
  ```

Once started, you should see:
```text
connected to mongodb
socket server initialized
Server is running on port 3000
```

---

## 📡 API Reference

### 1. Health Check
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/health` | Check if the backend is running smoothly | No |

---

### 2. Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user (`email`, `username`, `password`) | No |
| `POST` | `/api/auth/login` | Login user and issue secure JWT cookie (`email`, `password`) | No |
| `GET` | `/api/auth/me` | Fetch authenticated user details | Yes (Cookie / Token) |

#### Example Request: Register User
```json
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "alex",
  "password": "securepassword123"
}
```

---

### 3. Chat & AI Conversations (`/api/chat`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/chat/create-chat` | Send a query. Creates new chat or adds to existing thread, then returns AI response | Yes |
| `GET` | `/api/chat` | Retrieve all chat threads for the logged-in user | Yes |
| `GET` | `/api/chat/:chatId/message` | Retrieve all messages for a specific chat thread | Yes |
| `DELETE` | `/api/chat/:chatId` | Delete a chat thread and all its messages | Yes |

#### Example Request: Create Chat / Send Message
```json
POST /api/chat/create-chat
Content-Type: application/json

{
  "message": "Explain how quantum computing works in simple terms",
  "chatId": null 
}
```
> *Note: Pass `chatId: null` or omit it to start a new thread. Pass an existing `chatId` to continue a thread with full conversation history.*

#### Example Response:
```json
{
  "chat": {
    "_id": "6741f...",
    "title": "Quantum Computing Explained",
    "user": "6741e...",
    "createdAt": "2026-10-07T..."
  },
  "userMessage": {
    "_id": "6741g...",
    "chat": "6741f...",
    "role": "user",
    "content": "Explain how quantum computing works in simple terms"
  },
  "aiMessage": {
    "_id": "6741h...",
    "chat": "6741f...",
    "role": "ai",
    "content": "Quantum computing is a type of computation that harnesses the principles of quantum mechanics..."
  }
}
```

---

## 💡 How the AI Pipeline Works

1. **New Thread**: When a message is sent without a `chatId`, `generateChatTitle()` invokes Cohere with a specialized system prompt to produce a concise 3–7 word thread title.
2. **Context Memory**: All past messages in the thread are fetched and converted into LangChain message objects (`HumanMessage` and `AIMessage`).
3. **Generation**: The full message sequence is sent to Cohere (`command-r7b-12-2024`) via `COHERE_LLM.invoke()`.
4. **Persistence**: The user prompt and AI answer are both saved in MongoDB under the same `chatId`, keeping conversation continuity intact.

---

## 🔒 Security Features
- **Password Protection**: Passwords are salted and hashed using `bcryptjs` before database storage.
- **Token Security**: JWT tokens are transmitted via `httpOnly`, `secure`, and `sameSite` cookies to protect against XSS and CSRF attacks.
- **Route Authorization**: `userMiddleware` verifies tokens on every protected endpoint and binds the user ID to `req.user`.
