const Validator = require('validator');
// Load custom function
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
  // Initialize errors object
  let errors = {};

  // Set fields to empty strings if necessary so validator works on those fields
  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';

  // Handle length out of range
  if(!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    // Add to errors object
    errors.handle = 'Handle must be between 2 and 40 characters';
  }

  // Missing handle
  if(Validator.isEmpty(data.handle)) {
    // Add to errors object
    errors.handle = 'Profile handle is required';
  }

  // Missing status
  if(Validator.isEmpty(data.status)) {
    // Add to errors object
    errors.status = 'Status field is required';
  }

  // No skills listed
  if(Validator.isEmpty(data.skills)) {
    // Add to errors object
    errors.skills = 'Skills field is required';
  }

  // For all social media, check that field is not empty string before attempting to validate
  if(!isEmpty(data.website)) {
    if(!Validator.isURL(data.website)) {
      errors.website = 'Not a valid URL';
    }
  }

  if(!isEmpty(data.youtube)) {
    if(!Validator.isURL(data.youtube)) {
      errors.youtube = 'Not a valid URL';
    }
  }

  if(!isEmpty(data.twitter)) {
    if(!Validator.isURL(data.twitter)) {
      errors.twitter = 'Not a valid URL';
    }
  }

  if(!isEmpty(data.facebook)) {
    if(!Validator.isURL(data.facebook)) {
      errors.facebook = 'Not a valid URL';
    }
  }

  if(!isEmpty(data.linkedin)) {
    if(!Validator.isURL(data.linkedin)) {
      errors.linkedin = 'Not a valid URL';
    }
  }

  if(!isEmpty(data.instagram)) {
    if(!Validator.isURL(data.instagram)) {
      errors.instagram = 'Not a valid URL';
    }
  }

  // Return object with errors and boolean
  return {
    errors,
    isValid: isEmpty(errors)
  }
}