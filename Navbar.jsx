"use client"
import { Navbar as BootstrapNavbar, Nav, Container, Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { FileText, LogOut, User } from "lucide-react"

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <BootstrapNavbar bg="white" expand="lg" className="shadow-sm">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <FileText className="me-2" size={24} />
          MediVault
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/dashboard" className="me-3">
                  Dashboard
                </Nav.Link>
                <div className="d-flex align-items-center me-3">
                  <User size={16} className="me-1" />
                  <span className="me-2">
                    {user?.first_name} {user?.last_name}
                  </span>
                  <span className={`user-type-badge user-type-${user?.user_type}`}>{user?.user_type}</span>
                </div>
                <Button variant="outline-primary" size="sm" onClick={handleLogout}>
                  <LogOut size={16} className="me-1" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="me-2">
                  Login
                </Nav.Link>
                <Button as={Link} to="/register" variant="primary" size="sm">
                  Register
                </Button>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  )
}

export default Navbar
