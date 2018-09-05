// Load Express module
const express = require('express');
// Create new router object
const router = express.Router();

const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const User = require('../../models/User');

// GET request handled by router
router.get('/test', (req, res) => res.json({msg: "Users works"}));

// Register user using POST method
router.post('/register', (req, res) => {
  // Call validation helper function
  const { errors, isValid } = validateRegisterInput(req.body);

  // One or more errors were returned by helper function
  if(!isValid) {
    return res.status(400).json(errors);
  }

  // Attempt to see if email is already in database
  User.findOne({ email: req.body.email })
    .then(user => {
      // Email is already registered
      if(user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
      } else { // Register new user
        // Attempt to load gravatar
        const avatar = gravatar.url(req.body.email, {
          s: '200', // Size
          r: 'pg', // Rating
          d: 'mm' // Default
        });

        // Create new user based on User model
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password // Unsecure
        });

        // Use bcrypt to generate salt and hash for password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) {
              throw err;
            }
            // Store hashed password into database
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
            })
        });
      }
    })
});

// Login user (return Token) using POST method
router.post('/login', (req, res) => {
  // Call validation helper function
  const { errors, isValid } = validateLoginInput(req.body);

  // One or more errors were returned by helper function
  if(!isValid) {
    return res.status(400).json(errors);
  }

  // Store login fields into variables
  const email = req.body.email;
  const password = req.body.password;

  // Attempt to see if email is already in database
  User.findOne({ email })
    .then(user => {
      // Account with specified email does not exist
      if(!user) {
        errors.email = 'User not found';
        return res.status(400).json(errors);
      }
      // Compare entered password with password stored in database
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          // Login successful
          if(isMatch) {   
            // Create payload segment of JWT
            const payload = { id: user.id, name: user.name, avatar: user.avatar }

            // Server encodes JWT for a user after a successful login
            jwt.sign(
              payload, 
              keys.secretOrKey, 
              { expiresIn: 3600 }, // Automatic timeout
              (err, token) => {
                // Send token as a response
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                });
            });
          } else {
            // Login unsuccessful
            errors.password = 'Password incorrect';
            return res.status(400).json(errors);
          }
        })
    });
});

// Return current user (private route) only if authenticated using JWT and passport
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

// Return router object as the result of require call
module.exports = router;