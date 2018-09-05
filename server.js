// Load Express module
const express = require('express');
// Load Mongoose module
const mongoose = require('mongoose');

// Load body-parser to extract data in POST requests into req.body
const bodyParser = require('body-parser');
// Load passport module
const passport = require('passport');

// Load users.js module
const users = require('./routes/api/users');
// Load profile.js module
const profile = require('./routes/api/profile');
// Load posts.js module
const posts = require('./routes/api/posts');

// Create a new Express instance
const app = express();

// Middleware that only parses urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// Middleware that only parses json
app.use(bodyParser.json());

// DB config
const db = require('./config/keys').mongoURI;
// Connect to MongoDB through mongoose
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected')) // Success
  .catch(err => console.log(err)); // Error

// Passport middleware
app.use(passport.initialize());
// Passport Config
require('./config/passport')(passport);

// Use middleware to handle routes via router objects
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// Listen on correct port based on environment variable otherwise default to 5000
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));