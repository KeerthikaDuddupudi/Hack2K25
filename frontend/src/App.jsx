import { useState } from "react";

import UserLogin from "./pages/user/UserLogin";
import DoctorLogin from "./pages/doctor/DoctorLogin";

import AppointmentBooking from "./pages/user/AppointmentBooking";
import BookingConfirmation from "./pages/user/BookingConfirmation";
import AppointmentList from "./pages/user/AppointmentList";

import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import AppointmentManagement from "./pages/doctor/AppointmentManagement";
import VideoConsultation from "./pages/doctor/VideoConsultation";

function App() {
  const [userRole, setUserRole] = useState(null);
  const [currentPage, setCurrentPage] = useState("login");

  const [bookingData, setBookingData] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  // ===== LOGIN =====
  const handleUserLogin = () => {
    setUserRole("patient");
    setCurrentPage("booking");
  };

  const handleDoctorLogin = () => {
    setUserRole("doctor");
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserRole(null);
    setCurrentPage("login");
  };

  // ===== PATIENT =====
  const handleBookingSuccess = (data) => {
    setBookingData(data);
    setCurrentPage("confirmation");
  };

  const handleViewAppointments = () => {
    setCurrentPage("list");
  };

  const handleBackToBooking = () => {
    setCurrentPage("booking");
  };

  // ===== DOCTOR =====
  const handleManageAppointment = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setCurrentPage("management");
  };

  const handleStartConsultation = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setCurrentPage("consultation");
  };

  const handleBackToDashboard = () => {
    setCurrentPage("dashboard");
  };

  return (
    <div className="app-container">
      {/* LOGIN */}
      {currentPage === "login" && (
        <>
          <UserLogin onLogin={handleUserLogin} />
          <DoctorLogin onLogin={handleDoctorLogin} />
        </>
      )}

      {/* PATIENT */}
      {userRole === "patient" && (
        <>
          {currentPage === "booking" && (
            <AppointmentBooking
              onSuccess={handleBookingSuccess}
              onViewAppointments={handleViewAppointments}
            />
          )}

          {currentPage === "confirmation" && (
            <BookingConfirmation
              bookingData={bookingData}
              onViewAppointments={handleViewAppointments}
              onBackToBooking={handleBackToBooking}
            />
          )}

          {currentPage === "list" && (
            <AppointmentList onBackToBooking={handleBackToBooking} />
          )}
        </>
      )}

      {/* DOCTOR */}
      {userRole === "doctor" && (
        <>
          {currentPage === "dashboard" && (
            <DoctorDashboard onLogout={handleLogout} />
          )}

          {currentPage === "management" && (
            <AppointmentManagement
              appointmentId={selectedAppointmentId}
              onBack={handleBackToDashboard}
            />
          )}

          {currentPage === "consultation" && (
            <VideoConsultation
              appointmentId={selectedAppointmentId}
              onBack={handleBackToDashboard}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
