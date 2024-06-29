const express = require('express');
const router = express.Router();
const passport = require('passport');
const authMiddleware = require("../middleware/authMiddleware");


const { login, signup, userDetail } = require('../controllers/userController');

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

router.post('/signup', signup);
router.post('/login', login);
router.get("/getuser", authMiddleware, userDetail);


router.get('/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
);


router.get('/failure', (req, res) => {
    res.send('Failed to authenticate');
});

router.get('/protected', isLoggedIn, (req, res) => {
    let name = req.user.displayName;
    let email = req.user.emails[0].value;
    let photo = req.user.photos[0].value;
    res.send(`Hello ${name}, your email is ${email} and your profile picture is <img src="${photo}" alt="Profile Picture"/>`);
});

module.exports = router;
