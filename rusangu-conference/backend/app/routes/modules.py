from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import Module, Department  # <-- import Department
from app.utils.decorators import require_admin

modules_bp = Blueprint('modules', __name__)

# Remove trailing slash by using empty string
@modules_bp.route('/', methods=['GET'])
@jwt_required()
def list_modules():
    modules = Module.query.all()
    return jsonify([{'id': m.id, 'name': m.name} for m in modules]), 200

@modules_bp.route('', methods=['POST'])
@jwt_required()
@require_admin()
def create_module():
    data = request.get_json()
    name = data.get('name')
    if not name:
        return jsonify({'error': 'Module name required'}), 400
    if Module.query.filter_by(name=name).first():
        return jsonify({'error': 'Module already exists'}), 400
    mod = Module(name=name)
    db.session.add(mod)
    db.session.commit()
    return jsonify({'message': 'Module created'}), 201

@modules_bp.route('/<int:module_id>', methods=['DELETE'])
@jwt_required()
@require_admin()
def delete_module(module_id):
    mod = Module.query.get(module_id)
    if not mod:
        return jsonify({'error': 'Module not found'}), 404
    db.session.delete(mod)
    db.session.commit()
    return jsonify({'message': 'Module deleted'}), 200

@modules_bp.route('/departments', methods=['POST'])
@jwt_required()
@require_admin()
def create_department():
    data = request.get_json()
    name = data.get('name')
    if not name:
        return jsonify({'error': 'Name required'}), 400
    if Department.query.filter_by(name=name).first():
        return jsonify({'error': 'Department already exists'}), 400
    dept = Department(name=name)
    db.session.add(dept)
    db.session.commit()
    return jsonify({'message': 'Department created'}), 201

@modules_bp.route('/departments/<int:dept_id>', methods=['DELETE'])
@jwt_required()
@require_admin()
def delete_department(dept_id):
    dept = Department.query.get(dept_id)
    if not dept:
        return jsonify({'error': 'Department not found'}), 404
    from app.models import OfficialDepartment
    if OfficialDepartment.query.filter_by(department_id=dept_id).first():
        return jsonify({'error': 'Department has associated officials, cannot delete'}), 400
    db.session.delete(dept)
    db.session.commit()
    return jsonify({'message': 'Department deleted'}), 200

@modules_bp.route('/departments', methods=['GET'])
@jwt_required()
def list_departments():
    depts = Department.query.all()
    return jsonify([{'id': d.id, 'name': d.name} for d in depts]), 200