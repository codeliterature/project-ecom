const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const saltRounds = 10;

// Signup function
const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const username = email.split("@")[0];
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userData = {
      username,
      email,
      password: hashedPassword,
    };
    const newUser = new User(userData);
    const savedUser = await newUser.save();
    res.status(201).json({ status: 201, message: "User created successfully", user: savedUser });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

// Login function
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: 401, message: "Invalid credentials" });
    }
    res.status(200).json({ status: 200, message: "Login successful", user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

module.exports = { signup, login };
