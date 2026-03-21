# 🚀 Item Manager — Full-Stack REST API Application

A production-ready full-stack web application for managing items with complete CRUD functionality. Built with **Python Flask** backend REST API and a modern **React + Vite** frontend, featuring real-time search, dark mode, and smooth animations.

## 📸 Features

- ✅ **Full CRUD Operations** - Create, read, update, and delete items
- ✅ **Real-time Search** - Live filtering by name and description
- ✅ **Dark/Light Mode** - Theme toggle with localStorage persistence
- ✅ **Responsive Design** - Mobile-first approach (1→2→3 column grid)
- ✅ **Smooth Animations** - Framer Motion animations for all interactions
- ✅ **Form Validation** - Client and server-side validation
- ✅ **Toast Notifications** - Success, error, and info messages
- ✅ **Category Badges** - Color-coded categories for organization
- ✅ **Relative Timestamps** - "2 days ago" style timestamps
- ✅ **Delete Confirmation** - Modal confirmation before deletion
- ✅ **Loading States** - Spinners and disabled states during operations

## 🛠️ Tech Stack

### Backend
- **Python 3.10+**
- **Flask** - Web framework
- **Flask-SQLAlchemy** - ORM for database operations
- **Flask-CORS** - Cross-Origin Resource Sharing
- **SQLite** - Development database

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS v3** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **Lucide React** - Icon library

## 📋 Prerequisites

Before you begin, ensure you have installed:
- **Python 3.10+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **Git** (optional, for version control)

You can verify installations:
```bash
python --version
node --version
npm --version
```

## 📁 Project Structure

```
rest-api-project/
│
├── backend/
│   ├── app.py                  # Flask main app with all routes
│   ├── models.py               # SQLAlchemy Item model
│   ├── database.py             # DB initialization (SQLite)
│   ├── requirements.txt         # Python dependencies
│   ├── seed.py                 # Sample data seeder
│   └── items.db                # SQLite database (auto-created)
│
├── frontend/
│   ├── public/
│   │   └── index.html          # HTML entry point
│   ├── src/
│   │   ├── components/
│   │   │   ├── ItemCard.jsx    # Item display card
│   │   │   ├── ItemForm.jsx    # Add/Edit form
│   │   │   ├── SearchBar.jsx   # Search component
│   │   │   ├── Toast.jsx       # Notifications
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── hooks/
│   │   │   ├── useItems.js     # CRUD logic hook
│   │   │   └── useTheme.js     # Theme management hook
│   │   ├── services/
│   │   │   └── api.js          # Axios API client
│   │   ├── App.jsx             # Root component
│   │   ├── main.jsx            # React entry point
│   │   └── index.css           # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── node_modules/           # Installed dependencies
│
└── README.md
```

## 🚀 Quick Start

### 1. Clone or Download the Project

```bash
# If using git
git clone <repository-url>
cd rest-api-project

# Or extract the downloaded folder
cd rest-api-project
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Seed database with sample data
python seed.py

# Start Flask development server
python app.py
```

The backend will start at **http://127.0.0.1:5000**

### 3. Frontend Setup (in a new terminal)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

The frontend will start at **http://localhost:5173**

### 4. Open in Browser

Visit [http://localhost:5173](http://localhost:5173) to see the application.

## 📊 API Endpoints Reference

### Items Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/items` | Retrieve all items | - |
| `GET` | `/items/<id>` | Get a single item by ID | - |
| `POST` | `/items` | Create a new item | `{ "name": "...", "description": "...", "category": "...", "price": 0.0 }` |
| `PUT` | `/items/<id>` | Update an existing item | `{ "name": "...", "description": "...", "category": "...", "price": 0.0 }` |
| `DELETE` | `/items/<id>` | Delete an item | - |
| `GET` | `/items/search?q=query` | Search items by name/description | - |
| `GET` | `/health` | Health check endpoint | - |

### Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error code",
  "message": "Human-readable error message"
}
```

## 🗂️ Item Model

Each item has the following fields:

```python
{
  "id": 1,                                    # Auto-incremented integer
  "name": "Item Name",                        # Required, max 100 chars
  "description": "Item description",          # Optional, max 500 chars
  "category": "Electronics",                  # Optional, default "General"
  "price": 29.99,                            # Optional, default 0.0, must be >= 0
  "created_at": "2024-01-15T10:30:00",      # ISO 8601 timestamp
  "updated_at": "2024-01-15T10:30:00"       # ISO 8601 timestamp
}
```

### Available Categories

- General
- Electronics
- Clothing
- Food
- Books
- Other

## 🎨 Design System

### Color Palette

| Element | Light Mode | Dark Mode |
|---------|-----------|----------|
| **Background** | #f8fafc | #0f172a |
| **Card** | #ffffff | #1e293b |
| **Text Primary** | #0f172a | #f1f5f9 |
| **Text Secondary** | #64748b | #94a3b8 |
| **Accent** | #6366f1 | #818cf8 |
| **Success** | #22c55e | #22c55e |
| **Error** | #ef4444 | #ef4444 |

### Typography

- **Headings:** Plus Jakarta Sans (700 weight)
- **Body:** DM Sans (400-700 weights)

## 🛠️ Development

### Backend Development

Run Flask with debug mode for auto-reload:
```bash
python app.py
```

The server runs on `http://127.0.0.1:5000` with debug mode enabled by default.

