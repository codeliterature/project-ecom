const express = require("express");
const connection = require("./config/dbConnect");
require('dotenv').config({path: __dirname + '/.env'});

const app = express();
app.use(express.json());

const URI = process.env.DB_URI;
const PORT = 5000;


connection(URI)
    .then(() => {
        console.log("Connection Sucessfull.");
    })
    .catch((error) => {
        console.error(error);
    });

app.use("/api/v1/auth", require("./routes/userRoutes"));

app.listen(PORT, () => {
    console.log(`Server is Running on PORT ${PORT}`);
})