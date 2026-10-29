from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Camp
from app.utils.decorators import require_module

camps_bp = Blueprint('camps', __name__)

@camps_bp.route('/', methods=['GET'])
@jwt_required()
@require_module('camps')
def list_camps():
    camps = Camp.query.all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'start_date': c.start_date.isoformat(),
        'end_date': c.end_date.isoformat(),
        'description': c.description,
        'created_by': c.created_by,
        'created_at': c.created_at
    } for c in camps]), 200

@camps_bp.route('/', methods=['POST'])
@jwt_required()
@require_module('camps')
def create_camp():
    data = request.get_json()
    if not data.get('name') or not data.get('start_date') or not data.get('end_date'):
        return jsonify({'error': 'name, start_date, end_date required'}), 400
    camp = Camp(
        name=data['name'],
        start_date=data['start_date'],
        end_date=data['end_date'],
        description=data.get('description'),
        created_by=get_jwt_identity()
    )
    db.session.add(camp)
    db.session.commit()
    return jsonify({'message': 'Camp created', 'id': camp.id}), 201

@camps_bp.route('/<int:camp_id>', methods=['PUT'])
@jwt_required()
@require_module('camps')
def update_camp(camp_id):
    camp = Camp.query.get(camp_id)
    if not camp:
        return jsonify({'error': 'Camp not found'}), 404
    data = request.get_json()
    if 'name' in data:
        camp.name = data['name']
    if 'start_date' in data:
        camp.start_date = data['start_date']
    if 'end_date' in data:
        camp.end_date = data['end_date']
    if 'description' in data:
        camp.description = data['description']
    db.session.commit()
    return jsonify({'message': 'Camp updated'}), 200

@camps_bp.route('/<int:camp_id>', methods=['DELETE'])
@jwt_required()
@require_module('camps')
def delete_camp(camp_id):
    camp = Camp.query.get(camp_id)
    if not camp:
        return jsonify({'error': 'Camp not found'}), 404
    db.session.delete(camp)
    db.session.commit()
    return jsonify({'message': 'Camp deleted'}), 200