const passport = require("passport");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const Jwtsecret = process.env.JWT_SECRET;


const GoogleStrategy = require('passport-google-oauth20').Strategy;

const authUser = async (profile) => {
    let googleId = profile.id;
    const user = await User.findOne({ googleId });
    if (!user) {
        const userData = {
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
        };
        const newUser = new User(userData);
        const savedUser = await newUser.save();
        const token = jwt.sign({user : {id : savedUser._id.toString()}}, Jwtsecret);
        console.log("the token from oAuth", token);
    }
};


passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: "http://localhost:5000/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    console.log('Google Strategy Initialized');
    authUser(profile);
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});