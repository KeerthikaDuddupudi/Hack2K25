require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Doctor = require("./models/Doctor");
const connectDB = require("./config/db");

const seedDoctor = async () => {
  await connectDB();

  const hashedPassword = await bcrypt.hash("doctor123", 10);

  await Doctor.create({
    name: "keerthika",
    email: "keerthikadjnp@gmail.com",
    password: hashedPassword,
  });

  console.log("✅ Doctor created successfully");
  process.exit();
};

seedDoctor();
