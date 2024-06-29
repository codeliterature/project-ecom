const jwt = require("jsonwebtoken");
const express = require("express");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const Jwtsecret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).json({ error: "Unauthorized: Token not provided" });
    }
    try {
        const data = jwt.verify(token, jwtsecret);
        req.user = data.user;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Unauthorized: Token expired" });
        } else if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
};

module.exports = authMiddleware;
