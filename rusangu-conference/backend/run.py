from app.main import auto_migrate, create_app

if __name__ == '__main__':
    auto_migrate()
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)