"use client"

import { useState, useRef } from "react"
import { Card, Button, Alert } from "react-bootstrap"
import { Upload, FileText, X } from "lucide-react"

const FileUploadZone = ({ onFileSelect, selectedFile, accept = ".pdf", maxSize = 16 * 1024 * 1024 }) => {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelection(files[0])
    }
  }

  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFileSelection(e.target.files[0])
    }
  }

  const handleFileSelection = (file) => {
    setError("")

    // Validate file type
    if (accept && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are allowed")
      return
    }

    // Validate file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`)
      return
    }

    onFileSelect(file)
  }

  const handleRemoveFile = () => {
    onFileSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div>
      {!selectedFile ? (
        <Card
          className={`file-upload-area ${dragOver ? "dragover" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Card.Body className="text-center py-4">
            <Upload size={48} className="text-muted mb-3" />
            <h6 className="fw-bold mb-2">Drop your PDF file here</h6>
            <p className="text-muted mb-3">or</p>
            <Button variant="outline-primary" onClick={() => fileInputRef.current?.click()}>
              Browse Files
            </Button>
            <p className="text-muted small mt-3 mb-0">Maximum file size: {Math.round(maxSize / (1024 * 1024))}MB</p>
          </Card.Body>
        </Card>
      ) : (
        <Card className="border-success">
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <FileText size={24} className="text-success me-3" />
                <div>
                  <h6 className="mb-1">{selectedFile.name}</h6>
                  <small className="text-muted">{formatFileSize(selectedFile.size)} • PDF Document</small>
                </div>
              </div>
              <Button variant="outline-danger" size="sm" onClick={handleRemoveFile}>
                <X size={16} />
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {error && (
        <Alert variant="danger" className="mt-2 mb-0">
          {error}
        </Alert>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        style={{ display: "none" }}
      />
    </div>
  )
}

export default FileUploadZone
