"""
FinanceClinics - Security Utilities
"""

import bleach
from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt


# Allowed HTML tags and attributes for content sanitization
ALLOWED_TAGS = [
    'p', 'br', 'strong', 'em', 'u', 's', 'strike',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'div', 'span',
    'hr'
]

ALLOWED_ATTRIBUTES = {
    '*': ['class', 'id', 'style'],
    'a': ['href', 'title', 'target', 'rel'],
    'img': ['src', 'alt', 'title', 'width', 'height'],
    'th': ['colspan', 'rowspan'],
    'td': ['colspan', 'rowspan'],
}

ALLOWED_STYLES = [
    'color', 'background-color', 'font-size', 'font-weight',
    'text-align', 'text-decoration', 'margin', 'padding',
    'border', 'width', 'height'
]


def sanitize_html(content):
    """Sanitize HTML content to prevent XSS"""
    if not content:
        return content
    
    return bleach.clean(
        content,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        strip=True
    )


def admin_required():
    """Decorator to require admin role"""
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims.get('role') != 'admin':
                return jsonify({'error': 'Admin access required'}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper


def validate_content_type(content_types=['application/json']):
    """Decorator to validate request content type"""
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            if request.content_type not in content_types:
                return jsonify({'error': 'Invalid content type'}), 415
            return fn(*args, **kwargs)
        return decorator
    return wrapper


def generate_csrf_token():
    """Generate a CSRF token"""
    import secrets
    return secrets.token_urlsafe(32)


def validate_recaptcha(token):
    """Validate Google reCAPTCHA token"""
    import requests
    from flask import current_app
    
    secret_key = current_app.config.get('RECAPTCHA_SECRET_KEY')
    if not secret_key:
        return True  # Skip validation if not configured
    
    try:
        response = requests.post(
            'https://www.google.com/recaptcha/api/siteverify',
            data={
                'secret': secret_key,
                'response': token
            },
            timeout=10
        )
        result = response.json()
        return result.get('success', False)
    except Exception:
        return False
