const express = require("express");
const Product = require("../models/Product");

const addProducts = async (req, res) => {
  try {
    const userRole = req.user.role;
    if (userRole == "admin") {
      const { title, cost, price, category, stockQuantity } = req.body;
      const newProduct = await Product.create({
        title,
        cost,
        price,
        category,
        stockQuantity,
      });
      res
        .status(201)
        .json({
          status: 201,
          message: "Product added successfully",
          newProduct,
        });
    } else {
      res.status(401).json({ status: 401, message: "Unauthorized Access" });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

module.exports = { addProducts };
