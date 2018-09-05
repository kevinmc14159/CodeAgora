const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define mongoose schema that maps to mongoDB collection
const UserSchema = new Schema({
  // Users have a name, email, password, avatar, and date 
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
});

module.exports = User = mongoose.model('users', UserSchema);