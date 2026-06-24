Here are all the files you need to copy and paste:

---

## 1. Client .gitignore

**File: `client/.gitignore`**

```gitignore
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Dependencies
node_modules
.pnp
.pnp.js

# Build output
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.*.local

# Testing
coverage

# Cache
.cache
.parcel-cache
```

---

## 2. Server .gitignore

**File: `server/.gitignore`**

```gitignore
# Dependencies
node_modules

# Environment variables
.env

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage

# Misc
.DS_Store
*.pem

# Debug
.pnpm-debug.log*

# Local env files
.env.local
.env.development.local
.env.test.local
.env.production.local
```

---

## 3. Root .gitignore

**File: `.gitignore`** (in project root)

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Environment variables
.env
.env.local
.env.*.local

# Build outputs
dist/
build/
coverage/

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea/
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS files
Thumbs.db

# Database
*.dump
```

---

## 4. Complete README.md

**File: `README.md`**

```markdown
# 🔐 Password Strength Analyzer

A full-stack web application that analyzes password strength in real-time, generates strong passwords, and tracks analysis history. Built with the PERN stack (MySQL, Express, React, Node.js).

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)
![Express](https://img.shields.io/badge/Express-4.18.2-000000?logo=express)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)

---

## ✨ Features

- **🔍 Real-time Password Analysis** — Instant strength scoring with visual meter
- **📊 Strength Score (0-100)** — Based on length, character variety, patterns, and entropy
- **🎯 Rules Checklist** — Live validation of password requirements
- **⏱️ Crack Time Estimation** — How long it would take to brute-force
- **💡 Smart Suggestions** — Floating dropdown with one-click password improvements
- **🔑 Strong Password Generator** — Generate secure passwords (Easy to Say, Easy to Read, All Characters, Memorable)
- **📜 Analysis History** — Track all analyzed passwords with reveal functionality
- **🔒 Secure Storage** — Passwords encrypted with AES-256 before storage
- **📱 Responsive Design** — Works on desktop and mobile

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite + Tailwind CSS + Axios |
| **Backend** | Node.js + Express + MySQL2 |
| **Database** | MySQL 8.0 |
| **Security** | Helmet, CORS, Rate Limiting, AES-256 Encryption |

---

## 📁 Project Structure

```
password-strength-analyzer/
├── client/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── PasswordInput.jsx
│   │   │   ├── StrengthMeter.jsx
│   │   │   ├── RulesChecklist.jsx
│   │   │   ├── Recommendations.jsx
│   │   │   ├── PasswordGenerator.jsx
│   │   │   ├── LastPasswordTracker.jsx
│   │   │   ├── FloatingSuggestions.jsx
│   │   │   ├── AnalysisHistory.jsx
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── History.jsx
│   │   ├── services/
│   │   │   └── api.js         # API integration with Axios
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/                    # Node.js Backend (Express)
│   ├── config/
│   │   └── db.js              # MySQL connection pool
│   ├── controllers/
│   │   └── analysisController.js
│   ├── routes/
│   │   └── analysisRoutes.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── passwordAnalyzer.js
│   │   └── passwordGenerator.js
│   ├── server.js
│   └── package.json
│
├── database/
│   └── schema.sql             # MySQL database schema
│
├── .env.example               # Environment variables template
└── README.md                  # This file
```

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

| Software | Version | Download Link |
|----------|---------|---------------|
| **Node.js** | 18.x or higher | [nodejs.org](https://nodejs.org/) |
| **MySQL** | 8.0 or higher | [mysql.com](https://dev.mysql.com/downloads/installer/) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |

> **Windows Users:** Use **Command Prompt (CMD)** or **Git Bash** instead of PowerShell for npm commands to avoid execution policy errors.

---

## 📦 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/AnikShahrier/password-strength-analyzer.git
cd password-strength-analyzer
```

### Step 2: Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

---

## 🗄️ Database Setup

### Step 1: Start MySQL Server

Ensure your MySQL server is running:

- **Windows:** Services → MySQL80 → Start
- **macOS:** `brew services start mysql`
- **Linux:** `sudo systemctl start mysql`

### Step 2: Create Database

Open MySQL command line:

```bash
# Windows
mysql -u root -p

# macOS/Linux
sudo mysql -u root -p
```

Run these SQL commands:

```sql
CREATE DATABASE IF NOT EXISTS password_analyzer
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

EXIT;
```

### Step 3: Run Schema

```bash
# Windows
mysql -u root -p password_analyzer < database\schema.sql

# macOS/Linux
mysql -u root -p password_analyzer < database/schema.sql
```

Or from inside MySQL:

```sql
USE password_analyzer;
SOURCE C:/Users/YOUR_NAME/OneDrive/Desktop/PSA/database/schema.sql;
```

### Step 4: Verify Setup

```sql
USE password_analyzer;
SHOW TABLES;
DESCRIBE analysis_history;
EXIT;
```

---

## ⚙️ Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `server/` directory:

```bash
cd server
copy .env.example .env   # Windows
cp .env.example .env      # macOS/Linux
```

Edit `server/.env`:

```env
NODE_ENV=development
PORT=5000

# MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=password_analyzer
DB_USER=root
DB_PASSWORD=your_mysql_password

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

> Replace `your_mysql_password` with your actual MySQL root password.

### Frontend Environment Variables

Create a `.env` file in the `client/` directory:

```bash
cd ../client
copy .env.example .env   # Windows
cp .env.example .env      # macOS/Linux
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## ▶️ Running the Application

You need **two terminal windows** running simultaneously.

### Terminal 1: Start Backend Server

```bash
cd server
npm start
```

Server will start on `http://localhost:5000`

You should see:
```
🚀 Server running on port 5000
📊 Environment: development
✅ MySQL connected successfully
```

### Terminal 2: Start Frontend Development Server

```bash
cd client
npm run dev
```

Frontend will start on `http://localhost:5173`

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 3: Open in Browser

Navigate to: **http://localhost:5173**

---

## 🛠️ Troubleshooting

### Common Issues

#### 1. `mysql` command not found

**Solution:** Add MySQL to your system PATH or use the full path:

```bash
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

#### 2. `Access denied for user 'root'@'localhost'`

**Solution:** Wrong password in `server/.env`. Test with:

```bash
mysql -u root -p
```

Enter the password that works, then update `server/.env`.

#### 3. `Database schema mismatch` error

**Solution:** Run the schema script again:

```bash
mysql -u root -p password_analyzer < database/schema.sql
```

#### 4. `npm install` fails in PowerShell

**Solution:** Use Command Prompt (CMD) instead, or run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then retry.

#### 5. Port 5000 already in use

**Solution:** Change the port in `server/.env`:

```env
PORT=5001
```

And update `client/.env`:

```env
VITE_API_URL=http://localhost:5001/api
```

#### 6. Frontend shows "Failed to fetch" or CORS error

**Solution:** Ensure both backend and frontend are running, and `CLIENT_URL` in `server/.env` matches your frontend URL.

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analysis/analyze` | Analyze a password |
| `GET` | `/api/analysis/generate` | Generate strong password options |
| `GET` | `/api/analysis/last` | Get last analyzed password info |
| `GET` | `/api/analysis/history` | Get analysis history (paginated) |
| `GET` | `/api/analysis/stats` | Get statistics |
| `GET` | `/api/analysis/:id` | Get specific analysis by ID |
| `POST` | `/api/analysis/:id/reveal` | Reveal stored password |
| `GET` | `/api/health` | Health check |

---

## 🧪 Testing Password Analysis

Try these example passwords to see different strength levels:

| Password | Expected Score | Strength |
|----------|---------------|----------|
| `123` | 0-10 | Very Weak |
| `password` | 10-20 | Very Weak |
| `Password1` | 30-40 | Weak |
| `MyP@ssw0rd` | 60-70 | Good |
| `Tr0ub4dor&3` | 70-80 | Strong |
| `correct-horse-battery-staple!47` | 90-100 | Very Strong |

---

## 🚀 Deployment

### Build for Production

```bash
cd client
npm run build
```

This creates a `dist/` folder with optimized static files.

### Deploy Backend

Use PM2 for process management:

```bash
npm install -g pm2
cd server
pm2 start server.js --name "password-api"
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
DB_HOST=your-production-db-host
DB_USER=your-db-user
DB_PASSWORD=your-secure-password
DB_NAME=password_analyzer
CLIENT_URL=https://your-frontend-domain.com
```

---

## 🔒 Security Notes

- Passwords are **never stored in plain text**
- Stored passwords are encrypted with **AES-256** before saving to database
- Only **SHA-256 hashes** are used for comparison
- Rate limiting prevents brute-force API attacks
- Helmet.js adds security headers
- CORS is configured for specific origins only

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Anik Shahrier Oishik** — [GitHub](https://github.com/AnikShahrier)

Project Link: [https://github.com/AnikShahrier/password-strength-analyzer](https://github.com/AnikShahrier/password-strength-analyzer)

---

## 🙏 Acknowledgments

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express.js](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [Node.js](https://nodejs.org/)
```

---

## 5. .env.example Files

**File: `server/.env.example`**

```env
NODE_ENV=development
PORT=5000

# MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=password_analyzer
DB_USER=root
DB_PASSWORD=your_mysql_password

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

**File: `client/.env.example`**

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Push to GitHub

```bash
cd FolderName

# Add all files
git add .

# Commit
git commit -m "Initial commit: Password Strength Analyzer with MySQL"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/password-strength-analyzer.git

# Push
git branch -M main
git push -u origin main
```

