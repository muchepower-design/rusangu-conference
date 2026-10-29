from app import db
from datetime import datetime

class UserModule(db.Model):
    __tablename__ = 'user_modules'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    assigned_at = db.Column(db.DateTime, default=datetime.utcnow)
    approved_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    approved_at = db.Column(db.DateTime, nullable=True)

    # Relationship for approved_by (optional)
    approver = db.relationship('User', foreign_keys=[approved_by], backref='approved_user_modules')

    __table_args__ = (db.UniqueConstraint('user_id', 'module_id', name='_user_module_uc'),)