// Load Express module
const express = require('express');
// Create new router object
const router = express.Router();

const mongoose = require('mongoose');
const passport = require('passport');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const validatePostInput = require('../../validation/post');

// GET request handled by router
router.get('/test', (req, res) => res.json({msg: "Posts works"}));

// GET request to fetch all posts
router.get('/', (req, res) => {
  // Get all posts in database
  Post.find()
    .sort({date: -1})
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: 'No posts exist' }));
});

// GET request to fetch a single post by id
router.get('/:id', (req, res) => {
  // Search for a post with a specific id
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ nopostfound: 'No post found with that id' }));
});

// POST request to create post
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {

  // Call validation helper function
  const { errors, isValid } = validatePostInput(req.body);

  // One or more errors were returned by helper function
  if(!isValid) {
    return res.status(400).json(errors);
  }

  // Create new post using Post model
  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  // Save and return newly created post
  newPost.save().then(post => res.json(post));
});

// DELETE request to delete post by id
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

  // Find the user who wants to delete a post
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      // Find the post to be deleted
      Post.findById(req.params.id)
      .then(post => {
        // Ensure that a post can only be deleted by the user that created it
        if(post.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: 'User not authorized' });
        }
        // Remove post and return
        post.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    })
});

// POST request to like a post
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

  // Find the user who wants to like a post
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      // Find the post to be liked
      Post.findById(req.params.id)
      .then(post => {
        // If user already in post's like array, do not allow user to like again
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
          return res.status(400).json({ alreadyliked: 'User already liked this post' });
        }
        // Add user to post's like array, save, and return
        post.likes.unshift({ user: req.user.id });
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    })
});

// POST request to unlike a post
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

  // Find the user who wants to unlike a post
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      // Find the post to be unliked
      Post.findById(req.params.id)
      .then(post => {
        // Do not allow a user to unlike a post they never liked 
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
          return res.status(400).json({ notliked: 'You have not liked this post yet' });
        }
        // Find index of like to delete in like array
        const removeIndex = post.likes
          .map(item => item.user.toString())
          .indexOf(req.user.id);
        // Remove like and return
        post.likes.splice(removeIndex, 1);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    })
});

// POST request to add a comment to a post
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

  // Call validation helper function
  const { errors, isValid } = validatePostInput(req.body);

  // One or more errors were returned by helper function
  if(!isValid) {
    return res.status(400).json(errors);
  }

  // Find post to be commented on
  Post.findById(req.params.id)
    .then(post => {
      // Create new comment object
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      }
      // Add new comment object to comment array, save, and return
      post.comments.unshift(newComment);
      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
});

// DELETE request to remove comment from a post
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {

  // Find post whose comment is to be deleted
  Post.findById(req.params.id)
    .then(post => {
      // If a post does not have a comment with the specified comment id, return an error
      if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
        return res.status(404).json({ commentnotexists: 'Comment does not exist' });
      }
      // Find index of comment to delete in comment array
      const removeIndex = post.comments
        .map(item => item._id.toString())
        .indexOf(req.params.comment_id);
        // Remove comment and return
        post.comments.splice(removeIndex, 1);
        post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
});

// Return router object as the result of require call
module.exports = router;