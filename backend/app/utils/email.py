"""
FinanceClinics - Email Utilities
"""

from flask import current_app, render_template_string
from flask_mail import Message
from ..extensions import mail


def send_email(subject, recipients, body, html=None):
    """Send email helper"""
    try:
        msg = Message(
            subject=subject,
            recipients=recipients if isinstance(recipients, list) else [recipients],
            body=body,
            html=html
        )
        mail.send(msg)
        return True
    except Exception as e:
        current_app.logger.error(f'Failed to send email: {e}')
        return False


def send_lead_notification(lead):
    """Send notification email to admin about new lead"""
    admin_email = current_app.config.get('ADMIN_EMAIL')
    
    if not admin_email:
        current_app.logger.warning('No admin email configured for lead notifications')
        return False
    
    subject = f'New Contact Form Submission - {lead.name}'
    
    body = f"""
New contact form submission received!

Name: {lead.name}
Email: {lead.email}
Phone: {lead.phone or 'Not provided'}
Organization: {lead.organization or 'Not provided'}
Preferred Contact Time: {lead.preferred_contact_time or 'Not specified'}
Service Interest: {lead.service_interest or 'Not specified'}

Message:
{lead.message}

---
Submitted at: {lead.created_at.strftime('%Y-%m-%d %H:%M:%S')}
IP Address: {lead.ip_address or 'Unknown'}
"""
    
    html = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 20px; border-radius: 8px 8px 0 0; }}
        .content {{ background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }}
        .field {{ margin-bottom: 15px; }}
        .label {{ font-weight: bold; color: #374151; }}
        .value {{ color: #1f2937; }}
        .message-box {{ background: white; padding: 15px; border-left: 4px solid #2563eb; margin-top: 10px; }}
        .footer {{ background: #1f2937; color: #9ca3af; padding: 15px; font-size: 12px; border-radius: 0 0 8px 8px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin:0;">📧 New Contact Form Submission</h2>
        </div>
        <div class="content">
            <div class="field">
                <span class="label">Name:</span>
                <span class="value">{lead.name}</span>
            </div>
            <div class="field">
                <span class="label">Email:</span>
                <span class="value"><a href="mailto:{lead.email}">{lead.email}</a></span>
            </div>
            <div class="field">
                <span class="label">Phone:</span>
                <span class="value">{lead.phone or 'Not provided'}</span>
            </div>
            <div class="field">
                <span class="label">Organization:</span>
                <span class="value">{lead.organization or 'Not provided'}</span>
            </div>
            <div class="field">
                <span class="label">Preferred Contact Time:</span>
                <span class="value">{lead.preferred_contact_time or 'Not specified'}</span>
            </div>
            <div class="field">
                <span class="label">Service Interest:</span>
                <span class="value">{lead.service_interest or 'Not specified'}</span>
            </div>
            <div class="field">
                <span class="label">Message:</span>
                <div class="message-box">{lead.message}</div>
            </div>
        </div>
        <div class="footer">
            Submitted at: {lead.created_at.strftime('%Y-%m-%d %H:%M:%S')} | IP: {lead.ip_address or 'Unknown'}
        </div>
    </div>
</body>
</html>
"""
    
    return send_email(subject, admin_email, body, html)


def send_lead_acknowledgment(lead):
    """Send acknowledgment email to user who submitted the form"""
    site_name = current_app.config.get('SITE_NAME', 'FinanceClinics')
    
    subject = f'Thank you for contacting {site_name}'
    
    body = f"""
Dear {lead.name},

Thank you for reaching out to {site_name}!

We have received your inquiry and our team will review it shortly. You can expect to hear from us within 1-2 business days.

Here's a summary of what you submitted:

Organization: {lead.organization or 'Not provided'}
Message: {lead.message[:200]}{'...' if len(lead.message) > 200 else ''}

If you have any urgent questions, please don't hesitate to call us.

Best regards,
The {site_name} Team
"""
    
    html = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }}
        .content {{ background: white; padding: 30px; border: 1px solid #e5e7eb; }}
        .highlight {{ background: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0; }}
        .footer {{ background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin:0;font-size:24px;">Thank You!</h1>
            <p style="margin:10px 0 0;opacity:0.9;">We've received your message</p>
        </div>
        <div class="content">
            <p>Dear {lead.name},</p>
            <p>Thank you for reaching out to <strong>{site_name}</strong>! We have received your inquiry and our team will review it shortly.</p>
            
            <div class="highlight">
                <strong>What happens next?</strong>
                <p style="margin:10px 0 0;">Our team will review your message and get back to you within 1-2 business days.</p>
            </div>
            
            <p>If you have any urgent questions, please don't hesitate to contact us directly.</p>
            
            <p>Best regards,<br><strong>The {site_name} Team</strong></p>
        </div>
        <div class="footer">
            <p>This email was sent because you submitted a contact form on our website.</p>
            <p>© {site_name}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
"""
    
    return send_email(subject, lead.email, body, html)
