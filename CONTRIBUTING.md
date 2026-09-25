# Contributing to MediVault

Thank you for your interest in contributing to MediVault! This document provides guidelines and information for contributors.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:
- Be respectful and inclusive
- Focus on constructive feedback
- Help maintain a welcoming environment for all contributors

## Getting Started

### Development Setup

1. **Fork the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/medivault.git
   cd medivault
   \`\`\`

2. **Set up development environment**
   \`\`\`bash
   ./run_local.sh setup
   \`\`\`

3. **Create a feature branch**
   \`\`\`bash
   git checkout -b feature/your-feature-name
   \`\`\`

### Development Workflow

1. Make your changes
2. Test your changes thoroughly
3. Update documentation if needed
4. Commit with clear, descriptive messages
5. Push to your fork
6. Create a pull request

## Contribution Guidelines

### Code Style

#### Python (Backend)
- Follow PEP 8 style guidelines
- Use meaningful variable and function names
- Add docstrings to functions and classes
- Keep functions focused and small
- Use type hints where appropriate

\`\`\`python
def upload_report(file: FileStorage, title: str, patient_id: int) -> dict:
    """
    Upload a medical report file.
    
    Args:
        file: The uploaded file
        title: Report title
        patient_id: ID of the patient
        
    Returns:
        dict: Upload result with report information
    """
    pass
\`\`\`

#### JavaScript/React (Frontend)
- Use ES6+ features
- Follow React best practices
- Use meaningful component and variable names
- Keep components focused and reusable
- Use PropTypes or TypeScript for type checking

\`\`\`jsx
const ReportCard = ({ report, onDownload, showPatient = false }) => {
  // Component implementation
}
\`\`\`

### Commit Messages

Use clear, descriptive commit messages:
- `feat: add patient search functionality`
- `fix: resolve file upload validation issue`
- `docs: update API documentation`
- `refactor: improve error handling in auth`
- `test: add unit tests for report model`

### Pull Request Process

1. **Before submitting:**
   - Ensure all tests pass
   - Update documentation
   - Check code style compliance
   - Test in both development and production-like environments

2. **Pull request description should include:**
   - Clear description of changes
   - Screenshots for UI changes
   - Testing instructions
   - Any breaking changes

3. **Review process:**
   - At least one maintainer review required
   - Address all feedback before merging
   - Squash commits if requested

## Types of Contributions

### Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, versions)
- Screenshots or error logs if applicable

### Feature Requests

For new features:
- Describe the problem you're solving
- Explain your proposed solution
- Consider alternative approaches
- Discuss potential impact on existing functionality

### Documentation

Documentation improvements are always welcome:
- Fix typos or unclear instructions
- Add examples or use cases
- Improve API documentation
- Update setup instructions

### Code Contributions

Areas where contributions are especially welcome:
- Bug fixes
- Performance improvements
- Security enhancements
- Test coverage improvements
- Accessibility improvements
- Mobile responsiveness
- Internationalization

## Development Guidelines

### Testing

#### Backend Testing
\`\`\`python
# Example test structure
import pytest
from app import app, db
from models import User, Report

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.drop_all()

def test_user_registration(client):
    response = client.post('/api/register', json={
        'email': 'test@example.com',
        'password': 'testpass123',
        'first_name': 'Test',
        'last_name': 'User',
        'user_type': 'patient'
    })
    assert response.status_code == 201
\`\`\`

#### Frontend Testing
\`\`\`jsx
// Example component test
import { render, screen, fireEvent } from '@testing-library/react'
import ReportCard from '../components/ReportCard'

test('renders report card with title', () => {
  const mockReport = {
    id: 1,
    title: 'Blood Test Results',
    doctor_name: 'Dr. Smith',
    uploaded_at: '2023-01-01T00:00:00Z'
  }
  
  render(<ReportCard report={mockReport} onDownload={jest.fn()} />)
  expect(screen.getByText('Blood Test Results')).toBeInTheDocument()
})
\`\`\`

### Database Migrations

When making database changes:
1. Create migration scripts
2. Test both upgrade and downgrade paths
3. Consider data migration needs
4. Update model documentation

### Security Considerations

Always consider security implications:
- Validate all user inputs
- Use parameterized queries
- Implement proper authentication checks
- Follow principle of least privilege
- Sanitize file uploads
- Protect against common vulnerabilities (XSS, CSRF, etc.)

## Project Structure

Understanding the codebase:

\`\`\`
medivault/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── models.py           # Database models
│   ├── utils/              # Utility functions
│   └── tests/              # Backend tests
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── utils/          # Frontend utilities
│   └── tests/              # Frontend tests
└── docs/                   # Documentation
\`\`\`

## Release Process

### Version Numbering
We follow Semantic Versioning (SemVer):
- MAJOR.MINOR.PATCH
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Version numbers updated
- [ ] Changelog updated
- [ ] Security review completed
- [ ] Performance testing done

## Getting Help

If you need help:
1. Check existing documentation
2. Search existing issues
3. Ask questions in discussions
4. Contact maintainers

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation

Thank you for contributing to MediVault!
