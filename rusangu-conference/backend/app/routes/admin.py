from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, Module, UserModule, District, Department, Report, OfficialDesignation
from app.utils.decorators import require_admin
from sqlalchemy import func

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
@require_admin()
def get_stats():
    total_users = User.query.count()
    total_reports = Report.query.count()
    total_districts = District.query.count()
    total_modules = Module.query.count()
    total_officials = OfficialDesignation.query.count()
    # Reports by status
    reports_by_status = db.session.query(Report.status, func.count(Report.id)).group_by(Report.status).all()
    status_counts = {status: count for status, count in reports_by_status}
    return jsonify({
        'total_users': total_users,
        'total_reports': total_reports,
        'total_districts': total_districts,
        'total_modules': total_modules,
        'total_officials': total_officials,
        'reports_by_status': status_counts
    }), 200

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@require_admin()
def admin_list_users():
    # list all users with their modules, designation, etc.
    users = User.query.all()
    result = []
    for u in users:
        result.append({
            'id': u.id,
            'email': u.email,
            'name': f"{u.first_name} {u.last_name}",
            'guest_type': u.guest_type,
            'district': u.district.name if u.district else None,
            'is_active': u.is_active,
            'modules': u.get_modules(),
            'designation': u.official_designation.designation_type if u.official_designation else None,
        })
    return jsonify(result), 200

@admin_bp.route('/users/<int:user_id>/toggle-active', methods=['POST'])
@jwt_required()
@require_admin()
def toggle_user_active(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    user.is_active = not user.is_active
    db.session.commit()
    return jsonify({'message': f'User active status toggled to {user.is_active}'}), 200

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
@require_admin()
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    data = request.get_json()
    # Allow updating basic fields
    if 'first_name' in data:
        user.first_name = data['first_name']
    if 'last_name' in data:
        user.last_name = data['last_name']
    if 'email' in data:
        user.email = data['email']
    if 'phone' in data:
        user.phone = data['phone']
    if 'diet_preference' in data:
        user.diet_preference = data['diet_preference']
    if 'tshirt_size' in data:
        user.tshirt_size = data['tshirt_size']
    if 'tshirt_color' in data:
        user.tshirt_color = data['tshirt_color']
    if 'district_id' in data:
        user.district_id = data['district_id']
    if 'guest_type' in data:
        user.guest_type = data['guest_type']
    if 'entity' in data:
        user.entity = data['entity']
    db.session.commit()
    return jsonify({'message': 'User updated'}), 200