const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Doctor = require("../models/Doctor");

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign(
    { id: user._id, role: "user" },
    process.env.JWT_SECRET
  );

  res.json({ token, user });
};

exports.loginDoctor = async (req, res) => {
  const { email, password } = req.body;

  const doctor = await Doctor.findOne({ email });
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });

  const isMatch = await bcrypt.compare(password, doctor.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign(
    { id: doctor._id, role: "doctor" },
    process.env.JWT_SECRET
  );

  res.json({ token, doctor });
};
