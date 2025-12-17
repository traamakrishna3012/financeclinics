"""
FinanceClinics - Settings Model
"""

from datetime import datetime
from ..extensions import db


class Setting(db.Model):
    """Site settings model"""
    __tablename__ = 'settings'
    
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), unique=True, nullable=False, index=True)
    value = db.Column(db.Text)
    type = db.Column(db.String(20), default='string')  # string, json, boolean, number
    category = db.Column(db.String(50), default='general')
    description = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    @staticmethod
    def get_value(key, default=None):
        """Get setting value by key"""
        setting = Setting.query.filter_by(key=key).first()
        if not setting:
            return default
        
        if setting.type == 'boolean':
            return setting.value.lower() in ('true', '1', 'yes')
        elif setting.type == 'number':
            try:
                return int(setting.value) if '.' not in setting.value else float(setting.value)
            except ValueError:
                return default
        elif setting.type == 'json':
            import json
            try:
                return json.loads(setting.value)
            except json.JSONDecodeError:
                return default
        return setting.value
    
    @staticmethod
    def set_value(key, value, type='string', category='general', description=None):
        """Set setting value by key"""
        import json
        setting = Setting.query.filter_by(key=key).first()
        
        if setting:
            if type == 'json' and not isinstance(value, str):
                setting.value = json.dumps(value)
            else:
                setting.value = str(value)
            setting.type = type
            if category:
                setting.category = category
            if description:
                setting.description = description
        else:
            if type == 'json' and not isinstance(value, str):
                value = json.dumps(value)
            setting = Setting(
                key=key, 
                value=str(value), 
                type=type, 
                category=category,
                description=description
            )
            db.session.add(setting)
        
        db.session.commit()
        return setting
    
    def to_dict(self):
        """Serialize setting to dictionary"""
        return {
            'id': self.id,
            'key': self.key,
            'value': self.value,
            'type': self.type,
            'category': self.category,
            'description': self.description,
        }
    
    def __repr__(self):
        return f'<Setting {self.key}>'
