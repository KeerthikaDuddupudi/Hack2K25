const Appointment = require("../models/Appointment");

exports.createAppointment = async (req, res) => {
  const appointment = await Appointment.create(req.body);
  res.status(201).json(appointment);
};

exports.getAppointments = async (req, res) => {
  const appointments = await Appointment.find().sort({ createdAt: -1 });
  res.json(appointments);
};

exports.getSingleAppointment = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  res.json(appointment);
};

exports.updateStatus = async (req, res) => {
  const updated = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(updated);
};

exports.saveMeetLink = async (req, res) => {
  const updated = await Appointment.findByIdAndUpdate(
    req.params.id,
    { meet_link: req.body.meet_link },
    { new: true }
  );
  res.json(updated);
};

exports.deleteAppointment = async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.json({ message: "Appointment deleted" });
};
