from app import db
from datetime import datetime

class District(db.Model):
    __tablename__ = 'districts'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    users = db.relationship('User', backref='district', lazy=True)
    reports = db.relationship('Report', backref='district', lazy=True)
    official_designations = db.relationship('OfficialDesignation', backref='district', lazy=True)