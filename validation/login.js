const Validator = require('validator');
// Load custom function
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
  // Initialize errors object
  let errors = {};

  // Set fields to empty strings if necessary so validator works on those fields
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  // Invalid email
  if(!Validator.isEmail(data.email)) {
    // Add to errors object
    errors.email = 'Email field is invalid';
  }

  // Empty email
  if(Validator.isEmpty(data.email)) {
    // Add to errors object
    errors.email = 'Email field is required';
  }

  // Empty password
  if(Validator.isEmpty(data.password)) {
    // Add to errors object
    errors.password = 'Password field is required';
  }

  // Return object with errors and boolean
  return {
    errors,
    isValid: isEmpty(errors)
  }
}