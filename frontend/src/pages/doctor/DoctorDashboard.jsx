import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Video,
  Bell,
  LogOut,
} from "lucide-react";
import { io } from "socket.io-client";
import "./DoctorDashboard.css";

/* 🔔 SOCKET CONNECTION */
const socket = io("http://localhost:5000");

function DoctorDashboard({ onLogout }) {
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedAppointments, setApprovedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("today");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  /* 🔐 LOGGED-IN DOCTOR + TOKEN */
  const doctor = JSON.parse(localStorage.getItem("doctor"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAppointments();

    /* 🔔 JOIN DOCTOR SOCKET ROOM */
    socket.emit("join-doctor", doctor.email);

    /* 🔔 LISTEN FOR NEW APPOINTMENT */
    socket.on("new-appointment", () => {
      fetchAppointments();
    });

    return () => {
      socket.off("new-appointment");
    };
  }, []);

  /* 👨‍⚕️ FETCH DOCTOR-ONLY APPOINTMENTS */
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/doctor/appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch");

      const today = new Date().toISOString().split("T")[0];

      setTodayAppointments(
        data.filter((apt) => apt.appointment_date === today)
      );
      setPendingRequests(data.filter((apt) => apt.status === "pending"));
      setApprovedAppointments(data.filter((apt) => apt.status === "confirmed"));
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ✅ UPDATE STATUS */
  const updateStatus = async (id, status) => {
    try {
      await fetch(
        `http://localhost:5000/api/appointments/${id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      fetchAppointments();
      setSelectedAppointment(null);
    } catch {
      alert("Failed to update status");
    }
  };

  const stats = {
    today: todayAppointments.length,
    pending: pendingRequests.length,
    approved: approvedAppointments.length,
    total:
      todayAppointments.length +
      pendingRequests.length +
      approvedAppointments.length,
  };

  const renderAppointmentList = (appointments, showActions = false) => {
    if (appointments.length === 0) {
      return (
        <div className="empty-list">
          <AlertCircle size={48} />
          <p>No appointments</p>
        </div>
      );
    }

    return (
      <div className="appointments-list">
        {appointments.map((apt, index) => (
          <div
            key={apt._id}
            className="appointment-item"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setSelectedAppointment(apt)}
          >
            <div className="apt-header">
              <div className="apt-patient">
                <div className="patient-avatar">
                  {apt.patient_name.charAt(0).toUpperCase()}
                </div>
                <div className="patient-details">
                  <h4>{apt.patient_name}</h4>
                  <p className="dept-tag">{apt.department}</p>
                </div>
              </div>
              <div className={`apt-status ${apt.status}`}>{apt.status}</div>
            </div>

            <div className="apt-times">
              <div className="time-info">
                <Calendar size={16} />
                <span>
                  {new Date(apt.appointment_date).toLocaleDateString()}
                </span>
              </div>
              <div className="time-info">
                <Clock size={16} />
                <span>{apt.appointment_time}</span>
              </div>
            </div>

            {showActions && apt.status === "pending" && (
              <div className="apt-actions">
                <button
                  className="btn-approve"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateStatus(apt._id, "confirmed");
                  }}
                >
                  Approve
                </button>
                <button
                  className="btn-reject"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateStatus(apt._id, "cancelled");
                  }}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="doctor-dashboard">
      <div className="dashboard-header">
        <div className="header-top">
          <div className="doctor-welcome">
            <div className="welcome-icon">👨‍⚕️</div>
            <div>
              <h1>Dr. Dashboard</h1>
              <p>Manage your appointments and consultations</p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              onLogout();
            }}
            className="btn-logout"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        <div className="notification-bar">
          <Bell size={20} />
          <span className="notification-text">
            You have {stats.pending} pending appointment requests
          </span>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-card stat-total">
          <Users size={24} />
          <span>{stats.total}</span>
        </div>
        <div className="stat-card stat-today">
          <Calendar size={24} />
          <span>{stats.today}</span>
        </div>
        <div className="stat-card stat-pending">
          <AlertCircle size={24} />
          <span>{stats.pending}</span>
        </div>
        <div className="stat-card stat-approved">
          <CheckCircle size={24} />
          <span>{stats.approved}</span>
        </div>
      </div>

      <div className="tabs-section">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "today" ? "active" : ""}`}
            onClick={() => setActiveTab("today")}
          >
            Today
          </button>
          <button
            className={`tab ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending
          </button>
          <button
            className={`tab ${activeTab === "approved" ? "active" : ""}`}
            onClick={() => setActiveTab("approved")}
          >
            Confirmed
          </button>
        </div>

        <div className="content-section">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          ) : (
            <>
              {activeTab === "today" &&
                renderAppointmentList(todayAppointments)}
              {activeTab === "pending" &&
                renderAppointmentList(pendingRequests, true)}
              {activeTab === "approved" &&
                renderAppointmentList(approvedAppointments)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
