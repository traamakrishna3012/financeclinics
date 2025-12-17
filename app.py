"""
FinanceClinics - Flask Application
Redirects to React Frontend
"""

from flask import Flask, redirect
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')

# Frontend URL (React app)
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

# ============================================
# REDIRECT ALL ROUTES TO FRONTEND
# ============================================

@app.route('/')
def home():
    """Redirect to React frontend"""
    return redirect(FRONTEND_URL)

@app.route('/services')
@app.route('/services/<path:slug>')
def services(slug=None):
    """Redirect to React frontend services"""
    if slug:
        return redirect(f"{FRONTEND_URL}/services/{slug}")
    return redirect(f"{FRONTEND_URL}/services")

@app.route('/about')
def about():
    """Redirect to React frontend about page"""
    return redirect(f"{FRONTEND_URL}/about")

@app.route('/blog')
@app.route('/blog/<path:slug>')
def blog(slug=None):
    """Redirect to React frontend blog"""
    if slug:
        return redirect(f"{FRONTEND_URL}/blog/{slug}")
    return redirect(f"{FRONTEND_URL}/blog")

@app.route('/contact')
def contact():
    """Redirect to React frontend contact page"""
    return redirect(f"{FRONTEND_URL}/contact")

@app.route('/login')
def login():
    """Redirect to React frontend login page"""
    return redirect(f"{FRONTEND_URL}/login")

@app.route('/signup')
def signup():
    """Redirect to React frontend signup page"""
    return redirect(f"{FRONTEND_URL}/signup")

@app.route('/admin')
@app.route('/admin/<path:subpath>')
def admin(subpath=None):
    """Redirect to React frontend admin"""
    if subpath:
        return redirect(f"{FRONTEND_URL}/admin/{subpath}")
    return redirect(f"{FRONTEND_URL}/admin")

# ============================================
# CATCH-ALL REDIRECT
# ============================================

@app.route('/<path:path>')
def catch_all(path):
    """Redirect any other path to React frontend"""
    return redirect(f"{FRONTEND_URL}/{path}")

# ============================================
# MAIN ENTRY
# ============================================

if __name__ == '__main__':
    print(f"Redirecting all routes to frontend: {FRONTEND_URL}")
    # Using port 5001 to avoid conflict with backend API on port 5000
    app.run(debug=True, host='0.0.0.0', port=5001)
