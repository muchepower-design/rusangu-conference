from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from app.config import Config

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, supports_credentials=True, expose_headers=['Authorization'])  # <-- expose header
    db.init_app(app)
    jwt.init_app(app)

    # JWT error handlers
    @jwt.unauthorized_loader
    def unauthorized_response(callback):
        return jsonify({'error': 'Missing or invalid token'}), 401

    @jwt.invalid_token_loader
    def invalid_token_response(callback):
        return jsonify({'error': 'Invalid token'}), 401

    @jwt.expired_token_loader
    def expired_token_response(callback, expired_token):
        return jsonify({'error': 'Token expired'}), 401

    from app.routes.auth import auth_bp
    from app.routes.users import users_bp
    from app.routes.modules import modules_bp
    from app.routes.reports import reports_bp
    from app.routes.officials import officials_bp
    from app.routes.camps import camps_bp
    from app.routes.meetings import meetings_bp
    from app.routes.badges import badges_bp
    from app.routes.delegates import delegates_bp


    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(modules_bp, url_prefix='/api/modules')
    app.register_blueprint(reports_bp, url_prefix='/api/reports')
    app.register_blueprint(officials_bp, url_prefix='/api/officials')
    app.register_blueprint(camps_bp, url_prefix='/api/camps')
    app.register_blueprint(meetings_bp, url_prefix='/api/meetings')
    app.register_blueprint(badges_bp, url_prefix='/api/badges')
    app.register_blueprint(delegates_bp, url_prefix='/api/delegates')

    return app