from app import db
from datetime import datetime
from flask_bcrypt import generate_password_hash, check_password_hash
from app.models.user_module import UserModule

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    middle_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    diet_preference = db.Column(db.String(50))
    tshirt_size = db.Column(db.String(10))
    tshirt_color = db.Column(db.String(20))
    district_id = db.Column(db.Integer, db.ForeignKey('districts.id'), nullable=True)
    guest_type = db.Column(db.String(20), nullable=False)
    entity = db.Column(db.String(100))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Specify foreign_keys to resolve ambiguity with approved_by
    user_modules = db.relationship('UserModule', foreign_keys='UserModule.user_id', backref='user', lazy=True, cascade='all, delete-orphan')
    official_designation = db.relationship('OfficialDesignation', backref='user', uselist=False, lazy=True)
    reports_submitted = db.relationship('Report', foreign_keys='Report.submitted_by', backref='submitter', lazy=True)
    reports_reviewed = db.relationship('Report', foreign_keys='Report.reviewed_by', backref='reviewer', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def has_module(self, module_name, active_only=True):
        from app.models.module import Module
        from app.models.user_module import UserModule
        module = Module.query.filter_by(name=module_name).first()
        if not module:
            return False
        q = UserModule.query.filter_by(user_id=self.id, module_id=module.id)
        if active_only:
            q = q.filter_by(is_active=True)
        return q.first() is not None

    def get_modules(self, active_only=True):
        q = UserModule.query.filter_by(user_id=self.id)
        if active_only:
            q = q.filter_by(is_active=True)
        return [um.module.name for um in q.all() if um.module]