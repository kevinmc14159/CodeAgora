// Load Express module
const express = require('express');
// Create new router object
const router = express.Router();

const mongoose = require('mongoose');
const passport = require('passport');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// GET request handled by router
router.get('/test', (req, res) => res.json({msg: "Profile works"}));

// GET request to obtain current user's profile
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  // Attempt to find user in database
  Profile.findOne({ user: req.user.id })
    // Manually add name and avatar fields into profile
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      // No profile has been created for this user
      if(!profile){
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      // Profile found
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// GET request to retrieve all profiles
router.get('/all', (req, res) => {
  const errors = {};

  Profile.find()
    // Manually add name and avatar fields into profiles
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      // No profiles have been created
      if(!profiles) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors);
      }
      // Profiles found
      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: 'There are no profiles' }));
});

// GET request to retrieve profile by handle
router.get('/handle/:handle', (req, res) => {
  const errors = {};

  // Attempt to find user in database from handle
  Profile.findOne({ handle: req.params.handle })
    // Manually add name and avatar fields into profile
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      // No profile for specified handle
      if(!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
      // Profile found
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// GET request to retrieve profile by user id
router.get('/user/:user_id', (req, res) => {
  const errors = {};

  // Attempt to find user in database from user_id
  Profile.findOne({ user: req.params.user_id })
    // Manually add name and avatar fields into profile
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      // No profile for specified user_id
      if(!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
      // Profile found
      res.json(profile);
    })
    .catch(err => res.status(404).json({ profile: 'There is no profile for this user' }));
});

// POST request to create or edit user's profile
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {

  // Call validation helper function
  const { errors, isValid } = validateProfileInput(req.body);

  // One or more errors were returned by helper function
  if(!isValid) {
    return res.status(400).json(errors);
  }

  // Initialize profileFields object to store data entered
  const profileFields = {};
  profileFields.user = req.user.id;

  // Add fields to object only if they were entered by user
  if(req.body.handle) profileFields.handle = req.body.handle;
  if(req.body.company) profileFields.company = req.body.company;
  if(req.body.website) profileFields.website = req.body.website;
  if(req.body.location) profileFields.location = req.body.location;
  if(req.body.bio) profileFields.bio = req.body.bio;
  if(req.body.status) profileFields.status = req.body.status;
  if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

  // Split skills into array and add to profileFields object
  if(typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  }

  // Social media is contained in an object
  profileFields.social = {};

  // Add fields to object only if they were entered by user
  if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

  // Check to see if profile already exists for this user_id
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      // If a profile already exists, update all fields
      if(profile) {
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        )
        // Return updated profile
        .then(profile => res.json(profile));
      } else { // Profile does not exist so it must be created
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if(profile) {
            // Prevent a user from changing their handle to an already existing handle
            errors.handle = 'That handle already exists';
            res.status(400).json(errors);
          }
          // Create new profile with specified fields, save, and return
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    })
});

// POST request to add an experience
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {

  // Call validation helper function
  const { errors, isValid } = validateExperienceInput(req.body);

  // One or more errors were returned by helper function
  if(!isValid) {
    return res.status(400).json(errors);
  }

  // Find the user who wants to add an experience
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      // Create newExp object to hold experience data submitted by user
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      }
      // Add experience to profile, save, and return
      profile.experience.unshift(newExp);
      profile.save().then(profile => res.json(profile));
    })
});

// POST request to add an education
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {

  // Call validation helper function
  const { errors, isValid } = validateEducationInput(req.body);

  // One or more errors were returned by helper function
  if(!isValid) {
    return res.status(400).json(errors);
  }

  // Find the user who wants to add an education
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      // Create newEdu object to hold education data submitted by user
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      }
      // Add education to profile, save, and return
      profile.education.unshift(newEdu);
      profile.save().then(profile => res.json(profile));
    })
});

// DELETE request to delete an experience
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {

  // Find the user who wants to delete an experience
  Profile.findOne({ user: req.user.id }).then(profile => {
    // Find index of experience to delete in experience array 
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);
    // Remove experience and return
    profile.experience.splice(removeIndex, 1);
    profile.save().then(profile => res.json(profile));
  })
  .catch(err => res.status(404).json(err));
});

// DELETE request to delete an education
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {

  // Find the user who wants to delete an education
  Profile.findOne({ user: req.user.id }).then(profile => {
    // Find index of education to delete in education array
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);
    // Remove education and return
    profile.education.splice(removeIndex, 1);
    profile.save().then(profile => res.json(profile));
  })
  .catch(err => res.status(404).json(err));
});

// DELETE request to delete user and profile
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Delete profile
  Profile.findOneAndRemove({ user: req.user.id })
    .then(() => {
      // Delete user
      User.findOneAndRemove({ _id: req.user.id })
        .then(() => res.json({ success: true }));
    })
});

// Return router object as the result of require call
module.exports = router;