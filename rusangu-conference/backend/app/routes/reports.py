from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Report, District, User
from app.utils.decorators import require_module, require_official_designation
from datetime import datetime
from sqlalchemy import func, case

reports_bp = Blueprint('reports', __name__)

@reports_bp.route('/', methods=['POST'])
@jwt_required()
@require_module('reports')
def create_report():
    data = request.get_json()
    required = ['district_id', 'quarter', 'year', 'report_type', 'data']
    if not all(k in data for k in required):
        return jsonify({'error': 'Missing required fields'}), 400

    valid_types = ['stewardship', 'personal_ministries', 'sabbath_school', 'ministerial', 'family_life', 'apm', 'youth', 'music', 'chaplaincy']
    if data['report_type'] not in valid_types:
        return jsonify({'error': 'Invalid report_type'}), 400

    district = District.query.get(data['district_id'])
    if not district:
        return jsonify({'error': 'Invalid district'}), 404

    user = User.query.get(get_jwt_identity())
    # Check submission permission: either own district, or official with sufficient rights
    allowed = False
    if user.district_id == data['district_id']:
        allowed = True
    if user.official_designation:
        if user.official_designation.designation_type == 'district_pastor' and user.official_designation.district_id == data['district_id']:
            allowed = True
        if user.official_designation.designation_type in ['director', 'executive_secretary', 'president']:
            allowed = True
    if not allowed:
        return jsonify({'error': 'Not authorized to submit for this district'}), 403

    existing = Report.query.filter_by(
        district_id=data['district_id'],
        quarter=data['quarter'],
        year=data['year'],
        report_type=data['report_type']
    ).first()
    if existing:
        return jsonify({'error': 'Report already exists for this period'}), 400

    report = Report(
        district_id=data['district_id'],
        quarter=data['quarter'],
        year=data['year'],
        report_type=data['report_type'],
        data=data['data'],
        submitted_by=user.id,
        status='draft'
    )
    db.session.add(report)
    db.session.commit()
    return jsonify({'message': 'Report created', 'id': report.id}), 201

@reports_bp.route('/<int:report_id>', methods=['PUT'])
@jwt_required()
@require_module('reports')
def update_report(report_id):
    report = Report.query.get(report_id)
    if not report:
        return jsonify({'error': 'Report not found'}), 404
    user = User.query.get(get_jwt_identity())
    if report.status != 'draft':
        return jsonify({'error': 'Cannot update a non-draft report'}), 400
    if report.submitted_by != user.id:
        return jsonify({'error': 'Only submitter can edit draft'}), 403

    data = request.get_json()
    if 'data' in data:
        report.data = data['data']
    if 'status' in data and data['status'] in ['draft', 'submitted']:
        report.status = data['status']
        if report.status == 'submitted':
            report.submitted_at = datetime.utcnow()
    report.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify({'message': 'Report updated'}), 200

@reports_bp.route('/<int:report_id>/submit', methods=['POST'])
@jwt_required()
@require_module('reports')
def submit_report(report_id):
    report = Report.query.get(report_id)
    if not report:
        return jsonify({'error': 'Report not found'}), 404
    user = User.query.get(get_jwt_identity())
    if report.submitted_by != user.id:
        return jsonify({'error': 'Not authorized to submit this report'}), 403
    if report.status == 'submitted':
        return jsonify({'error': 'Report already submitted'}), 400
    report.status = 'submitted'
    report.submitted_at = datetime.utcnow()
    db.session.commit()
    return jsonify({'message': 'Report submitted'}), 200

