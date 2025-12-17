"""
FinanceClinics - Leads API (Contact Form)
"""

import re
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from ..models.lead import Lead
from ..extensions import db
from ..utils.email import send_lead_notification, send_lead_acknowledgment
from .. import limiter

leads_bp = Blueprint('leads', __name__)


def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_phone(phone):
    """Validate phone format (basic)"""
    if not phone:
        return True
    # Remove common formatting characters
    cleaned = re.sub(r'[\s\-\(\)\.]', '', phone)
    return len(cleaned) >= 10 and cleaned.lstrip('+').isdigit()


@leads_bp.route('', methods=['POST'])
@limiter.limit("5 per 10 minutes")
def submit_contact():
    """Submit contact form / lead"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Required fields
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    message = data.get('message', '').strip()
    
    # Validate required fields
    if not name:
        return jsonify({'error': 'Name is required'}), 400
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    if not validate_email(email):
        return jsonify({'error': 'Invalid email format'}), 400
    if not message:
        return jsonify({'error': 'Message is required'}), 400
    if len(message) < 10:
        return jsonify({'error': 'Message must be at least 10 characters'}), 400
    
    # Optional fields
    phone = data.get('phone', '').strip()
    if phone and not validate_phone(phone):
        return jsonify({'error': 'Invalid phone number format'}), 400
    
    organization = data.get('organization', '').strip()
    preferred_contact_time = data.get('preferred_contact_time', '').strip()
    service_interest = data.get('service_interest', '').strip()
    privacy_accepted = data.get('privacy_accepted', False)
    
    if not privacy_accepted:
        return jsonify({'error': 'You must accept the privacy policy'}), 400
    
    # Create lead
    lead = Lead(
        name=name,
        email=email,
        phone=phone if phone else None,
        organization=organization if organization else None,
        message=message,
        preferred_contact_time=preferred_contact_time if preferred_contact_time else None,
        service_interest=service_interest if service_interest else None,
        privacy_accepted=privacy_accepted,
        ip_address=request.remote_addr,
        user_agent=request.user_agent.string[:500] if request.user_agent else None,
        source='contact_form'
    )
    
    db.session.add(lead)
    db.session.commit()
    
    # Send email notifications
    try:
        send_lead_notification(lead)
        send_lead_acknowledgment(lead)
        lead.email_sent = True
        db.session.commit()
    except Exception as e:
        current_app.logger.error(f'Failed to send lead emails: {e}')
    
    current_app.logger.info(f'New lead submitted: {email}')
    
    return jsonify({
        'message': 'Thank you for contacting us! We will get back to you soon.',
        'lead_id': lead.id
    }), 201


# Admin endpoints
@leads_bp.route('/admin', methods=['GET'])
@jwt_required()
def get_leads():
    """Get all leads for admin"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    status = request.args.get('status')
    
    query = Lead.query
    
    if status:
        query = query.filter_by(status=status)
    
    pagination = query.order_by(Lead.created_at.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'leads': [l.to_dict() for l in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    }), 200


@leads_bp.route('/admin/<int:lead_id>', methods=['GET'])
@jwt_required()
def get_lead(lead_id):
    """Get lead by ID"""
    lead = Lead.query.get_or_404(lead_id)
    return jsonify({'lead': lead.to_dict()}), 200


@leads_bp.route('/admin/<int:lead_id>', methods=['PUT'])
@jwt_required()
def update_lead(lead_id):
    """Update lead status and notes"""
    lead = Lead.query.get_or_404(lead_id)
    data = request.get_json()
    
    if 'status' in data:
        if data['status'] not in ['new', 'contacted', 'qualified', 'converted', 'closed']:
            return jsonify({'error': 'Invalid status'}), 400
        lead.status = data['status']
    
    if 'notes' in data:
        lead.notes = data['notes']
    
    db.session.commit()
    
    return jsonify({'message': 'Lead updated', 'lead': lead.to_dict()}), 200


@leads_bp.route('/admin/<int:lead_id>', methods=['DELETE'])
@jwt_required()
def delete_lead(lead_id):
    """Delete lead"""
    lead = Lead.query.get_or_404(lead_id)
    
    db.session.delete(lead)
    db.session.commit()
    
    return jsonify({'message': 'Lead deleted'}), 200


@leads_bp.route('/admin/export', methods=['GET'])
@jwt_required()
def export_leads():
    """Export leads to CSV"""
    import csv
    import io
    from flask import Response
    
    status = request.args.get('status')
    
    query = Lead.query
    if status:
        query = query.filter_by(status=status)
    
    leads = query.order_by(Lead.created_at.desc()).all()
    
    # Create CSV
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(Lead.csv_headers())
    
    for lead in leads:
        writer.writerow(lead.to_csv_row())
    
    output.seek(0)
    
    return Response(
        output.getvalue(),
        mimetype='text/csv',
        headers={'Content-Disposition': 'attachment; filename=leads_export.csv'}
    )


@leads_bp.route('/admin/stats', methods=['GET'])
@jwt_required()
def get_lead_stats():
    """Get lead statistics"""
    from sqlalchemy import func
    from datetime import datetime, timedelta
    
    # Total leads
    total = Lead.query.count()
    
    # Leads by status
    by_status = db.session.query(
        Lead.status, func.count(Lead.id)
    ).group_by(Lead.status).all()
    
    # Recent leads (last 7 days)
    week_ago = datetime.utcnow() - timedelta(days=7)
    recent = Lead.query.filter(Lead.created_at >= week_ago).count()
    
    # Leads this month
    month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    this_month = Lead.query.filter(Lead.created_at >= month_start).count()
    
    return jsonify({
        'total': total,
        'by_status': {status: count for status, count in by_status},
        'recent_7_days': recent,
        'this_month': this_month
    }), 200
