from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from app.models import User

def require_module(module_name, active_only=True):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if not user:
                return jsonify({'error': 'User not found'}), 404
            if not user.has_module(module_name, active_only):
                return jsonify({'error': f'Module "{module_name}" required'}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator

def require_official_designation(designation_type):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if not user or not user.official_designation:
                return jsonify({'error': 'Not an official'}), 403
            if user.official_designation.designation_type != designation_type:
                return jsonify({'error': f'Designation {designation_type} required'}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator

def require_admin():
    """
    Admin: either has 'admin' module OR is president/executive_secretary.
    """
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if not user:
                return jsonify({'error': 'User not found'}), 404
            # Check for 'admin' module (active)
            if user.has_module('admin', active_only=True):
                return f(*args, **kwargs)
            # Or official designation president/executive_secretary
            if user.official_designation and user.official_designation.designation_type in ['president', 'executive_secretary']:
                return f(*args, **kwargs)
            return jsonify({'error': 'Admin privileges required'}), 403
        return decorated
    return decorator