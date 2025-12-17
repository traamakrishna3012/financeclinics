"""
FinanceClinics - BlogPost Model
"""

from datetime import datetime
from slugify import slugify
from ..extensions import db


class BlogPost(db.Model):
    """Blog post model"""
    __tablename__ = 'blog_posts'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(300), nullable=False)
    slug = db.Column(db.String(300), unique=True, nullable=False, index=True)
    excerpt = db.Column(db.String(500))
    content = db.Column(db.Text)
    featured_image = db.Column(db.String(500))
    category = db.Column(db.String(100))
    tags = db.Column(db.JSON)  # List of tags
    meta_title = db.Column(db.String(200))
    meta_description = db.Column(db.String(500))
    is_published = db.Column(db.Boolean, default=False)
    published_at = db.Column(db.DateTime)
    views = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    author = db.relationship('User', backref='blog_posts')
    
    def __init__(self, **kwargs):
        super(BlogPost, self).__init__(**kwargs)
        if not self.slug and self.title:
            self.slug = slugify(self.title)
    
    def to_dict(self, include_content=True):
        """Serialize blog post to dictionary"""
        data = {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'excerpt': self.excerpt,
            'featured_image': self.featured_image,
            'category': self.category,
            'tags': self.tags or [],
            'meta_title': self.meta_title,
            'meta_description': self.meta_description,
            'is_published': self.is_published,
            'published_at': self.published_at.isoformat() if self.published_at else None,
            'views': self.views,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'author': self.author.name if self.author else None,
        }
        if include_content:
            data['content'] = self.content
        return data
    
    def __repr__(self):
        return f'<BlogPost {self.title}>'