@reports_bp.route('/<int:report_id>/review', methods=['POST'])
@jwt_required()
def review_report(report_id):
    user = User.query.get(get_jwt_identity())
    if not user.official_designation:
        return jsonify({'error': 'Only officials can review'}), 403
    designation = user.official_designation.designation_type
    report = Report.query.get(report_id)
    if not report:
        return jsonify({'error': 'Report not found'}), 404

    # Permission checks
    if designation == 'district_pastor' and user.official_designation.district_id != report.district_id:
        return jsonify({'error': 'Not authorized for this district'}), 403
    if designation == 'director':
        dept_names = [od.department.name for od in user.official_designation.official_departments]
        if report.report_type not in dept_names:
            return jsonify({'error': 'Not authorized for this department'}), 403
    if designation == 'cfo' and report.report_type != 'stewardship':
        return jsonify({'error': 'CFO can only review stewardship reports'}), 403
    # president and executive_secretary can review all

    data = request.get_json()
    action = data.get('action')  # approved, rejected, reviewed
    if action not in ['approved', 'rejected', 'reviewed']:
        return jsonify({'error': 'Invalid action'}), 400
    report.status = action
    report.reviewed_by = user.id
    report.reviewed_at = datetime.utcnow()
    db.session.commit()
    return jsonify({'message': f'Report {action}'}), 200

@reports_bp.route('/list', methods=['GET'])
@jwt_required()
def list_reports():
    user = User.query.get(get_jwt_identity())
    query = Report.query
    if user.official_designation:
        des = user.official_designation.designation_type
        if des == 'district_pastor':
            query = query.filter_by(district_id=user.official_designation.district_id)
        elif des == 'director':
            dept_names = [od.department.name for od in user.official_designation.official_departments]
            if dept_names:
                query = query.filter(Report.report_type.in_(dept_names))
            else:
                return jsonify({'error': 'No departments assigned'}), 403
        elif des == 'cfo':
            query = query.filter_by(report_type='stewardship')
        # president and executive_secretary see all
    else:
        # regular users see only their own reports
        if user.has_module('reports'):
            query = query.filter_by(submitted_by=user.id)
        else:
            return jsonify({'error': 'No permission'}), 403

    # Apply filters from query params
    quarter = request.args.get('quarter')
    year = request.args.get('year')
    district_id = request.args.get('district_id')
    report_type = request.args.get('report_type')
    status = request.args.get('status')
    if quarter:
        query = query.filter_by(quarter=int(quarter))
    if year:
        query = query.filter_by(year=int(year))
    if district_id:
        query = query.filter_by(district_id=int(district_id))
    if report_type:
        query = query.filter_by(report_type=report_type)
    if status:
        query = query.filter_by(status=status)

    reports = query.all()
    result = [{
        'id': r.id,
        'district': r.district.name,
        'district_id': r.district_id,
        'quarter': r.quarter,
        'year': r.year,
        'report_type': r.report_type,
        'status': r.status,
        'submitted_at': r.submitted_at,
        'data': r.data
    } for r in reports]
    return jsonify(result), 200

@reports_bp.route('/consolidated', methods=['GET'])
@jwt_required()
def consolidated_reports():
    # Only for executive_secretary and president
    user = User.query.get(get_jwt_identity())
    if not user.official_designation or user.official_designation.designation_type not in ['executive_secretary', 'president']:
        return jsonify({'error': 'Not authorized'}), 403

    # Get summary by district, quarter, year, report_type
    results = db.session.query(
        Report.district_id,
        District.name.label('district_name'),
        Report.quarter,
        Report.year,
        Report.report_type,
        func.count(Report.id).label('total_reports'),
        func.sum(case([(Report.status == 'submitted', 1)], else_=0)).label('submitted'),
        func.sum(case([(Report.status == 'reviewed', 1)], else_=0)).label('reviewed'),
        func.sum(case([(Report.status == 'approved', 1)], else_=0)).label('approved'),
        func.sum(case([(Report.status == 'rejected', 1)], else_=0)).label('rejected')
    ).join(District).group_by(Report.district_id, District.name, Report.quarter, Report.year, Report.report_type).all()

    # Convert to dict
    output = []
    for row in results:
        output.append({
            'district_id': row.district_id,
            'district_name': row.district_name,
            'quarter': row.quarter,
            'year': row.year,
            'report_type': row.report_type,
            'total_reports': row.total_reports,
            'submitted': row.submitted,
            'reviewed': row.reviewed,
            'approved': row.approved,
            'rejected': row.rejected,
        })
    return jsonify(output), 200