"use client"
import { Card, Button, Badge } from "react-bootstrap"
import { FileText, Download, Calendar, User } from "lucide-react"

const ReportCard = ({ report, onDownload, showPatient = false, showDoctor = false }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getDaysAgo = (dateString) => {
    const days = Math.ceil((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24))
    return days === 1 ? "1 day ago" : `${days} days ago`
  }

  return (
    <Card className="report-item h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center">
            <FileText size={20} className="text-primary me-2" />
            <div>
              <h6 className="mb-1 fw-bold">{report.title}</h6>
              <Badge bg="secondary" className="small">
                PDF
              </Badge>
            </div>
          </div>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => onDownload(report.id, report.original_filename)}
            className="d-flex align-items-center"
          >
            <Download size={14} className="me-1" />
            Download
          </Button>
        </div>

        {report.description && <p className="text-muted small mb-3">{report.description}</p>}

        <div className="d-flex justify-content-between align-items-center text-muted small">
          <div className="d-flex align-items-center">
            <Calendar size={14} className="me-1" />
            <span>{formatDate(report.uploaded_at)}</span>
          </div>
          <span>{getDaysAgo(report.uploaded_at)}</span>
        </div>

        {(showPatient || showDoctor) && (
          <div className="mt-2 pt-2 border-top">
            {showPatient && (
              <div className="d-flex align-items-center text-muted small">
                <User size={14} className="me-1" />
                <span>Patient: {report.patient_name}</span>
              </div>
            )}
            {showDoctor && (
              <div className="d-flex align-items-center text-muted small">
                <User size={14} className="me-1" />
                <span>Doctor: {report.doctor_name}</span>
              </div>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default ReportCard
