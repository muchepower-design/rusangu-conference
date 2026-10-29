from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, OfficialDesignation, OfficialDepartment, Department, District, Module, UserModule
from app.utils.decorators import require_admin

officials_bp = Blueprint('officials', __name__)

@officials_bp.route('/designate', methods=['POST'])
@jwt_required()
@require_admin()
def designate_official():
    data = request.get_json()
    user_id = data.get('user_id')
    designation_type = data.get('designation_type')
    district_id = data.get('district_id')  # for district_pastor
    department_ids = data.get('department_ids', [])  # for director

    if not user_id or not designation_type:
        return jsonify({'error': 'user_id and designation_type required'}), 400
    valid = ['president', 'executive_secretary', 'cfo', 'director', 'district_pastor', 'conference_official', 'secretary']
    if designation_type not in valid:
        return jsonify({'error': 'Invalid designation_type'}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Ensure user has 'officials' and 'reports' modules
    for mod_name in ['officials', 'reports']:
        mod = Module.query.filter_by(name=mod_name).first()
        if mod and not UserModule.query.filter_by(user_id=user_id, module_id=mod.id).first():
            db.session.add(UserModule(user_id=user_id, module_id=mod.id, is_active=True))

    # Check if already designated
    existing = OfficialDesignation.query.filter_by(user_id=user_id).first()
    if existing:
        existing.designation_type = designation_type
        existing.district_id = district_id if designation_type == 'district_pastor' else None
        od = existing
    else:
        od = OfficialDesignation(
            user_id=user_id,
            designation_type=designation_type,
            district_id=district_id if designation_type == 'district_pastor' else None
        )
        db.session.add(od)
        db.session.flush()

    # Manage departments
    # Clear existing
    OfficialDepartment.query.filter_by(official_id=od.id).delete()
    if designation_type == 'director':
        for dept_id in department_ids:
            dept = Department.query.get(dept_id)
            if dept:
                db.session.add(OfficialDepartment(official_id=od.id, department_id=dept_id))
    elif designation_type == 'district_pastor' and department_ids:
        # district pastors can also have departments? The requirement says some can be assigned departments, so we allow.
        for dept_id in department_ids:
            dept = Department.query.get(dept_id)
            if dept:
                db.session.add(OfficialDepartment(official_id=od.id, department_id=dept_id))

    db.session.commit()
    return jsonify({'message': 'Official designated'}), 200

@officials_bp.route('/<int:user_id>/designation', methods=['DELETE'])
@jwt_required()
@require_admin()
def remove_designation(user_id):
    od = OfficialDesignation.query.filter_by(user_id=user_id).first()
    if not od:
        return jsonify({'error': 'No designation found'}), 404
    db.session.delete(od)
    db.session.commit()
    return jsonify({'message': 'Designation removed'}), 200

@officials_bp.route('/list', methods=['GET'])
@jwt_required()
def list_officials():
    # Only admin or officials can view
    user = User.query.get(get_jwt_identity())
    if not user.official_designation and not user.has_module('officials'):
        return jsonify({'error': 'Not authorized'}), 403
    officials = OfficialDesignation.query.all()
    result = []
    for od in officials:
        result.append({
            'user_id': od.user_id,
            'user_name': f"{od.user.first_name} {od.user.last_name}",
            'designation': od.designation_type,
            'district': od.district.name if od.district else None,
            'departments': [dep.department.name for dep in od.official_departments]
        })
    return jsonify(result), 200