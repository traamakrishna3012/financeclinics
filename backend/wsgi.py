"""
WSGI Entry Point for FinanceClinics Backend
Compatible with BigRock cPanel Python App Deployment
"""

import sys
import os

# Get the directory where this wsgi.py file is located
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

# Change to the backend directory to ensure relative paths work
os.chdir(CURRENT_DIR)

# Remove parent directory if it exists in path to avoid importing root app.py
PARENT_DIR = os.path.dirname(CURRENT_DIR)
if PARENT_DIR in sys.path:
    sys.path.remove(PARENT_DIR)
# Ensure backend directory is first in path
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

# Load environment variables
from dotenv import load_dotenv
load_dotenv(os.path.join(CURRENT_DIR, '.env'))
# Also load from parent .env if exists
load_dotenv(os.path.join(PARENT_DIR, '.env'))

# Import the Flask application from backend's app package
from app import create_app

# Create the application instance
application = create_app()

# BigRock/cPanel requires the WSGI callable to be named 'application'
if __name__ == '__main__':
    application.run(debug=True, host='0.0.0.0', port=5000)
