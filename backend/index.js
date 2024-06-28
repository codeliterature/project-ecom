const express = require('express');
const passport = require('passport');
const session = require('express-session');
const connection = require('./config/dbConnect');
require('./controllers/auth');
require('dotenv').config({ path: __dirname + '/.env' });

const app = express();
app.use(express.json());

const URI = process.env.DB_URI;
const PORT = process.env.PORT || 5000;

app.use(session({
    secret: 'keyroad',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000 
    }
}));

app.use(passport.initialize());
app.use(passport.session());


connection(URI)
    .then(() => {
        console.log('Connection Successful.');
    })
    .catch((error) => {
        console.error(error);
    });

app.use('/api/v1/auth', require('./routes/userRoutes'));

app.get('/auth/google/callback', 
    passport.authenticate('google', {
        failureRedirect: '/api/v1/auth/failure',
        successRedirect: '/api/v1/auth/protected'
    })
);

app.get('/', (req, res) => {
    let link = '/api/v1/auth/google';
    res.send(`Click Here: <a href="${link}">OAuth</a>`);
});

app.listen(PORT, () => {
    console.log(`Server is Running on PORT ${PORT}`);
});
