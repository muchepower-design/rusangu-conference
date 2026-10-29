from app import db
from datetime import datetime

class Badge(db.Model):
    __tablename__ = 'session_delegate_badges'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    badge_id = db.Column(db.String(50), unique=True, nullable=False)
    generated_at = db.Column(db.DateTime, default=datetime.utcnow)