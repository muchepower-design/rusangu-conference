from app import db
from datetime import datetime

class DelegateMeal(db.Model):
    __tablename__ = 'delegate_meals'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    meal_type = db.Column(db.String(20), nullable=False)  # breakfast, lunch, supper
    date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), default='not_taken')  # taken, not_taken
    taken_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (db.UniqueConstraint('user_id', 'meal_type', 'date', name='_user_meal_date_uc'),)