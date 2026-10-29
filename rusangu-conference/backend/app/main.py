import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from app.models import (
    User, District, Module, UserModule, Department,
    OfficialDesignation, OfficialDepartment, Report,
    Camp, Meeting, Badge, DelegateAttendance, DelegateMeal
)
from sqlalchemy import inspect, text

def auto_migrate():
    app = create_app()
    with app.app_context():
        inspector = inspect(db.engine)
        db.create_all()

        def add_missing_columns(model):
            table_name = model.__tablename__
            if not inspector.has_table(table_name):
                return
            existing_columns = {col['name'] for col in inspector.get_columns(table_name)}
            for column in model.__table__.columns:
                if column.name not in existing_columns:
                    col_type = column.type.compile(db.engine)
                    nullable = '' if column.nullable else 'NOT NULL'
                    default = f"DEFAULT {column.default.arg}" if column.default else ''
                    alter = f"ALTER TABLE {table_name} ADD COLUMN {column.name} {col_type} {nullable} {default}"
                    db.session.execute(text(alter))
                    db.session.commit()
                    print(f"Added column {column.name} to {table_name}")

        # Add missing columns for all models
        models = [User, District, Module, UserModule, Department, OfficialDesignation, OfficialDepartment, Report, Camp, Meeting, Badge, DelegateAttendance, DelegateMeal]
        for model in models:
            if inspector.has_table(model.__tablename__):
                add_missing_columns(model)

        # Seed default modules
        default_modules = ['use', 'membership', 'reports', 'officials', 'session_meetings_delegate', 'camps', 'meetings', 'session_meetings', 'admin']
        for mod_name in default_modules:
            if not Module.query.filter_by(name=mod_name).first():
                mod = Module(name=mod_name)
                db.session.add(mod)

        # Seed districts (your list)
        district_names = [
            "Bbombo", "Bweengwa", "Chipepo", "Chirundu", "Demu", "Gonhwe District",
            "Kabulamwanda", "Kaonga", "Kaumba", "Kazungula", "Keemba",
            "Lusitu Mission District", "Magoye East", "Magoye West",
            "Mazabuka Central", "Mazabuka North", "Mazabuka South", "Mazabuka West",
            "Monze Central District", "Monze East", "Monze North", "Monze South",
            "Munali", "Munyumbwe", "Nadezwe", "Namwala", "Pemba District",
            "Rusangu", "Rusangu Secondary", "Rusangu University",
            "Siavonga", "Turnpike Mission District"
        ]
        for dname in district_names:
            if not District.query.filter_by(name=dname).first():
                dist = District(name=dname)
                db.session.add(dist)

        # Seed departments
        dept_names = ['stewardship', 'personal_ministries', 'sabbath_school', 'ministerial', 'family_life', 'apm', 'youth', 'music', 'chaplaincy']
        for dept_name in dept_names:
            if not Department.query.filter_by(name=dept_name).first():
                dept = Department(name=dept_name)
                db.session.add(dept)

        db.session.commit()

        # Create admin user (if not exists)
        admin_email = 'admin@rusangu.org'
        admin_user = User.query.filter_by(email=admin_email).first()
        if not admin_user:
            admin_user = User(
                email=admin_email,
                first_name='Admin',
                last_name='User',
                gender='male',
                phone='0000000000',
                guest_type='other',
                entity='Rusangu Conference',
                is_active=True
            )
            admin_user.set_password('admin123')
            db.session.add(admin_user)
            db.session.flush()
            all_modules = Module.query.all()
            for mod in all_modules:
                um = UserModule(user_id=admin_user.id, module_id=mod.id, is_active=True)
                db.session.add(um)
            db.session.commit()
            print("✅ Admin user created: admin@rusangu.org / admin123")
        else:
            # Ensure admin has all modules (for new modules)
            all_modules = Module.query.all()
            for mod in all_modules:
                existing = UserModule.query.filter_by(user_id=admin_user.id, module_id=mod.id).first()
                if not existing:
                    um = UserModule(user_id=admin_user.id, module_id=mod.id, is_active=True)
                    db.session.add(um)
            db.session.commit()
            print("✅ Admin user already exists, all modules verified.")

        print("✅ Database initialization and seeding complete.")

if __name__ == '__main__':
    auto_migrate()
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)