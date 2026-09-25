import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Shield, Users, Download, Code, Database, Smartphone } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MediVault</h1>
                <p className="text-sm text-gray-600">Secure Medical Records Management</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Ready for Download
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Complete Medical Records Management System</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A full-stack web application built with React and Flask that provides secure medical record management for
            doctors and patients.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-5 w-5" />
              Download ZIP
            </Button>
            <Button variant="outline" size="lg">
              <Code className="mr-2 h-5 w-5" />
              View Documentation
            </Button>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Technology Stack</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Code className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">React 18 + Vite</h4>
                <p className="text-sm text-gray-600">Modern frontend with fast development</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Database className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Flask + SQLAlchemy</h4>
                <p className="text-sm text-gray-600">Robust Python backend with ORM</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">JWT Authentication</h4>
                <p className="text-sm text-gray-600">Secure token-based auth system</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-orange-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Smartphone className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="font-semibold mb-2">Bootstrap 5</h4>
                <p className="text-sm text-gray-600">Responsive, mobile-first design</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Key Features</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-blue-600" />
                  For Doctors
                </CardTitle>
                <CardDescription>Comprehensive tools for medical professionals</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Secure account registration with license verification
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Upload PDF medical reports for patients
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Patient management dashboard
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    View and download all uploaded reports
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-green-600" />
                  For Patients
                </CardTitle>
                <CardDescription>Easy access to your medical records</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    Simple account registration process
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    View all medical reports from doctors
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    Download reports as PDF files
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    Search and filter reports by various criteria
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security Features */}
        <Card className="mb-16 bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-red-800">
              <Shield className="mr-2 h-6 w-6" />
              Security & Compliance
            </CardTitle>
            <CardDescription className="text-red-700">Built with healthcare data security in mind</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-red-800 mb-2">Authentication</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• JWT token-based authentication</li>
                  <li>• Secure password hashing</li>
                  <li>• Role-based access control</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-800 mb-2">File Security</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• PDF-only file uploads</li>
                  <li>• File size validation</li>
                  <li>• Secure file storage</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-800 mb-2">Data Protection</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• SQL injection prevention</li>
                  <li>• CORS protection</li>
                  <li>• Audit logging</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Start */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
            <CardDescription>Get MediVault running locally in minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Download & Extract</h4>
                  <p className="text-gray-600">Download the ZIP file and extract to your desired location</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Run Setup</h4>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">./run_local.sh setup</code>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Start Application</h4>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">./run_local.sh start</code>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold">Access Application</h4>
                  <p className="text-gray-600">
                    Frontend: <code className="bg-gray-100 px-2 py-1 rounded text-sm">http://localhost:3000</code>
                  </p>
                  <p className="text-gray-600">
                    Backend API: <code className="bg-gray-100 px-2 py-1 rounded text-sm">http://localhost:5000</code>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="mb-16 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Demo Accounts</CardTitle>
            <CardDescription className="text-blue-700">Pre-configured accounts for testing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-blue-800 mb-2">Doctor Account</h4>
                <p className="text-sm">
                  <strong>Email:</strong> doctor@medivault.com
                </p>
                <p className="text-sm">
                  <strong>Password:</strong> doctor123
                </p>
                <p className="text-sm">
                  <strong>License:</strong> MD123456
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-blue-800 mb-2">Patient Account</h4>
                <p className="text-sm">
                  <strong>Email:</strong> patient@medivault.com
                </p>
                <p className="text-sm">
                  <strong>Password:</strong> patient123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>System Requirements</CardTitle>
            <CardDescription>Prerequisites for running MediVault locally</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Backend Requirements</h4>
                <ul className="text-sm space-y-1">
                  <li>• Python 3.8 or higher</li>
                  <li>• pip package manager</li>
                  <li>• Virtual environment support</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Frontend Requirements</h4>
                <ul className="text-sm space-y-1">
                  <li>• Node.js 16 or higher</li>
                  <li>• npm package manager</li>
                  <li>• Modern web browser</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">MediVault - Built with React, Flask, and modern web technologies</p>
            <p className="text-sm text-gray-500 mt-2">Ready for local development and production deployment</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
