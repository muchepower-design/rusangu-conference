from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Meeting
from app.utils.decorators import require_module

meetings_bp = Blueprint('meetings', __name__)

@meetings_bp.route('/', methods=['GET'])
@jwt_required()
@require_module('meetings')
def list_meetings():
    meetings = Meeting.query.all()
    return jsonify([{
        'id': m.id,
        'title': m.title,
        'agenda': m.agenda,
        'date_time': m.date_time.isoformat(),
        'location': m.location,
        'created_by': m.created_by,
        'created_at': m.created_at
    } for m in meetings]), 200

@meetings_bp.route('/', methods=['POST'])
@jwt_required()
@require_module('meetings')
def create_meeting():
    data = request.get_json()
    if not data.get('title') or not data.get('date_time'):
        return jsonify({'error': 'title and date_time required'}), 400
    meeting = Meeting(
        title=data['title'],
        agenda=data.get('agenda'),
        date_time=data['date_time'],
        location=data.get('location'),
        created_by=get_jwt_identity()
    )
    db.session.add(meeting)
    db.session.commit()
    return jsonify({'message': 'Meeting created', 'id': meeting.id}), 201

@meetings_bp.route('/<int:meeting_id>', methods=['PUT'])
@jwt_required()
@require_module('meetings')
def update_meeting(meeting_id):
    meeting = Meeting.query.get(meeting_id)
    if not meeting:
        return jsonify({'error': 'Meeting not found'}), 404
    data = request.get_json()
    if 'title' in data:
        meeting.title = data['title']
    if 'agenda' in data:
        meeting.agenda = data['agenda']
    if 'date_time' in data:
        meeting.date_time = data['date_time']
    if 'location' in data:
        meeting.location = data['location']
    db.session.commit()
    return jsonify({'message': 'Meeting updated'}), 200

@meetings_bp.route('/<int:meeting_id>', methods=['DELETE'])
@jwt_required()
@require_module('meetings')
def delete_meeting(meeting_id):
    meeting = Meeting.query.get(meeting_id)
    if not meeting:
        return jsonify({'error': 'Meeting not found'}), 404
    db.session.delete(meeting)
    db.session.commit()
    return jsonify({'message': 'Meeting deleted'}), 200