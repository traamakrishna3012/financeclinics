"""
FinanceClinics - Pages API
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from slugify import slugify
from ..models.page import Page
from ..extensions import db
from ..utils.security import sanitize_html

pages_bp = Blueprint('pages', __name__)


@pages_bp.route('', methods=['GET'])
def get_pages():
    """Get all published pages"""
    pages = Page.query.filter_by(is_published=True)\
        .order_by(Page.sort_order.asc())\
        .all()
    return jsonify({
        'pages': [p.to_dict(include_content=False) for p in pages]
    }), 200


@pages_bp.route('/<slug>', methods=['GET'])
def get_page(slug):
    """Get page by slug"""
    page = Page.query.filter_by(slug=slug, is_published=True).first()
    
    if not page:
        return jsonify({'error': 'Page not found'}), 404
    
    return jsonify({'page': page.to_dict()}), 200


# Admin endpoints
@pages_bp.route('/admin', methods=['GET'])
@jwt_required()
def admin_get_pages():
    """Get all pages for admin"""
    pages = Page.query.order_by(Page.sort_order.asc()).all()
    return jsonify({
        'pages': [p.to_dict(include_content=False) for p in pages]
    }), 200


@pages_bp.route('/admin/<int:page_id>', methods=['GET'])
@jwt_required()
def admin_get_page(page_id):
    """Get page by ID for admin"""
    page = Page.query.get_or_404(page_id)
    return jsonify({'page': page.to_dict()}), 200


@pages_bp.route('/admin', methods=['POST'])
@jwt_required()
def create_page():
    """Create new page"""
    data = request.get_json()
    user_id = get_jwt_identity()
    
    if not data or not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400
    
    # Generate slug
    slug = data.get('slug') or slugify(data['title'])
    
    # Check for duplicate slug
    if Page.query.filter_by(slug=slug).first():
        return jsonify({'error': 'Page with this slug already exists'}), 400
    
    page = Page(
        title=data['title'],
        slug=slug,
        content=sanitize_html(data.get('content', '')),
        meta_title=data.get('meta_title'),
        meta_description=data.get('meta_description'),
        meta_keywords=data.get('meta_keywords'),
        featured_image=data.get('featured_image'),
        is_published=data.get('is_published', False),
        sort_order=data.get('sort_order', 0),
        template=data.get('template', 'default'),
        created_by=user_id
    )
    
    db.session.add(page)
    db.session.commit()
    
    return jsonify({'message': 'Page created', 'page': page.to_dict()}), 201


@pages_bp.route('/admin/<int:page_id>', methods=['PUT'])
@jwt_required()
def update_page(page_id):
    """Update existing page"""
    page = Page.query.get_or_404(page_id)
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Check slug uniqueness if changed
    new_slug = data.get('slug')
    if new_slug and new_slug != page.slug:
        if Page.query.filter_by(slug=new_slug).first():
            return jsonify({'error': 'Page with this slug already exists'}), 400
        page.slug = new_slug
    
    # Update fields
    if 'title' in data:
        page.title = data['title']
    if 'content' in data:
        page.content = sanitize_html(data['content'])
    if 'meta_title' in data:
        page.meta_title = data['meta_title']
    if 'meta_description' in data:
        page.meta_description = data['meta_description']
    if 'meta_keywords' in data:
        page.meta_keywords = data['meta_keywords']
    if 'featured_image' in data:
        page.featured_image = data['featured_image']
    if 'is_published' in data:
        page.is_published = data['is_published']
    if 'sort_order' in data:
        page.sort_order = data['sort_order']
    if 'template' in data:
        page.template = data['template']
    
    db.session.commit()
    
    return jsonify({'message': 'Page updated', 'page': page.to_dict()}), 200


@pages_bp.route('/admin/<int:page_id>', methods=['DELETE'])
@jwt_required()
def delete_page(page_id):
    """Delete page"""
    page = Page.query.get_or_404(page_id)
    
    db.session.delete(page)
    db.session.commit()
    
    return jsonify({'message': 'Page deleted'}), 200
