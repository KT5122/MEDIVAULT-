"""
Security utilities for MediVault
"""
import hashlib
import secrets
from functools import wraps
from flask import request, jsonify, current_app
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from models import User

def generate_secure_filename(original_filename):
    """Generate a secure filename using hash"""
    timestamp = str(int(time.time()))
    random_string = secrets.token_hex(8)
    file_extension = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else ''
    
    # Create hash from original filename and timestamp
    hash_input = f"{original_filename}{timestamp}{random_string}".encode('utf-8')
    file_hash = hashlib.sha256(hash_input).hexdigest()[:16]
    
    return f"{file_hash}.{file_extension}" if file_extension else file_hash

def require_user_type(user_type):
    """Decorator to require specific user type"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            if user.user_type != user_type:
                return jsonify({'error': f'Access denied. {user_type.title()}s only.'}), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def log_user_action(action, resource_type=None, resource_id=None, details=None):
    """Log user action for audit trail"""
    try:
        from models import AuditLog, db
        
        user_id = get_jwt_identity()
        ip_address = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
        user_agent = request.headers.get('User-Agent', '')
        
        audit_log = AuditLog(
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details,
            ip_address=ip_address,
            user_agent=user_agent[:500]  # Truncate long user agents
        )
        
        db.session.add(audit_log)
        db.session.commit()
        
    except Exception as e:
        current_app.logger.error(f"Failed to log user action: {str(e)}")

def validate_file_access(user, report):
    """Validate if user has access to the report file"""
    if user.user_type == 'patient':
        return report.patient_id == user.id
    elif user.user_type == 'doctor':
        return report.doctor_id == user.id
    return False
