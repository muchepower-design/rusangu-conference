from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app import db
from app.models import User, District, Module, UserModule

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    required = ['email', 'password', 'first_name', 'last_name', 'gender', 'phone', 'guest_type']
    if not all(k in data for k in required):
        return jsonify({'error': 'Missing required fields'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400

    if data['guest_type'] not in ['delegate', 'other']:
        return jsonify({'error': 'Invalid guest_type'}), 400

    user = User(
        email=data['email'],
        first_name=data['first_name'],
        middle_name=data.get('middle_name'),
        last_name=data['last_name'],
        gender=data['gender'],
        phone=data['phone'],
        diet_preference=data.get('diet_preference'),
        tshirt_size=data.get('tshirt_size'),
        tshirt_color=data.get('tshirt_color'),
        guest_type=data['guest_type'],
        is_active=True
    )
    user.set_password(data['password'])

    if data['guest_type'] == 'delegate':
        district_id = data.get('district_id')
        if not district_id:
            return jsonify({'error': 'district_id required for delegate'}), 400
        district = District.query.get(district_id)
        if not district:
            return jsonify({'error': 'Invalid district'}), 400
        user.district_id = district_id
        user.entity = None
    else:
        entity = data.get('entity')
        if not entity:
            return jsonify({'error': 'entity required for guest_type other'}), 400
        user.entity = entity
        user.district_id = None

    db.session.add(user)
    db.session.flush()

    # Assign default modules
    use_mod = Module.query.filter_by(name='use').first()
    if use_mod:
        db.session.add(UserModule(user_id=user.id, module_id=use_mod.id, is_active=True))

    if user.guest_type == 'delegate':
        membership_mod = Module.query.filter_by(name='membership').first()
        if membership_mod:
            db.session.add(UserModule(user_id=user.id, module_id=membership_mod.id, is_active=True))
        session_delegate_mod = Module.query.filter_by(name='session_meetings_delegate').first()
        if session_delegate_mod:
            db.session.add(UserModule(user_id=user.id, module_id=session_delegate_mod.id, is_active=False))
    else:
        session_meetings_mod = Module.query.filter_by(name='session_meetings').first()
        if session_meetings_mod:
            db.session.add(UserModule(user_id=user.id, module_id=session_meetings_mod.id, is_active=True))

    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON'}), 400
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 401
    if not user.check_password(password):
        return jsonify({'error': 'Invalid password'}), 401
    if not user.is_active:
        return jsonify({'error': 'Account disabled'}), 403
    if not user.has_module('use', active_only=True):
        return jsonify({'error': 'No "use" module assigned'}), 403
    # Ensure identity is string
    access_token = create_access_token(identity=str(user.id))
    return jsonify({'access_token': access_token, 'user_id': user.id}), 200