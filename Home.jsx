import { Container, Row, Col, Button, Card } from "react-bootstrap"
import { Link } from "react-router-dom"
import { Shield, FileText, Users } from "lucide-react"

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">Secure Medical Records Management</h1>
              <p className="lead mb-4">
                MediVault provides a secure platform for doctors to upload medical reports and patients to access their
                health records anytime, anywhere.
              </p>
              <div className="d-flex gap-3">
                <Button as={Link} to="/register" variant="light" size="lg">
                  Get Started
                </Button>
                <Button as={Link} to="/login" variant="outline-light" size="lg">
                  Sign In
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="hero-image">
                <FileText size={200} className="text-white opacity-75" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold mb-3">Why Choose MediVault?</h2>
              <p className="lead text-muted">Built with security, simplicity, and accessibility in mind</p>
            </Col>
          </Row>

          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 text-center border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="feature-icon mx-auto">
                    <Shield size={24} />
                  </div>
                  <h5 className="fw-bold">Secure & Private</h5>
                  <p className="text-muted">
                    Your medical data is encrypted and protected with industry-standard security measures.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="h-100 text-center border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="feature-icon mx-auto">
                    <FileText size={24} />
                  </div>
                  <h5 className="fw-bold">Easy Document Management</h5>
                  <p className="text-muted">
                    Doctors can easily upload PDF reports, and patients can view and download them instantly.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="h-100 text-center border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="feature-icon mx-auto">
                    <Users size={24} />
                  </div>
                  <h5 className="fw-bold">Role-Based Access</h5>
                  <p className="text-muted">
                    Separate interfaces for doctors and patients with appropriate access controls.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center">
            <Col>
              <h3 className="fw-bold mb-3">Ready to Get Started?</h3>
              <p className="lead text-muted mb-4">
                Join thousands of healthcare professionals and patients using MediVault
              </p>
              <Button as={Link} to="/register" variant="primary" size="lg">
                Create Your Account
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Home
