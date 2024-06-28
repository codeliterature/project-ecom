const express = require("express");
const passport = require("passport");
const session = require("express-session");
const connection = require("./config/dbConnect");
require('./controllers/auth');
require('dotenv').config({ path: __dirname + '/.env' });

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

const app = express();
const URI = process.env.DB_URI;
const PORT = 5000;
const router = express.Router();

app.use(session({
    secret: 'keyroad',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());





connection(URI)
    .then(() => {
        console.log("Connection Successful.");
    })
    .catch((error) => {
        console.error(error);
    });



router.get("/", (req, res) => {
    let link = "/auth/google"
    res.send(`Click Here: <a href="${link}">OAuth</a>`);
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }));

app.get('/auth/google/callback', 
    passport.authenticate('google', {
        failureRedirect: '/failure',
        successRedirect : '/protected',
    }));

app.get("/failure", (req, res) => {
    res.send("failed to authenticate");
});

app.get("/protected", isLoggedIn, (req, res) => {
    console.log(req);
    let name = req.user.displayName;
    let email = req.user.emails[0].value;
    let photo = req.user.photos[0].value;
    res.send(`Hello ${name}, your email is ${email} and your profile picture is <img src="${photo}" alt="Profile Picture"/>`);
});

app.use(router);

app.listen(PORT, () => {
    console.log(`Server is Running on PORT ${PORT}`);
});
