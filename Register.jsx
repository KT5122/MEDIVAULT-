"use client"

import { useState } from "react"
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { toast } from "react-toastify"
import { FileText, Mail, Lock, User, CreditCard } from "lucide-react"

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    user_type: "patient",
    license_number: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    // Validate doctor license number
    if (formData.user_type === "doctor" && !formData.license_number.trim()) {
      setError("License number is required for doctors")
      setLoading(false)
      return
    }

    const registrationData = {
      email: formData.email,
      password: formData.password,
      first_name: formData.first_name,
      last_name: formData.last_name,
      user_type: formData.user_type,
      license_number: formData.user_type === "doctor" ? formData.license_number : undefined,
    }

    const result = await register(registrationData)

    if (result.success) {
      toast.success("Registration successful!")
      navigate("/dashboard")
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <FileText size={48} className="text-primary mb-3" />
                <h2 className="fw-bold">Create Account</h2>
                <p className="text-muted">Join MediVault today</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <User size={16} className="me-2" />
                        First Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="Enter first name"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <User size={16} className="me-2" />
                        Last Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Enter last name"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <Mail size={16} className="me-2" />
                    Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Account Type</Form.Label>
                  <Form.Select name="user_type" value={formData.user_type} onChange={handleChange} required>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                  </Form.Select>
                </Form.Group>

                {formData.user_type === "doctor" && (
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <CreditCard size={16} className="me-2" />
                      Medical License Number
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="license_number"
                      value={formData.license_number}
                      onChange={handleChange}
                      placeholder="Enter your license number"
                      required
                    />
                  </Form.Group>
                )}

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <Lock size={16} className="me-2" />
                        Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>
                        <Lock size={16} className="me-2" />
                        Confirm Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm password"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button type="submit" variant="primary" size="lg" className="w-100 mb-3" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="loading-spinner me-2"></span>
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Form>

              <div className="text-center">
                <p className="mb-0">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary fw-bold">
                    Sign in here
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Register
