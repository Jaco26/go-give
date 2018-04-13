const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const env = require('dotenv').config();
//pem for generating our own SSL Certificate
let pem = require('pem')
//need to be on https for facebook
let https = require('https')

var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "https://localhost:4430/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('Facebook profile', profile);

    // TODO: connect with your databse and create or get user

    done(null, {username: 'blah'}); // <-
  }
));

//pem generates our SSL Certifiace here
pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
  if (err) {
    throw err
  }
//Keys for https are used here
https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(4430)
console.log('listening on port 4430');
})

// Body parser middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Serve static files
app.use(express.static('server/public'));

// Route includes
const stripeRouter = require('./routes/stripe.router');
const nonprofitRouter = require('./routes/nonprofit.router');
const feedRouter = require('./routes/feed.router');
const reportRouter = require('./routes/report.router');
const userRouter = require('./routes/user.router');
const authRouter = require('./routes/auth.router');

/* Routes */
app.use('/stripe', stripeRouter);
app.use('/nonprofit', nonprofitRouter);
app.use('/feed', feedRouter);
app.use('/report', reportRouter);
app.use('/user', userRouter);
app.use('/auth', authRouter);



// This Code below is the leftover listen from the original server

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log('Server ready on PORT:', PORT);
// });
