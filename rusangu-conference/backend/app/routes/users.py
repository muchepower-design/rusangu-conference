from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, Module, UserModule, District, OfficialDesignation, Department, Report
from app.utils.decorators import require_module, require_admin
from datetime import datetime

users_bp = Blueprint('users', __name__)

# Also list users for admin
@users_bp.route('/', methods=['GET'])
@jwt_required()
@require_admin()
def list_users():
    # Support optional guest_type filtering
    guest_type = request.args.get('guest_type')
    query = User.query
    if guest_type:
        query = query.filter_by(guest_type=guest_type)
    users = query.all()
    return jsonify([{
        'id': u.id,
        'email': u.email,
        'name': f"{u.first_name} {u.last_name}",
        'guest_type': u.guest_type,
        'district': u.district.name if u.district else None,
        'is_active': u.is_active,
        'modules': u.get_modules()
    } for u in users]), 200


@users_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    # Debug: print the Authorization header
    from flask import request
    print("🔍 Authorization header:", request.headers.get('Authorization'))
    user_id_str = get_jwt_identity()
    print("🔍 User ID from token (string):", user_id_str)
    try:
        user_id = int(user_id_str)
    except ValueError:
        return jsonify({'error': 'Invalid user ID in token'}), 401
    print("🔍 Converted User ID:", user_id)
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({
        'id': user.id,
        'email': user.email,
        'first_name': user.first_name,
        'middle_name': user.middle_name,
        'last_name': user.last_name,
        'gender': user.gender,
        'phone': user.phone,
        'diet_preference': user.diet_preference,
        'tshirt_size': user.tshirt_size,
        'tshirt_color': user.tshirt_color,
        'district': user.district.name if user.district else None,
        'district_id': user.district_id,
        'guest_type': user.guest_type,
        'entity': user.entity,
        'modules': user.get_modules(),
        'is_official': bool(user.official_designation),
        'designation': user.official_designation.designation_type if user.official_designation else None,
        'department_ids': [od.department_id for od in user.official_designation.official_departments] if user.official_designation else [],
    }), 200

@users_bp.route('/<int:user_id>/modules', methods=['POST'])
@jwt_required()
@require_admin()
def assign_module(user_id):
    data = request.get_json()
    module_name = data.get('module_name')
    active = data.get('active', True)

    module = Module.query.filter_by(name=module_name).first()
    if not module:
        return jsonify({'error': 'Module not found'}), 404
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    existing = UserModule.query.filter_by(user_id=user_id, module_id=module.id).first()
    if existing:
        existing.is_active = active
    else:
        um = UserModule(user_id=user_id, module_id=module.id, is_active=active)
        db.session.add(um)
    db.session.commit()
    return jsonify({'message': 'Module assigned/updated'}), 200

@users_bp.route('/<int:user_id>/modules', methods=['DELETE'])
@jwt_required()
@require_admin()
def remove_module(user_id):
    data = request.get_json()
    module_name = data.get('module_name')
    module = Module.query.filter_by(name=module_name).first()
    if not module:
        return jsonify({'error': 'Module not found'}), 404
    UserModule.query.filter_by(user_id=user_id, module_id=module.id).delete()
    db.session.commit()
    return jsonify({'message': 'Module removed'}), 200

@users_bp.route('/<int:user_id>/approve-delegate', methods=['POST'])
@jwt_required()
def approve_delegate(user_id):
    # Only district pastor or admin can approve
    current_id_str = get_jwt_identity()
    try:
        current_id = int(current_id_str)
    except ValueError:
        return jsonify({'error': 'Invalid user ID in token'}), 401
    current = User.query.get(current_id)
    if not current:
        return jsonify({'error': 'User not found'}), 404
    if not current.official_designation:
        return jsonify({'error': 'Only officials can approve'}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    if user.guest_type != 'delegate':
        return jsonify({'error': 'User is not a delegate'}), 400
    
    # Check permission
    if current.official_designation.designation_type == 'district_pastor':
        if current.official_designation.district_id != user.district_id:
            return jsonify({'error': 'Not authorized for this district'}), 403
    elif current.official_designation.designation_type not in ['president', 'executive_secretary']:
        return jsonify({'error': 'Only district pastor, president, or executive secretary can approve'}), 403

    # Find session_meetings_delegate module
    mod = Module.query.filter_by(name='session_meetings_delegate').first()
    if not mod:
        return jsonify({'error': 'Module not found'}), 500
    um = UserModule.query.filter_by(user_id=user_id, module_id=mod.id).first()
    if not um:
        return jsonify({'error': 'Delegate module not assigned'}), 400
    um.is_active = True
    um.approved_by = current.id
    um.approved_at = datetime.utcnow()
    db.session.commit()
    return jsonify({'message': 'Delegate approved'}), 200


@users_bp.route('/districts', methods=['POST'])
@jwt_required()
@require_admin()
def create_district():
    data = request.get_json()
    name = data.get('name')
    if not name:
        return jsonify({'error': 'Name required'}), 400
    if District.query.filter_by(name=name).first():
        return jsonify({'error': 'District already exists'}), 400
    district = District(name=name)
    db.session.add(district)
    db.session.commit()
    return jsonify({'message': 'District created'}), 201

@users_bp.route('/districts', methods=['GET'])
def list_districts():
    districts = District.query.all()
    return jsonify([{'id': d.id, 'name': d.name} for d in districts]), 200

@users_bp.route('/districts/<int:district_id>', methods=['DELETE'])
@jwt_required()
@require_admin()
def delete_district(district_id):
    district = District.query.get(district_id)
    if not district:
        return jsonify({'error': 'District not found'}), 404
    if User.query.filter_by(district_id=district_id).first() or Report.query.filter_by(district_id=district_id).first():
        return jsonify({'error': 'District has associated data, cannot delete'}), 400
    db.session.delete(district)
    db.session.commit()
    return jsonify({'message': 'District deleted'}), 200

@users_bp.route('/<int:user_id>/active', methods=['PUT'])
@jwt_required()
@require_admin()
def toggle_user_active(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    data = request.get_json()
    if 'active' not in data:
        return jsonify({'error': 'active field required'}), 400
    user.is_active = data['active']
    db.session.commit()
    return jsonify({'message': 'User active status updated'}), 200

@users_bp.route('/stats', methods=['GET'])
@jwt_required()
@require_admin()
def get_stats():
    user_count = User.query.count()
    report_count = Report.query.count()
    district_count = District.query.count()
    dept_count = Department.query.count()
    official_count = OfficialDesignation.query.count()
    return jsonify({
        'users': user_count,
        'reports': report_count,
        'districts': district_count,
        'departments': dept_count,
        'officials': official_count
    }), 200