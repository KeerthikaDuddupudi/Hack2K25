require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const Appointment = require("./models/Appointment");
const Doctor = require("./models/Doctor");
const authRoutes = require("./routes/authRoutes");
const auth = require("./middleware/auth");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

/* AUTH ROUTES */
app.use("/api/auth", authRoutes);

/* SOCKET */
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("join-doctor", (email) => socket.join(email));
});

app.set("io", io);

/* HEALTH */
app.get("/health", (req, res) => {
  res.json({ status: "Server running" });
});

/* CREATE APPOINTMENT */
app.post("/api/appointments", async (req, res) => {
  const saved = await Appointment.create(req.body);

  req.app
    .get("io")
    .to(req.body.doctor_email)
    .emit("new-appointment", saved);

  res.status(201).json(saved);
});

/* DOCTOR DASHBOARD */
app.get("/api/doctor/appointments", auth("doctor"), async (req, res) => {
  const doctor = await Doctor.findById(req.user.id);
  const data = await Appointment.find({
    doctor_email: doctor.email,
  }).sort({ createdAt: -1 });

  res.json(data);
});

/* UPDATE STATUS */
app.put("/api/appointments/:id/status", async (req, res) => {
  const updated = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(updated);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
