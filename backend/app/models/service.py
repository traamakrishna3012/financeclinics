"""
FinanceClinics - Service Model
"""

from datetime import datetime
from slugify import slugify
from ..extensions import db


class Service(db.Model):
    """Service offering model"""
    __tablename__ = 'services'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(200), unique=True, nullable=False, index=True)
    short_description = db.Column(db.String(500))
    description = db.Column(db.Text)
    icon = db.Column(db.String(100))
    featured_image = db.Column(db.String(500))
    features = db.Column(db.JSON)  # List of features/benefits
    meta_title = db.Column(db.String(200))
    meta_description = db.Column(db.String(500))
    is_featured = db.Column(db.Boolean, default=False)
    is_published = db.Column(db.Boolean, default=True)
    sort_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __init__(self, **kwargs):
        super(Service, self).__init__(**kwargs)
        if not self.slug and self.title:
            self.slug = slugify(self.title)
    
    def to_dict(self, include_description=True):
        """Serialize service to dictionary"""
        data = {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'short_description': self.short_description,
            'icon': self.icon,
            'featured_image': self.featured_image,
            'features': self.features or [],
            'meta_title': self.meta_title,
            'meta_description': self.meta_description,
            'is_featured': self.is_featured,
            'is_published': self.is_published,
            'sort_order': self.sort_order,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_description:
            data['description'] = self.description
        return data
    
    def __repr__(self):
        return f'<Service {self.title}>'
