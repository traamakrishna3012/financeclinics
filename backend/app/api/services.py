"""
FinanceClinics - Services API
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from slugify import slugify
from ..models.service import Service
from ..extensions import db
from ..utils.security import sanitize_html

services_bp = Blueprint('services', __name__)


@services_bp.route('', methods=['GET'])
def get_services():
    """Get all published services"""
    services = Service.query.filter_by(is_published=True)\
        .order_by(Service.sort_order.asc())\
        .all()
    return jsonify({
        'services': [s.to_dict(include_description=False) for s in services]
    }), 200


@services_bp.route('/featured', methods=['GET'])
def get_featured_services():
    """Get featured services"""
    services = Service.query.filter_by(is_published=True, is_featured=True)\
        .order_by(Service.sort_order.asc())\
        .all()
    return jsonify({
        'services': [s.to_dict(include_description=False) for s in services]
    }), 200


@services_bp.route('/<slug>', methods=['GET'])
def get_service(slug):
    """Get service by slug"""
    service = Service.query.filter_by(slug=slug, is_published=True).first()
    
    if not service:
        return jsonify({'error': 'Service not found'}), 404
    
    return jsonify({'service': service.to_dict()}), 200


# Admin endpoints
@services_bp.route('/admin', methods=['GET'])
@jwt_required()
def admin_get_services():
    """Get all services for admin"""
    services = Service.query.order_by(Service.sort_order.asc()).all()
    return jsonify({
        'services': [s.to_dict() for s in services]
    }), 200


@services_bp.route('/admin/<int:service_id>', methods=['GET'])
@jwt_required()
def admin_get_service(service_id):
    """Get service by ID for admin"""
    service = Service.query.get_or_404(service_id)
    return jsonify({'service': service.to_dict()}), 200


@services_bp.route('/admin', methods=['POST'])
@jwt_required()
def create_service():
    """Create new service"""
    data = request.get_json()
    
    if not data or not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400
    
    slug = data.get('slug') or slugify(data['title'])
    
    if Service.query.filter_by(slug=slug).first():
        return jsonify({'error': 'Service with this slug already exists'}), 400
    
    service = Service(
        title=data['title'],
        slug=slug,
        short_description=data.get('short_description'),
        description=sanitize_html(data.get('description', '')),
        icon=data.get('icon'),
        featured_image=data.get('featured_image'),
        features=data.get('features', []),
        meta_title=data.get('meta_title'),
        meta_description=data.get('meta_description'),
        is_featured=data.get('is_featured', False),
        is_published=data.get('is_published', False),
        sort_order=data.get('sort_order', 0)
    )
    
    db.session.add(service)
    db.session.commit()
    
    return jsonify({'message': 'Service created', 'service': service.to_dict()}), 201


@services_bp.route('/admin/<int:service_id>', methods=['PUT'])
@jwt_required()
def update_service(service_id):
    """Update existing service"""
    service = Service.query.get_or_404(service_id)
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    new_slug = data.get('slug')
    if new_slug and new_slug != service.slug:
        if Service.query.filter_by(slug=new_slug).first():
            return jsonify({'error': 'Service with this slug already exists'}), 400
        service.slug = new_slug
    
    if 'title' in data:
        service.title = data['title']
    if 'short_description' in data:
        service.short_description = data['short_description']
    if 'description' in data:
        service.description = sanitize_html(data['description'])
    if 'icon' in data:
        service.icon = data['icon']
    if 'featured_image' in data:
        service.featured_image = data['featured_image']
    if 'features' in data:
        service.features = data['features']
    if 'meta_title' in data:
        service.meta_title = data['meta_title']
    if 'meta_description' in data:
        service.meta_description = data['meta_description']
    if 'is_featured' in data:
        service.is_featured = data['is_featured']
    if 'is_published' in data:
        service.is_published = data['is_published']
    if 'sort_order' in data:
        service.sort_order = data['sort_order']
    
    db.session.commit()
    
    return jsonify({'message': 'Service updated', 'service': service.to_dict()}), 200


@services_bp.route('/admin/<int:service_id>', methods=['DELETE'])
@jwt_required()
def delete_service(service_id):
    """Delete service"""
    service = Service.query.get_or_404(service_id)
    
    db.session.delete(service)
    db.session.commit()
    
    return jsonify({'message': 'Service deleted'}), 200
