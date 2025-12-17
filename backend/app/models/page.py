"""
FinanceClinics - Page Model
"""

from datetime import datetime
from slugify import slugify
from ..extensions import db


class Page(db.Model):
    """CMS Page model"""
    __tablename__ = 'pages'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(200), unique=True, nullable=False, index=True)
    content = db.Column(db.Text)
    meta_title = db.Column(db.String(200))
    meta_description = db.Column(db.String(500))
    meta_keywords = db.Column(db.String(500))
    featured_image = db.Column(db.String(500))
    is_published = db.Column(db.Boolean, default=True)
    sort_order = db.Column(db.Integer, default=0)
    template = db.Column(db.String(50), default='default')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    author = db.relationship('User', backref='pages')
    
    def __init__(self, **kwargs):
        super(Page, self).__init__(**kwargs)
        if not self.slug and self.title:
            self.slug = slugify(self.title)
    
    def to_dict(self, include_content=True):
        """Serialize page to dictionary"""
        data = {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'meta_title': self.meta_title,
            'meta_description': self.meta_description,
            'meta_keywords': self.meta_keywords,
            'featured_image': self.featured_image,
            'is_published': self.is_published,
            'sort_order': self.sort_order,
            'template': self.template,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_content:
            data['content'] = self.content
        return data
    
    def __repr__(self):
        return f'<Page {self.title}>'
