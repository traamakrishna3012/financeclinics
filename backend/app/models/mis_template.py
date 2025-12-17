"""
FinanceClinics - MIS Template Models

Defines templates for MIS (columns schema) and stored rows of data for each template.
"""
from datetime import datetime
from ..extensions import db
import json


class MISTemplate(db.Model):
    __tablename__ = 'mis_templates'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    # Store columns as JSON list: [{"key":"col1","label":"Column 1"}, ...]
    columns = db.Column(db.Text, default='[]')
    created_by = db.Column(db.Integer)
    is_public = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        try:
            cols = json.loads(self.columns or '[]')
        except Exception:
            cols = []
        return {
            'id': self.id,
            'name': self.name,
            'columns': cols,
            'created_by': self.created_by,
            'is_public': self.is_public,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }


class MISData(db.Model):
    __tablename__ = 'mis_data'

    id = db.Column(db.Integer, primary_key=True)
    template_id = db.Column(db.Integer, db.ForeignKey('mis_templates.id'), nullable=False, index=True)
    # Store row as JSON object mapping column key -> value
    data = db.Column(db.Text, default='{}')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    template = db.relationship('MISTemplate', backref=db.backref('rows', lazy='dynamic'))

    def to_dict(self):
        try:
            d = json.loads(self.data or '{}')
        except Exception:
            d = {}
        return {
            'id': self.id,
            'template_id': self.template_id,
            'data': d,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
