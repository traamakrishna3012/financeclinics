"""
FinanceClinics - Flask Application Factory
Financial Advisory for Healthcare Providers
"""

import os
import logging
from logging.handlers import RotatingFileHandler
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from .config import Config
from .extensions import db, migrate, mail, csrf

jwt = JWTManager()
limiter = Limiter(key_func=get_remote_address, default_limits=["200 per day", "50 per hour"])


def create_app(config_class=Config):
    """Application factory pattern"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)
    jwt.init_app(app)
    limiter.init_app(app)
    
    # CORS configuration
    CORS(app, resources={
        r"/api/*": {
            "origins": app.config.get('CORS_ORIGINS', '*'),
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "X-CSRF-Token"],
            "supports_credentials": True
        }
    })
    
    # CSRF protection for non-API routes
    csrf.init_app(app)
    
    # Register blueprints
    from .api.auth import auth_bp
    from .api.pages import pages_bp
    from .api.services import services_bp
    from .api.blog import blog_bp
    from .api.leads import leads_bp
    from .api.admin import admin_bp
    from .api.settings import settings_bp
    
    # Exempt all API blueprints from CSRF (using JWT instead)
    csrf.exempt(auth_bp)
    csrf.exempt(pages_bp)
    csrf.exempt(services_bp)
    csrf.exempt(blog_bp)
    csrf.exempt(leads_bp)
    csrf.exempt(admin_bp)
    csrf.exempt(settings_bp)
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(pages_bp, url_prefix='/api/pages')
    app.register_blueprint(services_bp, url_prefix='/api/services')
    app.register_blueprint(blog_bp, url_prefix='/api/blog')
    app.register_blueprint(leads_bp, url_prefix='/api/contact')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(settings_bp, url_prefix='/api/settings')
    
    # Setup logging
    if not app.debug and not app.testing:
        if not os.path.exists('logs'):
            os.mkdir('logs')
        file_handler = RotatingFileHandler(
            'logs/financeclinics.log',
            maxBytes=10240000,
            backupCount=10
        )
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('FinanceClinics startup')
    
    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy', 'message': 'FinanceClinics API is running'}
    
    # Error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return {'error': 'Resource not found'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        app.logger.error(f'Server Error: {error}')
        return {'error': 'Internal server error'}, 500
    
    @app.errorhandler(429)
    def ratelimit_handler(e):
        return {'error': 'Rate limit exceeded. Please try again later.'}, 429
    
    return app
