"""
FinanceClinics - Blog API
"""

from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from slugify import slugify
from ..models.blogpost import BlogPost
from ..extensions import db
from ..utils.security import sanitize_html

blog_bp = Blueprint('blog', __name__)


@blog_bp.route('', methods=['GET'])
def get_posts():
    """Get all published blog posts with pagination"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    category = request.args.get('category')
    
    query = BlogPost.query.filter_by(is_published=True)
    
    if category:
        query = query.filter_by(category=category)
    
    pagination = query.order_by(BlogPost.published_at.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'posts': [p.to_dict(include_content=False) for p in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page,
        'per_page': per_page,
        'has_next': pagination.has_next,
        'has_prev': pagination.has_prev
    }), 200


@blog_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all blog categories"""
    categories = db.session.query(BlogPost.category)\
        .filter(BlogPost.is_published == True, BlogPost.category.isnot(None))\
        .distinct()\
        .all()
    return jsonify({
        'categories': [c[0] for c in categories if c[0]]
    }), 200


@blog_bp.route('/recent', methods=['GET'])
def get_recent_posts():
    """Get recent blog posts"""
    limit = request.args.get('limit', 5, type=int)
    posts = BlogPost.query.filter_by(is_published=True)\
        .order_by(BlogPost.published_at.desc())\
        .limit(limit)\
        .all()
    return jsonify({
        'posts': [p.to_dict(include_content=False) for p in posts]
    }), 200


@blog_bp.route('/<slug>', methods=['GET'])
def get_post(slug):
    """Get blog post by slug"""
    post = BlogPost.query.filter_by(slug=slug, is_published=True).first()
    
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    
    # Increment views
    post.views += 1
    db.session.commit()
    
    return jsonify({'post': post.to_dict()}), 200


# Admin endpoints
@blog_bp.route('/admin', methods=['GET'])
@jwt_required()
def admin_get_posts():
    """Get all blog posts for admin"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    pagination = BlogPost.query.order_by(BlogPost.created_at.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'posts': [p.to_dict(include_content=False) for p in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    }), 200


@blog_bp.route('/admin/<int:post_id>', methods=['GET'])
@jwt_required()
def admin_get_post(post_id):
    """Get blog post by ID for admin"""
    post = BlogPost.query.get_or_404(post_id)
    return jsonify({'post': post.to_dict()}), 200


@blog_bp.route('/admin', methods=['POST'])
@jwt_required()
def create_post():
    """Create new blog post"""
    data = request.get_json()
    user_id = get_jwt_identity()
    
    if not data or not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400
    
    slug = data.get('slug') or slugify(data['title'])
    
    if BlogPost.query.filter_by(slug=slug).first():
        return jsonify({'error': 'Post with this slug already exists'}), 400
    
    post = BlogPost(
        title=data['title'],
        slug=slug,
        excerpt=data.get('excerpt'),
        content=sanitize_html(data.get('content', '')),
        featured_image=data.get('featured_image'),
        category=data.get('category'),
        tags=data.get('tags', []),
        meta_title=data.get('meta_title'),
        meta_description=data.get('meta_description'),
        is_published=data.get('is_published', False),
        published_at=datetime.utcnow() if data.get('is_published') else None,
        author_id=user_id
    )
    
    db.session.add(post)
    db.session.commit()
    
    return jsonify({'message': 'Post created', 'post': post.to_dict()}), 201


@blog_bp.route('/admin/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_post(post_id):
    """Update existing blog post"""
    post = BlogPost.query.get_or_404(post_id)
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    new_slug = data.get('slug')
    if new_slug and new_slug != post.slug:
        if BlogPost.query.filter_by(slug=new_slug).first():
            return jsonify({'error': 'Post with this slug already exists'}), 400
        post.slug = new_slug
    
    if 'title' in data:
        post.title = data['title']
    if 'excerpt' in data:
        post.excerpt = data['excerpt']
    if 'content' in data:
        post.content = sanitize_html(data['content'])
    if 'featured_image' in data:
        post.featured_image = data['featured_image']
    if 'category' in data:
        post.category = data['category']
    if 'tags' in data:
        post.tags = data['tags']
    if 'meta_title' in data:
        post.meta_title = data['meta_title']
    if 'meta_description' in data:
        post.meta_description = data['meta_description']
    if 'is_published' in data:
        was_published = post.is_published
        post.is_published = data['is_published']
        if not was_published and data['is_published']:
            post.published_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({'message': 'Post updated', 'post': post.to_dict()}), 200


@blog_bp.route('/admin/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    """Delete blog post"""
    post = BlogPost.query.get_or_404(post_id)
    
    db.session.delete(post)
    db.session.commit()
    
    return jsonify({'message': 'Post deleted'}), 200
