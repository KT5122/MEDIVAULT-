"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Modal, Form, Table, Badge, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { toast } from "react-toastify"
import axios from "axios"
import { Upload, FileText, Users, Plus, Download, Calendar, User } from "lucide-react"

const DoctorDashboard = () => {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    patient_id: "",
    file: null,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [reportsResponse, patientsResponse] = await Promise.all([axios.get("/reports"), axios.get("/patients")])

      setReports(reportsResponse.data.reports)
      setPatients(patientsResponse.data.patients)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const handleUploadFormChange = (e) => {
    if (e.target.name === "file") {
      setUploadForm({
        ...uploadForm,
        file: e.target.files[0],
      })
    } else {
      setUploadForm({
        ...uploadForm,
        [e.target.name]: e.target.value,
      })
    }
  }

  const handleUploadSubmit = async (e) => {
    e.preventDefault()
    setUploadLoading(true)

    try {
      const formData = new FormData()
      formData.append("title", uploadForm.title)
      formData.append("description", uploadForm.description)
      formData.append("patient_id", uploadForm.patient_id)
      formData.append("file", uploadForm.file)

      await axios.post("/reports/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success("Report uploaded successfully!")
      setShowUploadModal(false)
      setUploadForm({
        title: "",
        description: "",
        patient_id: "",
        file: null,
      })
      fetchData() // Refresh the reports list
    } catch (error) {
      console.error("Upload error:", error)
      const message = error.response?.data?.error || "Failed to upload report"
      toast.error(message)
    } finally {
      setUploadLoading(false)
    }
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

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h1 className="display-6 fw-bold">Doctor Dashboard</h1>
          <p className="text-muted">
            Welcome back, Dr. {user.first_name} {user.last_name}
          </p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowUploadModal(true)} className="d-flex align-items-center">
            <Plus size={16} className="me-2" />
            Upload Report
          </Button>
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
              <Users size={32} className="text-success mb-2" />
              <h3 className="fw-bold">{patients.length}</h3>
              <p className="text-muted mb-0">Registered Patients</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="dashboard-card h-100">
            <Card.Body className="text-center">
              <Upload size={32} className="text-info mb-2" />
              <h3 className="fw-bold">
                {
                  reports.filter((r) => {
                    const uploadDate = new Date(r.uploaded_at)
                    const today = new Date()
                    return uploadDate.toDateString() === today.toDateString()
                  }).length
                }
              </h3>
              <p className="text-muted mb-0">Today's Uploads</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Reports */}
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Reports</h5>
              <Badge bg="primary">{reports.length} total</Badge>
            </Card.Header>
            <Card.Body>
              {reports.length === 0 ? (
                <Alert variant="info" className="text-center">
                  <FileText size={48} className="mb-3 opacity-50" />
                  <h6>No reports uploaded yet</h6>
                  <p className="mb-0">Click "Upload Report" to add your first medical report.</p>
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Report Title</th>
                        <th>Patient</th>
                        <th>Upload Date</th>
                        <th>File</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((report) => (
                        <tr key={report.id}>
                          <td>
                            <div>
                              <strong>{report.title}</strong>
                              {report.description && <div className="text-muted small">{report.description}</div>}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <User size={16} className="me-2 text-muted" />
                              {report.patient_name}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <Calendar size={16} className="me-2 text-muted" />
                              {formatDate(report.uploaded_at)}
                            </div>
                          </td>
                          <td>
                            <Badge bg="secondary" className="d-flex align-items-center w-fit">
                              <FileText size={12} className="me-1" />
                              PDF
                            </Badge>
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
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

      {/* Upload Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Upload Medical Report</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUploadSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Report Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={uploadForm.title}
                    onChange={handleUploadFormChange}
                    placeholder="e.g., Blood Test Results"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Patient *</Form.Label>
                  <Form.Select
                    name="patient_id"
                    value={uploadForm.patient_id}
                    onChange={handleUploadFormChange}
                    required
                  >
                    <option value="">Select a patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.first_name} {patient.last_name} ({patient.email})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={uploadForm.description}
                onChange={handleUploadFormChange}
                placeholder="Optional description or notes about this report"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>PDF File *</Form.Label>
              <Form.Control type="file" name="file" onChange={handleUploadFormChange} accept=".pdf" required />
              <Form.Text className="text-muted">Only PDF files are allowed. Maximum file size: 16MB</Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={uploadLoading} className="d-flex align-items-center">
              {uploadLoading ? (
                <>
                  <span className="loading-spinner me-2"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} className="me-2" />
                  Upload Report
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

export default DoctorDashboard
