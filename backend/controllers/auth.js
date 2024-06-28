const passport = require("passport");

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: "1091061749333-6eo1tikrqkots8i3r2fkcbqfime6ac2g.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:5000/auth/google/callback"
},
function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
    });
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});