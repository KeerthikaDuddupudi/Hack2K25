const express = require("express");
const {
  createAppointment,
  getAppointments,
  getSingleAppointment,
  updateStatus,
  saveMeetLink,
  deleteAppointment
} = require("../controllers/appointmentController");

const router = express.Router();

router.post("/", createAppointment);
router.get("/", getAppointments);
router.get("/:id", getSingleAppointment);
router.put("/:id/status", updateStatus);
router.put("/:id/meet-link", saveMeetLink);
router.delete("/:id", deleteAppointment);

module.exports = router;
