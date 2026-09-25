from flask import Flask, request, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
from datetime import datetime, timedelta
import uuid

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///medivault.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    user_type = db.Column(db.String(20), nullable=False)  # 'doctor' or 'patient'
    license_number = db.Column(db.String(50), nullable=True)  # Only for doctors
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    uploaded_reports = db.relationship('Report', foreign_keys='Report.doctor_id', backref='doctor', lazy='dynamic')
    patient_reports = db.relationship('Report', foreign_keys='Report.patient_id', backref='patient', lazy='dynamic')

class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    patient_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

# Helper functions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() == 'pdf'

# Authentication routes
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'first_name', 'last_name', 'user_type']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Validate user type
        if data['user_type'] not in ['doctor', 'patient']:
            return jsonify({'error': 'Invalid user type'}), 400
        
        # For doctors, license number is required
        if data['user_type'] == 'doctor' and not data.get('license_number'):
            return jsonify({'error': 'License number is required for doctors'}), 400
        
        # Create new user
        user = User(
            email=data['email'],
            password_hash=generate_password_hash(data['password']),
            first_name=data['first_name'],
            last_name=data['last_name'],
            user_type=data['user_type'],
            license_number=data.get('license_number') if data['user_type'] == 'doctor' else None
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'user_type': user.user_type,
                'license_number': user.license_number
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not check_password_hash(user.password_hash, data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'user_type': user.user_type,
                'license_number': user.license_number
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'user_type': user.user_type,
                'license_number': user.license_number
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Patient management routes (for doctors)
@app.route('/api/patients', methods=['GET'])
@jwt_required()
def get_patients():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or user.user_type != 'doctor':
            return jsonify({'error': 'Access denied. Doctors only.'}), 403
        
        patients = User.query.filter_by(user_type='patient').all()
        
        return jsonify({
            'patients': [{
                'id': patient.id,
                'email': patient.email,
                'first_name': patient.first_name,
                'last_name': patient.last_name
            } for patient in patients]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Report management routes
@app.route('/api/reports/upload', methods=['POST'])
@jwt_required()
def upload_report():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or user.user_type != 'doctor':
            return jsonify({'error': 'Access denied. Doctors only.'}), 403
        
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Only PDF files are allowed'}), 400
        
        # Get form data
        title = request.form.get('title')
        description = request.form.get('description', '')
        patient_id = request.form.get('patient_id')
        
        if not title or not patient_id:
            return jsonify({'error': 'Title and patient ID are required'}), 400
        
        # Verify patient exists
        patient = User.query.filter_by(id=patient_id, user_type='patient').first()
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
        
        # Generate unique filename
        filename = str(uuid.uuid4()) + '.pdf'
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Save file
        file.save(file_path)
        
        # Create report record
        report = Report(
            filename=filename,
            original_filename=secure_filename(file.filename),
            file_path=file_path,
            title=title,
            description=description,
            doctor_id=user_id,
            patient_id=patient_id
        )
        
        db.session.add(report)
        db.session.commit()
        
        return jsonify({
            'message': 'Report uploaded successfully',
            'report': {
                'id': report.id,
                'title': report.title,
                'description': report.description,
                'original_filename': report.original_filename,
                'uploaded_at': report.uploaded_at.isoformat(),
                'patient_name': f"{patient.first_name} {patient.last_name}"
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/reports', methods=['GET'])
@jwt_required()
def get_reports():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if user.user_type == 'doctor':
            # Doctors see all reports they uploaded
            reports = Report.query.filter_by(doctor_id=user_id).all()
        else:
            # Patients see only their reports
            reports = Report.query.filter_by(patient_id=user_id).all()
        
        reports_data = []
        for report in reports:
            report_data = {
                'id': report.id,
                'title': report.title,
                'description': report.description,
                'original_filename': report.original_filename,
                'uploaded_at': report.uploaded_at.isoformat(),
                'doctor_name': f"{report.doctor.first_name} {report.doctor.last_name}",
                'patient_name': f"{report.patient.first_name} {report.patient.last_name}"
            }
            reports_data.append(report_data)
        
        return jsonify({'reports': reports_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/reports/<int:report_id>/download', methods=['GET'])
@jwt_required()
def download_report(report_id):
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        report = Report.query.get(report_id)
        if not report:
            return jsonify({'error': 'Report not found'}), 404
        
        # Check permissions
        if user.user_type == 'patient' and report.patient_id != user_id:
            return jsonify({'error': 'Access denied'}), 403
        elif user.user_type == 'doctor' and report.doctor_id != user_id:
            return jsonify({'error': 'Access denied'}), 403
        
        # Check if file exists
        if not os.path.exists(report.file_path):
            return jsonify({'error': 'File not found'}), 404
        
        return send_file(
            report.file_path,
            as_attachment=True,
            download_name=report.original_filename,
            mimetype='application/pdf'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
