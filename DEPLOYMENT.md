# MediVault Deployment Guide

This guide covers deploying MediVault to production environments.

## Production Checklist

### Security
- [ ] Change all default passwords and secret keys
- [ ] Use strong SECRET_KEY and JWT_SECRET_KEY
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS for production domains
- [ ] Set up rate limiting
- [ ] Enable database connection pooling
- [ ] Configure secure file storage (AWS S3, etc.)

### Database
- [ ] Migrate from SQLite to PostgreSQL/MySQL
- [ ] Set up database backups
- [ ] Configure connection pooling
- [ ] Set up database monitoring

### Infrastructure
- [ ] Set up reverse proxy (nginx/Apache)
- [ ] Configure load balancing if needed
- [ ] Set up monitoring and logging
- [ ] Configure automated backups
- [ ] Set up SSL certificates

## Deployment Options

### Option 1: Traditional VPS/Server

#### Backend Deployment
\`\`\`bash
# Install system dependencies
sudo apt update
sudo apt install python3 python3-pip python3-venv nginx postgresql

# Clone repository
git clone <your-repo-url>
cd medivault

# Setup backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn psycopg2-binary

# Configure environment
cp .env.example .env
# Edit .env with production values

# Setup database
python manage.py create_db

# Test with gunicorn
gunicorn --bind 0.0.0.0:5000 app:app
\`\`\`

#### Frontend Deployment
\`\`\`bash
cd frontend
npm install
npm run build

# Copy build files to nginx
sudo cp -r dist/* /var/www/html/
\`\`\`

#### Nginx Configuration
\`\`\`nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
\`\`\`

### Option 2: Docker Deployment

#### Dockerfile (Backend)
\`\`\`dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
\`\`\`

#### Dockerfile (Frontend)
\`\`\`dockerfile
FROM node:16-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
\`\`\`

#### Docker Compose
\`\`\`yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/medivault
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  db:
    image: postgres:13
    environment:
      POSTGRES_DB: medivault
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
\`\`\`

### Option 3: Cloud Deployment (Heroku)

#### Backend (Heroku)
\`\`\`bash
# Install Heroku CLI
# Create Procfile
echo "web: gunicorn app:app" > backend/Procfile

# Deploy
cd backend
heroku create medivault-api
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set SECRET_KEY=your-secret-key
heroku config:set JWT_SECRET_KEY=your-jwt-secret
git add .
git commit -m "Deploy to Heroku"
git push heroku main
\`\`\`

#### Frontend (Vercel/Netlify)
\`\`\`bash
# Build command: npm run build
# Output directory: dist
# Environment variables: VITE_API_BASE_URL=https://your-api.herokuapp.com/api
\`\`\`

## Environment Variables

### Production Backend (.env)
\`\`\`env
SECRET_KEY=your-very-secure-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
DATABASE_URL=postgresql://username:password@localhost:5432/medivault
FLASK_ENV=production
UPLOAD_FOLDER=/var/uploads/medivault
MAX_CONTENT_LENGTH=16777216
\`\`\`

### Production Frontend (.env)
\`\`\`env
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_APP_NAME=MediVault
\`\`\`

## Database Migration

### From SQLite to PostgreSQL
\`\`\`python
# migration_script.py
import sqlite3
import psycopg2
from psycopg2.extras import RealDictCursor

def migrate_data():
    # Connect to SQLite
    sqlite_conn = sqlite3.connect('medivault.db')
    sqlite_conn.row_factory = sqlite3.Row
    
    # Connect to PostgreSQL
    pg_conn = psycopg2.connect(
        host="localhost",
        database="medivault",
        user="username",
        password="password"
    )
    
    # Migrate users table
    sqlite_cursor = sqlite_conn.cursor()
    pg_cursor = pg_conn.cursor()
    
    sqlite_cursor.execute("SELECT * FROM users")
    users = sqlite_cursor.fetchall()
    
    for user in users:
        pg_cursor.execute("""
            INSERT INTO users (id, email, password_hash, first_name, last_name, user_type, license_number, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, tuple(user))
    
    # Migrate reports table
    sqlite_cursor.execute("SELECT * FROM reports")
    reports = sqlite_cursor.fetchall()
    
    for report in reports:
        pg_cursor.execute("""
            INSERT INTO reports (id, filename, original_filename, file_path, title, description, doctor_id, patient_id, uploaded_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, tuple(report))
    
    pg_conn.commit()
    sqlite_conn.close()
    pg_conn.close()

if __name__ == "__main__":
    migrate_data()
\`\`\`

## Monitoring and Maintenance

### Health Check Endpoint
Add to Flask app:
\`\`\`python
@app.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0'
    })
\`\`\`

### Log Configuration
\`\`\`python
import logging
from logging.handlers import RotatingFileHandler

if not app.debug:
    file_handler = RotatingFileHandler('logs/medivault.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
\`\`\`

### Backup Script
\`\`\`bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/medivault"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
pg_dump medivault > $BACKUP_DIR/db_backup_$DATE.sql

# Backup uploaded files
tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz /var/uploads/medivault/

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
\`\`\`

## Performance Optimization

### Backend Optimizations
- Use connection pooling
- Implement caching (Redis)
- Optimize database queries
- Use CDN for file storage
- Enable gzip compression

### Frontend Optimizations
- Code splitting
- Lazy loading
- Image optimization
- Bundle analysis
- Service worker for caching

## Security Hardening

### Additional Security Measures
- Implement rate limiting
- Add request validation
- Set up Web Application Firewall (WAF)
- Regular security updates
- Penetration testing
- GDPR compliance measures

This deployment guide provides comprehensive instructions for taking MediVault from development to production.
