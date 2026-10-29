from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, Badge, UserModule, Module
from app.utils.decorators import require_admin
import uuid, io
from datetime import datetime
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4

badges_bp = Blueprint('badges', __name__)

@badges_bp.route('/generate', methods=['POST'])
@jwt_required()
@require_admin()
def generate_badges():
    data = request.get_json()
    user_ids = data.get('user_ids', [])
    if not user_ids:
        # Generate for all approved delegates
        session_delegate_mod = Module.query.filter_by(name='session_meetings_delegate').first()
        if not session_delegate_mod:
            return jsonify({'error': 'Module not found'}), 500
        user_modules = UserModule.query.filter_by(module_id=session_delegate_mod.id, is_active=True).filter(UserModule.approved_by.isnot(None)).all()
        user_ids = [um.user_id for um in user_modules]

    badges_created = []
    for uid in user_ids:
        user = User.query.get(uid)
        if not user:
            continue
        badge_id = str(uuid.uuid4())[:8]
        existing = Badge.query.filter_by(user_id=uid).first()
        if existing:
            existing.badge_id = badge_id
            existing.generated_at = datetime.utcnow()
        else:
            badge = Badge(user_id=uid, badge_id=badge_id)
            db.session.add(badge)
        badges_created.append({'user_id': uid, 'badge_id': badge_id})
    db.session.commit()
    return jsonify({'badges': badges_created}), 200

@badges_bp.route('/<int:user_id>/download', methods=['GET'])
@jwt_required()
def download_badge(user_id):
    current = User.query.get(get_jwt_identity())
    if current.id != user_id and not (current.official_designation and current.official_designation.designation_type in ['president', 'executive_secretary']):
        return jsonify({'error': 'Not authorized'}), 403
    badge = Badge.query.filter_by(user_id=user_id).first()
    if not badge:
        return jsonify({'error': 'Badge not generated'}), 404
    user = User.query.get(user_id)
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    c.drawString(100, height-100, "RUSANGU CONFERENCE")
    c.drawString(100, height-130, "DELEGATE ID CARD")
    c.drawString(100, height-160, f"Name: {user.first_name} {user.last_name}")
    c.drawString(100, height-190, f"District: {user.district.name if user.district else 'N/A'}")
    c.drawString(100, height-220, f"Badge ID: {badge.badge_id}")
    c.save()
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name=f'badge_{badge.badge_id}.pdf', mimetype='application/pdf')