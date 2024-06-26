const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const saltRounds = 10;
const Jwtsecret = process.env.JWT_SECRET;

// Signup function
const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user){
      return res.status(400).json({ status: "failure", error: "Email already exists" });
    }
    const username = email.split("@")[0];
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userData = {
      username,
      email,
      password: hashedPassword,
    };
    const newUser = await User.create(userData);
    const data = {
      newUser : {
        id: newUser.id,
        role: newUser.role
      }
    }
    const token = jwt.sign(data, Jwtsecret);
    
    res.status(201).json({ status: 201, message: "User created successfully", token });
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
    const data = {
      user : {
        id: user.id,
        role: user.role
      }
    }
    const token = jwt.sign(data, Jwtsecret);
    res.status(200).json({ status: 200, message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

const userDetail = async(req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.log("error, something occured", error);
    res.status(500)
  }
}


module.exports = { signup, login, userDetail };
