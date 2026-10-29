import os

# ==========================================
# Project Structure
# ==========================================

structure = {
    "frontend": [
        "index.html",
        "package.json",
        "vite.config.js",
        "tailwind.config.js",
        "postcss.config.js",

        "src/main.jsx",
        "src/App.jsx",
        "src/index.css",

        "src/api/client.js",

        "src/contexts/AuthContext.jsx",
        "src/contexts/ModuleContext.jsx",

        "src/hooks/useAuth.js",
        "src/hooks/useModules.js",

        "src/components/common/Navbar.jsx",
        "src/components/common/Sidebar.jsx",
        "src/components/common/ProtectedRoute.jsx",
        "src/components/common/Layout.jsx",

        "src/components/auth/Login.jsx",
        "src/components/auth/Register.jsx",

        "src/components/reports/ReportForm.jsx",
        "src/components/reports/ReportList.jsx",
        "src/components/reports/ReportReview.jsx",
        "src/components/reports/reportSchemas.js",

        "src/components/officials/DesignationManager.jsx",
        "src/components/officials/OfficialDashboard.jsx",

        "src/components/delegates/DelegateApproval.jsx",
        "src/components/delegates/BadgeGenerator.jsx",

        "src/components/camps/CampList.jsx",

        "src/components/meetings/MeetingList.jsx",

        "src/pages/LoginPage.jsx",
        "src/pages/RegisterPage.jsx",
        "src/pages/DashboardPage.jsx",
        "src/pages/ReportsPage.jsx",
        "src/pages/OfficialsPage.jsx",
        "src/pages/DelegatesPage.jsx",
        "src/pages/CampsPage.jsx",
        "src/pages/MeetingsPage.jsx",
    ],

    "backend": [
        "requirements.txt",
        "run.py",

        "app/__init__.py",
        "app/main.py",
        "app/config.py",

        "app/models/__init__.py",
        "app/models/user.py",
        "app/models/district.py",
        "app/models/module.py",
        "app/models/user_module.py",
        "app/models/department.py",
        "app/models/official_designation.py",
        "app/models/official_department.py",
        "app/models/report.py",
        "app/models/camp.py",
        "app/models/meeting.py",
        "app/models/badge.py",

        "app/routes/__init__.py",
        "app/routes/auth.py",
        "app/routes/users.py",
        "app/routes/modules.py",
        "app/routes/reports.py",
        "app/routes/officials.py",
        "app/routes/camps.py",
        "app/routes/meetings.py",
        "app/routes/badges.py",

        "app/utils/__init__.py",
        "app/utils/decorators.py",
    ]
}


def create_structure(base="."):
    for root, files in structure.items():
        root_path = os.path.join(base, root)
        os.makedirs(root_path, exist_ok=True)

        for file in files:
            file_path = os.path.join(root_path, file)

            # Create parent directories
            os.makedirs(os.path.dirname(file_path), exist_ok=True)

            # Create empty file if it doesn't exist
            if not os.path.exists(file_path):
                with open(file_path, "w", encoding="utf-8") as f:
                    pass

                print(f"Created: {file_path}")
            else:
                print(f"Exists : {file_path}")

    print("\n===================================")
    print("Project structure created successfully!")
    print("===================================")


if __name__ == "__main__":
    create_structure()