"""
FinanceClinics - Lead Model
"""

from datetime import datetime
from ..extensions import db


class Lead(db.Model):
    """Contact form lead model"""
    __tablename__ = 'leads'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False, index=True)
    phone = db.Column(db.String(30))
    organization = db.Column(db.String(200))
    message = db.Column(db.Text, nullable=False)
    preferred_contact_time = db.Column(db.String(100))
    service_interest = db.Column(db.String(100))
    source = db.Column(db.String(50), default='contact_form')
    status = db.Column(db.String(20), default='new')  # new, contacted, qualified, converted, closed
    notes = db.Column(db.Text)
    ip_address = db.Column(db.String(50))
    user_agent = db.Column(db.String(500))
    privacy_accepted = db.Column(db.Boolean, default=True)
    email_sent = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Serialize lead to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'organization': self.organization,
            'message': self.message,
            'preferred_contact_time': self.preferred_contact_time,
            'service_interest': self.service_interest,
            'source': self.source,
            'status': self.status,
            'notes': self.notes,
            'privacy_accepted': self.privacy_accepted,
            'email_sent': self.email_sent,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
    
    def to_csv_row(self):
        """Return data suitable for CSV export"""
        return [
            self.id,
            self.name,
            self.email,
            self.phone or '',
            self.organization or '',
            self.message,
            self.preferred_contact_time or '',
            self.service_interest or '',
            self.status,
            self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else '',
        ]
    
    @staticmethod
    def csv_headers():
        """Return CSV headers"""
        return ['ID', 'Name', 'Email', 'Phone', 'Organization', 'Message', 
                'Preferred Contact Time', 'Service Interest', 'Status', 'Created At']
    
    def __repr__(self):
        return f'<Lead {self.email}>'
