# AI-ME-GYS Chatbot Frontend

An advanced AI chatbot frontend application built with Next.js 15, TypeScript, TailwindCSS, and NextAuth. This application provides a sophisticated ChatGPT-like interface with comprehensive file management and resource indexing capabilities.

**Developed by PT. Mitra Integrasi Informatika for PT. Garuda Yamato Steel**

> ⚠️ **Proprietary Software**: This software is exclusively licensed to PT. Garuda Yamato Steel and is not for redistribution or use by other companies.

## ✨ Features

### 🔐 Authentication & Security
- **NextAuth Integration**: Secure authentication with Google OAuth support
- **Mock Authentication**: Development-friendly mock auth for UI testing
- **Basic HTTP Authentication**: Backend API authentication with environment-based credentials
- **JWT Token Management**: Automatic token handling and session management

### 💬 Advanced Chat Interface
- **ChatGPT-like UI**: Modern, responsive chat interface with sidebar navigation
- **Streaming Responses**: Real-time message streaming from backend
- **Rich Markdown Support**: Full markdown rendering with syntax highlighting
- **Assistant UI Components**: Built with @assistant-ui/react for enhanced UX
- **File Attachments**: Support for file uploads and attachments in chat
- **Conversation Management**: Create, pin, and delete conversations

### 🎨 User Experience
- **Responsive Design**: Mobile-first design with TailwindCSS v4
- **Dark/Light Theme**: Adaptive theming support
- **Loading States**: Comprehensive loading indicators and progress tracking
- **Error Handling**: User-friendly error messages with retry mechanisms
- **Toast Notifications**: Real-time user feedback system

### 🚀 Technical Features
- **Next.js 15**: Latest React framework with App Router
- **TypeScript**: Full type safety across the application
- **Azure Integration**: Document Intelligence, Blob Storage, AI Search
- **Real-time Updates**: WebSocket-like polling for status updates
- **Performance Optimized**: Efficient API calls and caching strategies

## Backend API Integration

This frontend is designed to work with a custom inferencing backend. The Next.js application acts as a proxy between the browser and your backend API.

### Authentication Setup

**Important:** Backend API authentication credentials must be configured using environment variables. See [`docs/backend-authentication.md`](docs/backend-authentication.md) for detailed setup instructions.

### Quick Start for Backend Developers

1. **Set Environment Variables:**
   ```env
   BACKEND_URL=https://your-backend-api.com
   BACKEND_API_USERNAME=your-api-username
   BACKEND_API_PASSWORD=your-api-password
   ```

2. **Implement Required Endpoints:**
   Your backend must provide these endpoints with Basic authentication:

   - `POST /chat` - Chat inference with streaming
   - `GET /conversations` - List conversations
   - `PUT /conversations/{id}/pin` - Pin/unpin conversation
   - `DELETE /conversations/{id}` - Delete conversation
   - `GET /conversations/{id}/chat` - Get chat history

3. **Authentication:**
   - All requests include `Authorization: Basic <base64>` header
   - JWT is obtained from NextAuth session
   - Backend should validate JWT as per your authentication system

4. **Streaming Response:**
   - Chat inference uses streaming with prefixed messages
   - Format: `convid:[id]` followed by `c:[base64(chunk)]` for each text chunk

### Detailed API Documentation

See [`docs/api-draft.md`](docs/api-draft.md) for complete API specifications, request/response schemas, and integration examples.

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** or **Bun** (recommended for frontend)
- **Python 3.11+** and **UV** (for backend)
- **Azure Account** (optional, for full AI features)

### One-Command Setup

1. **Clone and setup:**
   ```bash
   git clone https://github.com/MII-Microsoft-Data-AI/AI-ME-GYS-Chatbot-Frontend.git
   cd AI-ME-GYS-Chatbot-Frontend
   make setup
   ```

2. **Start both services:**
   ```bash
   make dev
   ```

