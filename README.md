# FinanceClinics - Healthcare Financial Advisory

A comprehensive financial consulting website for healthcare providers built with Flask (Python) backend and React TypeScript frontend.

## Tech Stack

### Backend
- **Framework**: Flask 2.3.3
- **Database**: MySQL 5.7+ / MariaDB 10.3+
- **Authentication**: Flask-JWT-Extended with bcrypt
- **ORM**: Flask-SQLAlchemy
- **Email**: Flask-Mail
- **Rate Limiting**: Flask-Limiter
- **CORS**: Flask-CORS

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 3.3
- **Routing**: React Router DOM 6
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **UI Components**: Headless UI, Heroicons

## 📁 Project Structure

```
finanfnm/
├── backend/
│   └── app/
│       ├── __init__.py          # App factory
│       ├── config.py            # Configuration
│       ├── extensions.py        # Flask extensions
│       ├── api/                  # API blueprints
│       │   ├── auth.py
│       │   ├── pages.py
│       │   ├── services.py
│       │   ├── blog.py
│       │   ├── leads.py
│       │   ├── admin.py
│       │   └── settings.py
│       ├── models/               # SQLAlchemy models
│       │   ├── user.py
│       │   ├── page.py
│       │   ├── service.py
│       │   ├── blog_post.py
│       │   ├── lead.py
│       │   └── setting.py
│       └── utils/                # Utilities
│           ├── email.py
│           └── security.py
├── frontend/
│   └── src/
│       ├── api.ts               # API client
│       ├── App.tsx              # Main app
│       ├── main.tsx             # Entry point
│       ├── context/             # React contexts
│       ├── components/          # Reusable components
│       ├── layouts/             # Page layouts
│       └── pages/               # Page components
│           └── admin/           # Admin pages
├── db/
│   ├── schema.sql               # Database schema
│   └── seed.sql                 # Seed data
├── docker/                      # Docker files
├── nginx/                       # Nginx config
└── requirements.txt             # Python dependencies
```

## 🚀 Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- MySQL 5.7+ or MariaDB 10.3+

### Backend Setup

1. **Create a virtual environment:**
   ```bash
   cd backend
   python -m venv venv
   ```

2. **Activate the virtual environment:**
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create .env file:**
   ```bash
   cp .env.example .env
   # Edit .env with your database and email settings
   ```

5. **Set up database:**
   ```bash
   mysql -u root -p < db/schema.sql
   mysql -u root -p financeclinics < db/seed.sql
   ```

6. **Run the development server:**
   ```bash
   flask run --debug
   ```

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Create .env file:**
   ```bash
   echo "VITE_API_URL=http://localhost:5000/api" > .env
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## Environment Variables

### Backend (.env)
```env
FLASK_ENV=development
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
DATABASE_URL=mysql+pymysql://user:password@localhost/financeclinics
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@financeclinics.com
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Admin Access

Default admin credentials (change after first login):
- **Email**: admin@financeclinics.com
- **Password**: AdminPassword123!

## 🌐 Deployment

### Docker Deployment

```bash
# Copy environment file
cp .env.example .env
# Edit .env with production values

# Start services
docker-compose up -d
```

### BigRock cPanel Deployment

#### 1. Prepare Files for Upload
Build the frontend:
```bash
cd frontend
npm run build
```

#### 2. Access cPanel
1. Log in to your BigRock cPanel account
2. Navigate to **"Setup Python App"** under Software section

#### 3. Create Python Application
1. Click **"Create Application"**
2. Configure the application:
   - **Python version:** Select 3.9+ (recommended: 3.11)
   - **Application root:** `financeclinics`
   - **Application URL:** Leave empty for root domain
   - **Application startup file:** `wsgi.py`
   - **Application Entry point:** `application`
3. Click **"Create"**

#### 4. Upload Files
1. Upload backend files to application root
2. Upload frontend `dist/` contents to `public_html`
3. Set up MySQL database via cPanel

#### 5. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 6. Restart Application

### Production Checklist
- [ ] Set `FLASK_ENV=production`
- [ ] Use strong SECRET_KEY and JWT_SECRET_KEY
- [ ] Configure HTTPS/SSL
- [ ] Set up proper CORS origins
- [ ] Change default admin password
- [ ] Configure email settings
- [ ] Set up database backups

## 🎨 Features

- **Responsive Design:** Mobile-first approach using TailwindCSS
- **Modern UI:** Clean, professional healthcare finance theme
- **Admin Dashboard:** Full content management system
- **Lead Management:** Contact form with CSV export
- **Blog CMS:** Create and manage blog posts
- **SEO Optimized:** Meta tags, semantic HTML, fast loading
- **Rate Limiting:** Protection against spam submissions

## 📱 Public Pages

1. **Home** - Hero section, value highlights, featured services
2. **About** - Company info, mission, team
3. **Services** - Service listing and detail pages
4. **Blog** - Blog posts with categories and tags
5. **Contact** - Contact form with validation

## 🔧 Admin Features

- Dashboard with stats and recent activity
- Lead management with status tracking and CSV export
- Services CRUD with SEO settings
- Pages CRUD with HTML editor
- Blog CRUD with tags and featured images
- Site settings management

## 📄 License

© 2025 FinanceClinics. All rights reserved.

## 📞 Support

For deployment issues or questions, contact your hosting provider or refer to BigRock's documentation.
