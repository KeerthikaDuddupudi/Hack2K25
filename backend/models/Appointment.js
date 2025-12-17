const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient_name: String,
    patient_email: String,
    patient_phone: String,

    appointment_date: String,
    appointment_time: String,
    department: String,

    doctor_name: String,
    doctor_email: String, // ✅ ADD THIS (important for doctor login)

    symptoms: String,

    status: {
      type: String,
      default: "pending",
    },

    meet_link: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
