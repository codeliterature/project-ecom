const express = require("express");
const connection = require("./config/dbConnect");
require('dotenv').config({path: __dirname + '/.env'});

const app = express();
const URI = process.env.DB_URI;
const PORT = 5000;


connection(URI)
    .then(() => {
        console.log("Connection Sucessfull.");
    })
    .catch((error) => {
        console.error(error);
    });

app.get("/", (req, res) => {
    res.send("Hello, World!");
})

app.listen(PORT, () => {
    console.log(`Server is Running on PORT ${PORT}`);
})