// Configure passport for JWT
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys');

// Create object literal for new JwtStrategy(options, verify)
const opts = {};
// Return JWT from headers
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  // JWT authentication strategy
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    // jwt_payload is now an object literal containing decoded JWT payload
    User.findById(jwt_payload.id)
      .then(user => {
        // JWT contained valid user identification
        if(user){
          return done(null, user);
        }
        // JWT contained invalid user identification
        return done(null, false);
      })
      .catch(err => console.log(err));
  }));
};