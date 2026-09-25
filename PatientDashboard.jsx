"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Table, Badge, Alert, InputGroup, Form } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { toast } from "react-toastify"
import axios from "axios"
import { FileText, Download, Calendar, User, Search, Filter } from "lucide-react"

const PatientDashboard = () => {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [filteredReports, setFilteredReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    fetchReports()
  }, [])

  useEffect(() => {
    filterAndSortReports()
  }, [reports, searchTerm, sortBy])

  const fetchReports = async () => {
    try {
      const response = await axios.get("/reports")
      setReports(response.data.reports)
    } catch (error) {
      console.error("Error fetching reports:", error)
      toast.error("Failed to load your reports")
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortReports = () => {
    const filtered = reports.filter(
      (report) =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Sort reports
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.uploaded_at) - new Date(a.uploaded_at)
        case "oldest":
          return new Date(a.uploaded_at) - new Date(b.uploaded_at)
        case "title":
          return a.title.localeCompare(b.title)
        case "doctor":
          return a.doctor_name.localeCompare(b.doctor_name)
        default:
          return 0
      }
    })

    setFilteredReports(filtered)
  }

  const handleDownloadReport = async (reportId, filename) => {
    try {
      const response = await axios.get(`/reports/${reportId}/download`, {
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success("Report downloaded successfully!")
    } catch (error) {
      console.error("Download error:", error)
      toast.error("Failed to download report")
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRecentReports = () => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    return reports.filter((report) => new Date(report.uploaded_at) >= thirtyDaysAgo).length
  }

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p className="mt-2">Loading your reports...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h1 className="display-6 fw-bold">My Medical Reports</h1>
          <p className="text-muted">
            Welcome, {user.first_name} {user.last_name}
          </p>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="dashboard-card h-100">
            <Card.Body className="text-center">
              <FileText size={32} className="text-primary mb-2" />
              <h3 className="fw-bold">{reports.length}</h3>
              <p className="text-muted mb-0">Total Reports</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="dashboard-card h-100">
            <Card.Body className="text-center">
              <Calendar size={32} className="text-success mb-2" />
              <h3 className="fw-bold">{getRecentReports()}</h3>
              <p className="text-muted mb-0">Recent (30 days)</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="dashboard-card h-100">
            <Card.Body className="text-center">
              <User size={32} className="text-info mb-2" />
              <h3 className="fw-bold">{new Set(reports.map((r) => r.doctor_name)).size}</h3>
              <p className="text-muted mb-0">Doctors</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search and Filter */}
      <Row className="mb-4">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text>
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search reports by title, description, or doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <Filter size={16} />
            </InputGroup.Text>
            <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">By Title</option>
              <option value="doctor">By Doctor</option>
            </Form.Select>
          </InputGroup>
        </Col>
      </Row>

      {/* Reports List */}
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Your Medical Reports</h5>
              <Badge bg="primary">
                {filteredReports.length} of {reports.length} reports
              </Badge>
            </Card.Header>
            <Card.Body>
              {reports.length === 0 ? (
                <Alert variant="info" className="text-center">
                  <FileText size={48} className="mb-3 opacity-50" />
                  <h6>No medical reports yet</h6>
                  <p className="mb-0">
                    Your doctors will upload your medical reports here. You'll be able to view and download them once
                    they're available.
                  </p>
                </Alert>
              ) : filteredReports.length === 0 ? (
                <Alert variant="warning" className="text-center">
                  <Search size={48} className="mb-3 opacity-50" />
                  <h6>No reports match your search</h6>
                  <p className="mb-0">Try adjusting your search terms or filters to find what you're looking for.</p>
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Report Details</th>
                        <th>Doctor</th>
                        <th>Upload Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReports.map((report) => (
                        <tr key={report.id}>
                          <td>
                            <div>
                              <div className="d-flex align-items-center mb-1">
                                <FileText size={16} className="me-2 text-primary" />
                                <strong>{report.title}</strong>
                              </div>
                              {report.description && <div className="text-muted small ms-4">{report.description}</div>}
                              <div className="ms-4 mt-1">
                                <Badge bg="secondary" className="small">
                                  PDF Document
                                </Badge>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <User size={16} className="me-2 text-muted" />
                              <div>
                                <div className="fw-medium">{report.doctor_name}</div>
                                <div className="text-muted small">Attending Physician</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <Calendar size={16} className="me-2 text-muted" />
                              <div>
                                <div>{formatDate(report.uploaded_at)}</div>
                                <div className="text-muted small">
                                  {Math.ceil((new Date() - new Date(report.uploaded_at)) / (1000 * 60 * 60 * 24))} days
                                  ago
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleDownloadReport(report.id, report.original_filename)}
                              className="d-flex align-items-center"
                            >
                              <Download size={14} className="me-1" />
                              Download
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Help Section */}
      {reports.length === 0 && (
        <Row className="mt-4">
          <Col>
            <Card className="bg-light border-0">
              <Card.Body className="text-center py-4">
                <h6 className="fw-bold mb-3">How to Get Your Medical Reports</h6>
                <Row className="justify-content-center">
                  <Col md={8}>
                    <p className="text-muted mb-0">
                      Ask your doctor to upload your medical reports to MediVault. They can create an account and
                      securely share your test results, X-rays, prescriptions, and other medical documents with you.
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default PatientDashboard