3. **Access the application:**
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8000](http://localhost:8000)
   - **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

### Features Available Out of the Box
- ✅ **Mock Authentication** - No OAuth setup required
- ✅ **Chat Interface** - Fully functional AI chat
- ✅ **File Upload** - Drag & drop file management
- ✅ **Real-time Updates** - Live status tracking
- ✅ **Responsive Design** - Works on all devices

### Manual Setup

1. **Install dependencies:**
   ```bash
   # Install frontend dependencies
   bun install

   # Install mock server dependencies
   cd mock-server && bun install && cd ..
   ```

2. **Environment Configuration:**

   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

   The `.env.local` file should include:
   ```env
   # Frontend Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=development-secret-key
   MOCK_AUTH=false

   # Backend Integration
   BACKEND_URL=http://localhost:8000
   
   # Backend API Authentication
   BACKEND_API_USERNAME=apiuser
   BACKEND_API_PASSWORD=securepass123

   # Optional: Google OAuth (for real authentication)
   # GOOGLE_CLIENT_ID=your-google-client-id
   # GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

3. **Start services:**

   **Option A: Start both services together**
   ```bash
   make dev
   # Or
   bun run dev:full
   ```

   **Option B: Start services separately**
   ```bash
   # Terminal 1: Start mock backend
   bun run dev:backend
   # Or: make dev-backend

   # Terminal 2: Start frontend
   bun run dev:frontend
   # Or: make dev-frontend
   ```

### 🔧 Development Commands

```bash
# 🚀 Development Workflow
make dev              # Start both backend and frontend
make dev-backend      # Start only backend (Python/FastAPI)
make dev-frontend     # Start only frontend (Next.js)
make dev-logs         # Start with detailed logging

# 📊 Monitoring & Status
make status           # Check running services
make stop             # Stop all services gracefully
bun run test:api      # Test backend API connectivity

# 🛠️ Setup & Maintenance
make setup            # Complete project setup
make install          # Install all dependencies
make clean            # Clean generated files and caches
make help             # Show all available commands

# 🐛 Development Utilities
bun run lint          # Run ESLint checks
bun run build         # Build for production
bun run start         # Start production server

# 🗄️ Backend-specific Commands
cd mock-backend && uv run uvicorn main:app --reload  # Backend with auto-reload
cd mock-backend && uv sync                           # Install Python dependencies
```

### 📁 File Management Features

The application includes a comprehensive file management system:

```bash
# Available through the UI at /resource-management
- 📤 Drag & drop file upload (PDF, Word, Excel, PowerPoint, Images)
- 📊 Real-time indexing status tracking
- 🔄 File reindexing and retry mechanisms
- 🗑️ File deletion with confirmation
- 📈 Statistics dashboard with progress indicators
- 🔍 Azure AI Search integration for document content
```

## Mock Authentication

When `MOCK_AUTH=true` is set in development:

- The app bypasses real authentication
- Uses a mock user with the following details:
  - Name: John Doe
  - Email: john.doe@example.com
  - Profile Image: Random avatar
- No Google OAuth setup required
- Perfect for UI development and testing

## 🏗️ Project Structure

```
src/
├── app/
│   ├── auth/signin/          # Authentication pages
│   ├── chat/                 # Chat interface and conversation management
│   ├── api/                  # NextAuth and backend API routes
│   │   ├── auth/             # NextAuth configuration
│   │   └── be/               # Backend proxy endpoints
│   ├── globals.css           # Global styles and CSS variables
│   ├── layout.tsx            # Root layout with providers
│   └── page.tsx              # Landing page
├── components/
│   ├── assistant-ui/         # Advanced chat UI components
│   │   ├── attachment.tsx    # File attachment handling
│   │   ├── markdown-text.tsx # Markdown rendering
│   │   └── thread.tsx        # Chat thread management
│   ├── ui/                   # Reusable UI components (Radix-based)
│   ├── FileUpload.tsx        # Drag & drop file upload
│   ├── FileList.tsx          # File management interface
│   ├── FileStats.tsx         # File statistics dashboard
│   ├── ChatHeader.tsx        # Chat interface header
│   ├── ChatInput.tsx         # Message input component
│   ├── GlobalNavbar.tsx      # Main navigation
│   └── Providers.tsx         # Session and context providers
├── contexts/
│   ├── ChatContext.tsx       # Chat state management
│   ├── ChatInputContext.tsx  # Input handling context
│   └── ModalContext.tsx      # Modal state management
├── hooks/
│   ├── useNavigation.ts      # Navigation utilities
│   └── useToast.ts           # Toast notification system
├── lib/
│   ├── integration/          # Backend API integration
│   │   └── client/           # Type-safe API clients
│   ├── utils.ts              # Utility functions
│   └── site-config.ts        # Site configuration
├── types/
│   └── next-auth.d.ts        # NextAuth type definitions
├── utils/
│   ├── file-utils.ts         # File handling utilities
│   ├── date-utils.ts         # Date formatting
│   └── langgraph/            # LangGraph integration
└── auth.ts                   # NextAuth configuration

mock-backend/                 # Complete backend implementation
├── agent/                    # AI agent and tools
├── lib/                      # Authentication and database
├── orchestration/            # File indexing workflows
├── routes/                   # API endpoints
└── main.py                   # FastAPI application

docs/                         # Comprehensive documentation
├── AUTHENTICATION_SUMMARY.md # Auth implementation guide
├── RESOURCE_MANAGEMENT_*.md  # File management docs
└── backend-*.md              # Backend integration guides
```

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint

## API Integration

This frontend integrates with a custom backend API through the following architecture:

```
Browser Client → Next.js API Routes → Custom Backend
```

### Request Flow

1. **Browser** makes requests to Next.js API routes (e.g., `/api/conversations`)
2. **Next.js API Routes** extract JWT from NextAuth session
3. **Next.js API Routes** forward requests to backend with JWT in Authorization header
4. **Backend** processes requests and returns responses
5. **Next.js API Routes** return responses to the browser

### Authentication

All API requests are automatically authenticated:
- JWT tokens are extracted from NextAuth sessions
- Tokens are forwarded to backend in `Authorization: Bearer <token>` header
- No manual token management required in frontend code

### Backend Requirements

Your backend must implement these endpoints:

- `POST /chat/inference` - Chat inference with streaming
- `GET /conversations` - List conversations
- `PUT /conversations/:id/pin` - Toggle conversation pin
- `DELETE /conversations/:id` - Delete conversation
- `GET /conversations/:id/chats` - Get chat history

### Authentication

All API requests include JWT authentication:
```javascript
Authorization: Bearer <jwt_token>
```

### Mock Backend

A complete mock backend is included in the `mock-server/` directory:

```bash
# Start mock backend
make dev-backend
# Or
bun run dev:backend
```

The mock server provides:
- ✅ Rich markdown responses
- ✅ Streaming chat responses
- ✅ Persistent JSON storage
- ✅ Complete CRUD operations
- ✅ CORS support

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# =============================================================================
# FRONTEND CONFIGURATION
# =============================================================================

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=development-secret-key-change-in-production

# Development Features
MOCK_AUTH=true  # Enable mock authentication for development

# Company Integration (Optional)
NEXT_PUBLIC_GYS_PORTAL_URL=https://www.garudayamatosteel.com

# =============================================================================
# BACKEND API CONFIGURATION
# =============================================================================

# Backend URL for server-side API calls
BACKEND_URL=http://localhost:8000

# Backend API Authentication (matches mock-backend/.env)
BACKEND_API_USERNAME=apiuser
BACKEND_API_PASSWORD=securepass123

# =============================================================================
# GOOGLE OAUTH (Optional - for production)
# =============================================================================

# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Backend Configuration

The mock backend requires its own environment file (`mock-backend/.env`):

```env
# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT_NAME=your-deployment-name
AZURE_OPENAI_API_VERSION=2024-02-01

# Authentication (matches frontend)
BACKEND_AUTH_USERNAME=apiuser
BACKEND_AUTH_PASSWORD=securepass123

# Azure Services (Optional - for file indexing)
AZURE_STORAGE_CONNECTION_STRING=your-storage-connection-string
AZURE_STORAGE_CONTAINER_NAME=file-uploads
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=your-doc-intelligence-endpoint
AZURE_DOCUMENT_INTELLIGENCE_API_KEY=your-doc-intelligence-key
AZURE_SEARCH_ENDPOINT=your-search-endpoint
AZURE_SEARCH_API_KEY=your-search-key
AZURE_SEARCH_INDEX_NAME=document-index
```

## 🛠️ Technologies Used

### Frontend Stack
- **Next.js 15** - React framework with App Router and Turbopack
- **TypeScript** - Full type safety and modern JavaScript features
- **TailwindCSS v4** - Utility-first CSS framework with advanced features
- **NextAuth 4.24** - Comprehensive authentication solution
- **Assistant UI** - Advanced chat interface components (@assistant-ui/react)
- **Radix UI** - Accessible, unstyled UI primitives
- **Zustand** - Lightweight state management
- **React 19** - Latest React features and concurrent rendering

### Backend & AI Integration
- **FastAPI** - High-performance Python backend (mock-backend)
- **LangGraph** - AI agent orchestration and workflow management
- **Azure OpenAI** - GPT model integration for chat responses
- **Azure AI Search** - Document indexing and semantic search
- **Azure Blob Storage** - Secure file storage and management
- **Azure Document Intelligence** - Advanced document processing

### Development & Build Tools
- **Bun** - Fast package manager and JavaScript runtime
- **UV** - Ultra-fast Python package installer (backend)
- **ESLint 9** - Latest JavaScript linting with flat config
- **PostCSS** - CSS processing and optimization
- **Make** - Build automation and development workflows

### Libraries & Utilities
- **React Markdown** - Rich markdown rendering with plugins
- **Prism.js & Shiki** - Advanced syntax highlighting
- **KaTeX** - Mathematics rendering
- **Mermaid** - Diagram and flowchart rendering
- **Lucide React** - Modern icon library
- **Fuse.js** - Fuzzy search capabilities
- **Motion** - Smooth animations and transitions

## Production Deployment

1. Set a secure `NEXTAUTH_SECRET`
2. Set your backend endpoint and credential `BACKEND_URL`, `BACKEND_API_USERNAME`, `BACKEND_API_PASSWORD`
3. Deploy to your preferred platform (Vercel, Netlify, etc.)

## 📋 Recent Updates

### Latest Features (September 2025)
- ✨ **File Attachment Support**: Complete file upload and attachment system
- 🔐 **Enhanced Authentication**: Mock authentication for development
- 🎨 **Custom UI Components**: Advanced assistant UI with document references
- 📁 **Resource Management**: Full file indexing and management interface
- 🔄 **Real-time Updates**: Live polling for file processing status
- 🛡️ **Security Improvements**: HTTP Basic Auth for backend API
- 📱 **Mobile Optimization**: Enhanced responsive design

### Architecture Improvements
- 🏗️ **Modular Components**: Separated concerns with context providers
- 🔌 **API Integration**: Type-safe backend integration layer
- 📊 **State Management**: Centralized state with Zustand
- 🎯 **Error Handling**: Comprehensive error recovery mechanisms
- 🚀 **Performance**: Optimized bundle size and loading states

## 🔗 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[Authentication Guide](docs/AUTHENTICATION_SUMMARY.md)** - Complete auth setup
- **[Backend Integration](docs/backend-authentication.md)** - API integration guide
- **[Resource Management](docs/RESOURCE_MANAGEMENT_COMPLETE.md)** - File system guide
- **[API Contract](docs/backend-api-contract.md)** - Backend API documentation
- **[LangGraph Integration](docs/LANGGRAPH_STREAMING_PROTOCOL.md)** - AI agent setup

## 🏢 Company Information

**Developer**: PT. Mitra Integrasi Informatika  
**Client**: PT. Garuda Yamato Steel  
**Project Type**: Custom Software Solution  

## 📄 License & Ownership

This software is proprietary and exclusively licensed to **PT. Garuda Yamato Steel**. 

- ❌ **Not for redistribution** to other companies or organizations
- ❌ **No open source license** - all rights reserved
- ✅ **Exclusive use** by PT. Garuda Yamato Steel only
- ⚖️ **Warranty period** applies as per contract terms

## 🛠️ Development & Maintenance

### During Warranty Period
- Development and maintenance handled by **PT. Mitra Integrasi Informatika**
- Bug fixes and feature updates included per contract

### After Warranty Period
- Support available through separate maintenance contract
- For continued support and development, contact: **microsoft.ai@mii.co.id**

## 📞 Support & Contact

### Technical Support
- **Email**: microsoft.ai@mii.co.id
- **Company**: PT. Mitra Integrasi Informatika
- **Support Hours**: Business hours (Indonesian time)

### Support Scope
- ✅ Bug fixes and technical issues
- ✅ Feature enhancements and customizations  
- ✅ System maintenance and updates
- ✅ Integration support and consulting
- ✅ Training and knowledge transfer

### Important Notes
- Support is provided exclusively to **PT. Garuda Yamato Steel**
- Post-warranty support requires a separate maintenance agreement
- For urgent issues, please include detailed error logs and reproduction steps

---

**© 2025 PT. Mitra Integrasi Informatika. All rights reserved.**  
*Developed exclusively for PT. Garuda Yamato Steel*
