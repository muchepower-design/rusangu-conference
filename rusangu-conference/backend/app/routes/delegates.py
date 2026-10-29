from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, Badge, DelegateAttendance, DelegateMeal, UserModule, Module
from app.utils.decorators import require_admin
from datetime import datetime, date

delegates_bp = Blueprint('delegates', __name__)

@delegates_bp.route('/me', methods=['GET'])
@jwt_required()
def get_delegate_info():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    if user.guest_type != 'delegate':
        return jsonify({'error': 'Not a delegate'}), 400

    # Get badge
    badge = Badge.query.filter_by(user_id=user_id).first()
    # Get attendance for today
    today = date.today()
    attendance = DelegateAttendance.query.filter_by(user_id=user_id, session_date=today).first()
    # Get meals for today
    meals = DelegateMeal.query.filter_by(user_id=user_id, date=today).all()
    meal_status = {m.meal_type: m.status for m in meals}

    return jsonify({
        'id': user.id,
        'name': f"{user.first_name} {user.last_name}",
        'district': user.district.name if user.district else None,
        'badge_id': badge.badge_id if badge else None,
        'attendance': attendance.status if attendance else 'not_recorded',
        'meals': meal_status,
        'modules': user.get_modules()
    }), 200

@delegates_bp.route('/attendance', methods=['POST'])
@jwt_required()
@require_admin()
def mark_attendance():
    data = request.get_json()
    user_id = data.get('user_id')
    session_date = data.get('session_date') or date.today().isoformat()
    status = data.get('status', 'present')  # present, absent, late

    if not user_id:
        return jsonify({'error': 'user_id required'}), 400

    user = User.query.get(user_id)
    if not user or user.guest_type != 'delegate':
        return jsonify({'error': 'Invalid delegate'}), 400

    # Parse date
    try:
        session_date_obj = datetime.strptime(session_date, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format'}), 400

    # Check if exists
    attendance = DelegateAttendance.query.filter_by(user_id=user_id, session_date=session_date_obj).first()
    if attendance:
        attendance.status = status
        attendance.updated_at = datetime.utcnow()
        if status in ['present', 'late'] and not attendance.check_in_time:
            attendance.check_in_time = datetime.utcnow()
    else:
        attendance = DelegateAttendance(
            user_id=user_id,
            session_date=session_date_obj,
            status=status,
            check_in_time=datetime.utcnow() if status in ['present', 'late'] else None
        )
        db.session.add(attendance)
    db.session.commit()
    return jsonify({'message': 'Attendance updated'}), 200

@delegates_bp.route('/meals', methods=['POST'])
@jwt_required()
@require_admin()
def mark_meal():
    data = request.get_json()
    user_id = data.get('user_id')
    meal_type = data.get('meal_type')  # breakfast, lunch, supper
    status = data.get('status', 'taken')
    meal_date = data.get('date') or date.today().isoformat()

    if not user_id or not meal_type:
        return jsonify({'error': 'user_id and meal_type required'}), 400
    if meal_type not in ['breakfast', 'lunch', 'supper']:
        return jsonify({'error': 'Invalid meal_type'}), 400

    user = User.query.get(user_id)
    if not user or user.guest_type != 'delegate':
        return jsonify({'error': 'Invalid delegate'}), 400

    try:
        meal_date_obj = datetime.strptime(meal_date, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format'}), 400

    # Check if exists
    meal = DelegateMeal.query.filter_by(user_id=user_id, meal_type=meal_type, date=meal_date_obj).first()
    if meal:
        meal.status = status
        meal.taken_at = datetime.utcnow() if status == 'taken' else None
        meal.updated_at = datetime.utcnow()
    else:
        meal = DelegateMeal(
            user_id=user_id,
            meal_type=meal_type,
            date=meal_date_obj,
            status=status,
            taken_at=datetime.utcnow() if status == 'taken' else None
        )
        db.session.add(meal)
    db.session.commit()
    return jsonify({'message': 'Meal updated'}), 200

@delegates_bp.route('/badges/generate', methods=['POST'])
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
        import uuid
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

@delegates_bp.route('/badges/<int:user_id>/download', methods=['GET'])
@jwt_required()
def download_badge(user_id):
    current = User.query.get(get_jwt_identity())
    if current.id != user_id and not (current.official_designation and current.official_designation.designation_type in ['president', 'executive_secretary', 'director']):
        return jsonify({'error': 'Not authorized'}), 403
    badge = Badge.query.filter_by(user_id=user_id).first()
    if not badge:
        return jsonify({'error': 'Badge not generated'}), 404
    user = User.query.get(user_id)
    from io import BytesIO
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import A4
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    c.drawString(100, height-100, "RUSANGU CONFERENCE")
    c.drawString(100, height-130, "DELEGATE BADGE")
    c.drawString(100, height-160, f"Name: {user.first_name} {user.last_name}")
    c.drawString(100, height-190, f"District: {user.district.name if user.district else 'N/A'}")
    c.drawString(100, height-220, f"Badge ID: {badge.badge_id}")
    c.save()
    buffer.seek(0)
    from flask import send_file
    return send_file(buffer, as_attachment=True, download_name=f'badge_{badge.badge_id}.pdf', mimetype='application/pdf')