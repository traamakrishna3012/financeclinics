"""
FinanceClinics - Settings API
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ..models.setting import Setting
from ..extensions import db

settings_bp = Blueprint('settings', __name__)


@settings_bp.route('/public', methods=['GET'])
def get_public_settings():
    """Get public site settings"""
    public_keys = [
        'site_name', 'site_tagline', 'site_description',
        'contact_email', 'contact_phone', 'contact_address',
        'social_facebook', 'social_twitter', 'social_linkedin',
        'google_analytics_id', 'footer_text'
    ]
    
    settings = Setting.query.filter(Setting.key.in_(public_keys)).all()
    
    return jsonify({
        'settings': {s.key: Setting.get_value(s.key) for s in settings}
    }), 200


@settings_bp.route('/admin', methods=['GET'])
@jwt_required()
def get_all_settings():
    """Get all settings for admin"""
    settings = Setting.query.order_by(Setting.category, Setting.key).all()
    
    # Group by category
    grouped = {}
    for setting in settings:
        if setting.category not in grouped:
            grouped[setting.category] = []
        grouped[setting.category].append(setting.to_dict())
    
    return jsonify({
        'settings': grouped,
        'all': [s.to_dict() for s in settings]
    }), 200


@settings_bp.route('/admin', methods=['POST'])
@jwt_required()
def update_settings():
    """Update multiple settings"""
    data = request.get_json()
    
    if not data or 'settings' not in data:
        return jsonify({'error': 'No settings provided'}), 400
    
    for key, value in data['settings'].items():
        setting = Setting.query.filter_by(key=key).first()
        
        if setting:
            if setting.type == 'json' and not isinstance(value, str):
                import json
                setting.value = json.dumps(value)
            else:
                setting.value = str(value) if value is not None else ''
        else:
            # Create new setting
            new_setting = Setting(
                key=key,
                value=str(value) if value is not None else '',
                type='string',
                category='general'
            )
            db.session.add(new_setting)
    
    db.session.commit()
    
    return jsonify({'message': 'Settings updated'}), 200


@settings_bp.route('/admin/<key>', methods=['PUT'])
@jwt_required()
def update_setting(key):
    """Update single setting"""
    data = request.get_json()
    
    if 'value' not in data:
        return jsonify({'error': 'Value is required'}), 400
    
    setting = Setting.query.filter_by(key=key).first()
    
    if setting:
        if setting.type == 'json' and not isinstance(data['value'], str):
            import json
            setting.value = json.dumps(data['value'])
        else:
            setting.value = str(data['value']) if data['value'] is not None else ''
        
        if 'type' in data:
            setting.type = data['type']
        if 'category' in data:
            setting.category = data['category']
        if 'description' in data:
            setting.description = data['description']
    else:
        setting = Setting(
            key=key,
            value=str(data['value']) if data['value'] is not None else '',
            type=data.get('type', 'string'),
            category=data.get('category', 'general'),
            description=data.get('description')
        )
        db.session.add(setting)
    
    db.session.commit()
    
    return jsonify({'message': 'Setting updated', 'setting': setting.to_dict()}), 200


@settings_bp.route('/admin/<key>', methods=['DELETE'])
@jwt_required()
def delete_setting(key):
    """Delete setting"""
    setting = Setting.query.filter_by(key=key).first_or_404()
    
    db.session.delete(setting)
    db.session.commit()
    
    return jsonify({'message': 'Setting deleted'}), 200
