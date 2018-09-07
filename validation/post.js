const Validator = require('validator');
// Load custom function
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
  // Initialize errors object
  let errors = {};

  // Set fields to empty strings if necessary so validator works on those fields
  data.text = !isEmpty(data.text) ? data.text : '';

  // Post text length out of range
  if(!Validator.isLength(data.text, { min: 10, max: 300 })) {
    // Add to errors object
    errors.text = 'Post must be between 10 and 300 characters';
  }

  // Empty post
  if(Validator.isEmpty(data.text)) {
    // Add to errors object
    errors.text = 'Text field is required';
  }

  // Return object with errors and boolean
  return {
    errors,
    isValid: isEmpty(errors)
  }
}