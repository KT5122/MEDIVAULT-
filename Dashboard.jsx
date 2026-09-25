"use client"
import { useAuth } from "../contexts/AuthContext"
import DoctorDashboard from "../components/DoctorDashboard"
import PatientDashboard from "../components/PatientDashboard"

const Dashboard = () => {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return user.user_type === "doctor" ? <DoctorDashboard /> : <PatientDashboard />
}

export default Dashboard
