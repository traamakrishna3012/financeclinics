"""
WSGI Entry Point for BigRock cPanel Python App Deployment
FinanceClinics - Financial Advisory for Healthcare Providers
"""

import sys
import os

# Add the application directory to the Python path
# This ensures imports work correctly on BigRock cPanel
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, CURRENT_DIR)

# Import the Flask application
from app import app as application

# BigRock/cPanel requires the WSGI callable to be named 'application'
# The above import handles this requirement

if __name__ == '__main__':
    application.run()
