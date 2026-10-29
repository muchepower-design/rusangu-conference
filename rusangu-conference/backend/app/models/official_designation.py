from app import db
from datetime import datetime

class OfficialDesignation(db.Model):
    __tablename__ = 'official_designations'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    designation_type = db.Column(db.String(30), nullable=False)
    district_id = db.Column(db.Integer, db.ForeignKey('districts.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    official_departments = db.relationship('OfficialDepartment', backref='official', lazy=True)