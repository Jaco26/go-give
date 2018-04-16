var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;
var pool = require('../modules/pool.js');

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "https://localhost:4430/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'birthday','first_name', 'last_name',
      'middle_name', 'gender', 'link', 'picture']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('Facebook profile', profile, profile.picture);

    // TODO: connect with your databse and create or get user
    // let user = {};

    pool.query('SELECT * FROM users WHERE fb_id = $1;', [profile.id]).then((result) => {
      if(result.rows.length === 0) {
        pool.query('INSERT INTO users (name, fb_id, first_name, last_name) VALUES ($1, $2, $3, $4);',
                    [profile.displayName, profile.id, profile.name.givenName, profile.name.familyName])
          .then((result) => {
            console.log('registered new user');
            pool.query('SELECT * FROM users WHERE fb_id = $1;', [profile.id]).then((result) => {
              if(result.rows.length === 0) {
                done(null, false);
              } else {
                let foundUser = result.rows[0];
                console.log('found user', foundUser);
                done(null, foundUser);
              }
            }).catch((err) => {
              done(null, false);
            })
          })
          .catch((err) => {
            console.log('error in new user post', err);
            done(null, false);
          })
      } else {

        let foundUser = result.rows[0];
        console.log('found user', foundUser);
        // user.name = foundUser.name;
        // user.id = foundUser.id;
        // TODO: Add profile url and other properties
        done(null, foundUser);
      }
    }).catch((err) => {
      console.log('error in new user post', err);
      response.sendStatus(500);
      done(null, false);
    })
  }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('called deserializeUser - pg');

    pool.query("SELECT * FROM users WHERE id = $1", [id], function(err, result) {

      // Handle Errors
      if(err) {
        console.log('query err ', err);
        done(err);
      }

      user = result.rows[0];

      if(!user) {
          // user not found
          return done(null, false, {message: 'Incorrect credentials.'});
      } else {
        // user found
        console.log('User row ', user);
        done(null, user);
      }

    });
});

module.exports = passport;
