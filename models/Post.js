const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define mongoose schema that maps to mongoDB collection
const PostSchema = new Schema({
  // Associate a user with a post
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  // Likes is an array of users that liked a post
  likes: [
    {
      // Associate a user with a like
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  // Comments is an array of comment objects with comment fields
  comments: [
    {
      // Associate a user with a comment
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model('post', PostSchema);