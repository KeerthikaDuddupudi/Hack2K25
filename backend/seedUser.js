require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const connectDB = require("./config/db");

const seedUser = async () => {
  await connectDB();

  const hashedPassword = await bcrypt.hash("123456", 10);

  await User.create({
    name: "keerthi",
    email: "keerthikaduddupudi@gmail.com",
    password: hashedPassword,
  });

  console.log("✅ User created successfully");
  process.exit();
};

seedUser();