### Frontend Development

While running `npm run dev`, Vite provides:
- Hot Module Replacement (HMR) for instant updates
- Source maps for debugging

### Building for Production

**Backend:** No build needed, just run `python app.py`

**Frontend:**
```bash
cd frontend
npm run build
npm run preview  # Preview production build locally
```

## 🔧 Configuration

### Backend Configuration (app.py)

- **Database:** SQLite at `backend/items.db`
- **Debug Mode:** Enabled by default
- **CORS:** Enabled for `http://localhost:5173`
- **Port:** 5000
- **Host:** 127.0.0.1

### Frontend Configuration (vite.config.js)

- **Dev Server Port:** 5173
- **API Proxy:** `/api` routes to `http://127.0.0.1:5000`

## 📝 Usage Examples

### Create an Item (curl)

```bash
curl -X POST http://127.0.0.1:5000/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Earbuds",
    "description": "High-quality wireless earbuds with noise cancellation",
    "category": "Electronics",
    "price": 79.99
  }'
```

### Search Items

```bash
curl http://127.0.0.1:5000/items/search?q=earbuds
```

### Update an Item

```bash
curl -X PUT http://127.0.0.1:5000/items/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 69.99
  }'
```

### Delete an Item

```bash
curl -X DELETE http://127.0.0.1:5000/items/1
```

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
```bash
# Clear old database and try again
rm backend/items.db
python app.py
```

**Port 5000 already in use:**
Modify `app.py` port number in the `if __name__ == '__main__':` section

**Frontend can't connect to backend:**
- Ensure backend is running on `http://127.0.0.1:5000`
- Check CORS is enabled in `app.py`
- Check browser console for error details

**Dependencies issues:**
```bash
# Backend
cd backend
pip install --upgrade pip
pip install -r requirements.txt

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📚 Learning Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [SQLAlchemy](https://www.sqlalchemy.org/)

## 🤝 Contributing

Contributions are welcome! To contribute:

1. **Fork the repository** (if applicable)
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Make your changes** with clear commit messages
4. **Push to the branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request** with a detailed description

### Contribution Guidelines

- Follow PEP 8 for Python code
- Use ESLint for JavaScript/React code
- Add comments for complex logic
- Update README if adding features
- Test changes before submitting

## 📄 License

This project is open source and available under the MIT License.

## ✅ Verification Checklist

Run through this checklist to ensure everything is working:

- [ ] Backend server starts without errors
- [ ] Frontend builds and loads at localhost:5173
- [ ] Can add a new item through the form
- [ ] Newly added item appears in the grid
- [ ] Can search/filter items
- [ ] Can edit an existing item
- [ ] Can delete an item (with confirmation)
- [ ] Dark/light mode toggle works
- [ ] Theme persists after refresh
- [ ] Toast notifications show for all operations
- [ ] All category badges display correctly
- [ ] Relative timestamps show correctly
- [ ] API endpoints respond with correct JSON structure
- [ ] Responsive design works on mobile (< 640px)

## 🎯 Future Enhancements

Potential improvements for future versions:

- [ ] User authentication and authorization
- [ ] Item images/attachments support
- [ ] Pagination and infinite scroll
- [ ] Advanced filtering and sorting
- [ ] Item favorites/bookmarks
- [ ] Comments and ratings
- [ ] Export to CSV/PDF
- [ ] Database migrations with Alembic
- [ ] Unit and integration tests
- [ ] Docker containerization
- [ ] Deployment to cloud (AWS, Heroku, Vercel)
- [ ] Real-time updates with WebSockets

## 📞 Support

If you encounter issues:

1. **Check the troubleshooting section** above
2. **Review error messages** in terminal/browser console
3. **Verify all prerequisites** are installed
4. **Clear cache and reload** (`Ctrl+Shift+Delete`)
5. **Try a fresh setup** if nothing works

---

**Built with ❤️ for developers**

Happy coding! 🎉
