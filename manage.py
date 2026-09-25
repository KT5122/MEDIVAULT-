#!/usr/bin/env python3
"""
MediVault Database Management Script
"""
import os
import sys
from app import app, db, User
from werkzeug.security import generate_password_hash

def create_db():
    """Create database tables"""
    print("Creating database tables...")
    with app.app_context():
        db.create_all()
        print("✅ Database tables created successfully!")

def seed_data():
    """Seed database with sample data"""
    print("Seeding database with sample data...")
    
    with app.app_context():
        # Check if data already exists
        if User.query.first():
            print("⚠️  Database already contains data. Skipping seed.")
            return
        
        # Create sample doctor
        doctor = User(
            email='doctor@medivault.com',
            password_hash=generate_password_hash('doctor123'),
            first_name='Dr. Sarah',
            last_name='Johnson',
            user_type='doctor',
            license_number='MD123456'
        )
        
        # Create sample patient
        patient = User(
            email='patient@medivault.com',
            password_hash=generate_password_hash('patient123'),
            first_name='John',
            last_name='Doe',
            user_type='patient'
        )
        
        db.session.add(doctor)
        db.session.add(patient)
        db.session.commit()
        
        print("✅ Sample data created successfully!")
        print("\n📋 Sample Accounts:")
        print("Doctor Login:")
        print("  Email: doctor@medivault.com")
        print("  Password: doctor123")
        print("\nPatient Login:")
        print("  Email: patient@medivault.com")
        print("  Password: patient123")

def reset_db():
    """Reset database (drop and recreate all tables)"""
    print("⚠️  Resetting database...")
    response = input("This will delete all data. Are you sure? (y/N): ")
    
    if response.lower() != 'y':
        print("❌ Database reset cancelled.")
        return
    
    with app.app_context():
        db.drop_all()
        db.create_all()
        print("✅ Database reset successfully!")

def main():
    """Main function to handle command line arguments"""
    if len(sys.argv) < 2:
        print("Usage: python manage.py <command>")
        print("\nAvailable commands:")
        print("  create_db  - Create database tables")
        print("  seed_data  - Seed database with sample data")
        print("  reset_db   - Reset database (WARNING: Deletes all data)")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == 'create_db':
        create_db()
    elif command == 'seed_data':
        seed_data()
    elif command == 'reset_db':
        reset_db()
    else:
        print(f"❌ Unknown command: {command}")
        sys.exit(1)

if __name__ == '__main__':
    main()
