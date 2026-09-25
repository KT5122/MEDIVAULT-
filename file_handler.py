"""
File handling utilities for MediVault
"""
import os
import uuid
import mimetypes
from werkzeug.utils import secure_filename
from flask import current_app

class FileHandler:
    """Handle file upload, validation, and storage operations"""
    
    ALLOWED_EXTENSIONS = {'pdf'}
    MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB
    
    @staticmethod
    def allowed_file(filename):
        """Check if file extension is allowed"""
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in FileHandler.ALLOWED_EXTENSIONS
    
    @staticmethod
    def validate_file(file):
        """Validate uploaded file"""
        errors = []
        
        if not file:
            errors.append("No file provided")
            return errors
        
        if file.filename == '':
            errors.append("No file selected")
            return errors
        
        if not FileHandler.allowed_file(file.filename):
            errors.append("Only PDF files are allowed")
        
        # Check file size (this is approximate, actual size check happens in Flask config)
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)  # Reset file pointer
        
        if file_size > FileHandler.MAX_FILE_SIZE:
            errors.append(f"File size must be less than {FileHandler.MAX_FILE_SIZE // (1024 * 1024)}MB")
        
        if file_size == 0:
            errors.append("File is empty")
        
        return errors
    
    @staticmethod
    def save_file(file, upload_folder):
        """Save file to upload folder with unique name"""
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder, exist_ok=True)
        
        # Generate unique filename
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(upload_folder, unique_filename)
        
        # Save file
        file.save(file_path)
        
        return {
            'filename': unique_filename,
            'file_path': file_path,
            'original_filename': secure_filename(file.filename),
            'file_size': os.path.getsize(file_path)
        }
    
    @staticmethod
    def delete_file(file_path):
        """Delete file from filesystem"""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                return True
        except Exception as e:
            current_app.logger.error(f"Error deleting file {file_path}: {str(e)}")
        return False
    
    @staticmethod
    def get_file_info(file_path):
        """Get file information"""
        if not os.path.exists(file_path):
            return None
        
        stat = os.stat(file_path)
        return {
            'size': stat.st_size,
            'modified': stat.st_mtime,
            'mime_type': mimetypes.guess_type(file_path)[0]
        }
    
    @staticmethod
    def format_file_size(size_bytes):
        """Format file size in human readable format"""
        if size_bytes == 0:
            return "0 B"
        
        size_names = ["B", "KB", "MB", "GB"]
        i = 0
        while size_bytes >= 1024 and i < len(size_names) - 1:
            size_bytes /= 1024.0
            i += 1
        
        return f"{size_bytes:.1f} {size_names[i]}"
