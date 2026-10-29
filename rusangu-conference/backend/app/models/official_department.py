from app import db
from datetime import datetime

class OfficialDepartment(db.Model):
    __tablename__ = 'official_departments'
    id = db.Column(db.Integer, primary_key=True)
    official_id = db.Column(db.Integer, db.ForeignKey('official_designations.id'), nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (db.UniqueConstraint('official_id', 'department_id', name='_official_dept_uc'),)