from app import db
from datetime import datetime

class DelegateAttendance(db.Model):
    __tablename__ = 'delegate_attendances'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    session_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), default='present')  # present, absent, late
    check_in_time = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (db.UniqueConstraint('user_id', 'session_date', name='_user_session_uc'),)