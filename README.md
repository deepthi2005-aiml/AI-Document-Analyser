# AI Document Analyzer

## 📋 Project Overview
AI Document Analyzer is a full-stack web application that leverages Google's Gemini AI to analyze and extract insights from uploaded documents. This portfolio project demonstrates modern web development practices, AI integration, and responsive UI/UX design.

## ✨ Features

### 📄 Document Processing
- **Multi-format Support**: PDF, DOCX, TXT, PPTX, CSV files
- **Text Extraction**: Automatic content extraction with preprocessing
- **Document Metadata**: Word count, page count, creation date analysis
- **Chunking**: Handles large documents exceeding token limits

### 🧠 AI Analysis Capabilities
- **Smart Summarization**: Adjustable summary lengths (short/medium/detailed)
- **Key Insights**: Automatic topic and theme identification
- **Sentiment Analysis**: Detects document tone and emotional sentiment
- **Entity Recognition**: Extracts people, organizations, dates, locations
- **Q&A System**: Natural language queries about document content
- **Comparative Analysis**: Compare multiple documents for insights
- **Translation**: Multi-language document translation

### 🎨 User Interface
- **Modern Dashboard**: Clean, responsive design with analytics visualization
- **Document Preview**: Side-by-side document viewing
- **Interactive Chat**: Conversational interface for Q&A sessions
- **Analysis History**: Save and revisit previous analysis sessions
- **Export Options**: Download reports as PDF, JSON, or text
- **Dark/Light Mode**: Toggle between themes for comfortable viewing

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Tailwind CSS** for utility-first styling
- **Recharts** for data visualization
- **React Dropzone** for file uploads
- **React Query** for state management and API calls

### Backend
- **FastAPI** (Python) for high-performance API development
- **SQLAlchemy** for database ORM
- **PostgreSQL** for data persistence
- **PyPDF2 / python-docx** for document parsing
- **Google Gemini API** for AI analysis

### DevOps & Tools
- **Docker** for containerization
- **PostgreSQL** for production database
- **SQLite** for development
- **GitHub Actions** for CI/CD (optional)

## 🚀 Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL (or SQLite for development)
- Google Gemini API key

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/ai-document-analyzer.git
cd ai-document-analyzer/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your Gemini API key and database settings

# Initialize database
python init_db.py

# Run the backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your backend API URL

# Start development server
npm start
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build

# Or using individual containers
docker build -t ai-document-analyzer-backend ./backend
docker run -p 8000:8000 ai-document-analyzer-backend
```

## 📁 Project Structure

```
ai-document-analyzer/
├── backend/
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── core/          # Configuration and settings
│   │   ├── models/        # Database models
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Helper functions
│   │   └── main.py        # FastAPI application
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript definitions
│   │   ├── utils/         # Frontend utilities
│   │   └── App.tsx        # Main application component
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
GEMINI_API_KEY=your_google_gemini_api_key
DATABASE_URL=postgresql://user:password@localhost/document_analyzer
SECRET_KEY=your_secret_key_here
UPLOAD_FOLDER=./uploads
MAX_FILE_SIZE=10485760  # 10MB
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WEBSOCKET_URL=ws://localhost:8000/ws
```

## 📊 API Documentation

Once running, access the interactive API documentation at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Key Endpoints:
- `POST /api/upload` - Upload and process documents
- `POST /api/analyze` - Perform AI analysis
- `POST /api/chat` - Interactive Q&A about documents
- `GET /api/history` - Retrieve analysis history
- `GET /api/export/{format}` - Export analysis results

## 🎯 Usage Example

### 1. Upload Document
Drag and drop or click to upload a document (PDF, DOCX, etc.)

### 2. View Auto-Generated Insights
The dashboard immediately displays:
- Document summary
- Key topics and entities
- Sentiment analysis
- Word count and reading time

### 3. Ask Questions
Use the chat interface to ask natural language questions:
- "What are the main recommendations?"
- "Who are the key people mentioned?"
- "Summarize the conclusions section"

### 4. Export Results
Download a comprehensive report including:
- Executive summary
- Detailed analysis
- Visual charts and graphs
- Raw data in JSON format

## 🔒 Security Features

- API key management with environment variables
- File type validation and virus scanning
- Input sanitization and rate limiting
- Secure file storage with access controls
- CORS configuration for production deployment

## 📈 Performance Optimizations

- **Document Chunking**: Efficient processing of large files
- **Response Caching**: Reduced API calls for repeated queries
- **Lazy Loading**: On-demand loading of document sections
- **WebSocket Support**: Real-time analysis updates
- **Background Processing**: Non-blocking file analysis

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest --cov=app tests/

# Frontend tests
cd frontend
npm test
```

## 🚢 Deployment

### Vercel (Frontend)
```bash
npm run build
vercel --prod
```

### Railway/Render (Backend)
```bash
# Deploy with Docker
railway up
# or
render.yaml deployment
```

### Docker Compose (Full Stack)
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**GitHub Repository**: [https://github.com/yourusername/ai-document-analyzer](https://github.com/yourusername/ai-document-analyzer)

*Note: Replace placeholder URLs and email with your actual project links.*
