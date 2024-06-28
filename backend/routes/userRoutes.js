const express = require("express");
const app = express();


app.get("/api/oauth", (req, res) => {
    res.send("Hello World");
});