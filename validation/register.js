const Validator = require('validator');
// Load custom function
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  // Initialize errors object
  let errors = {};

  // Set fields to empty strings if necessary so validator works on those fields
  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  // Name length out of range
  if(!Validator.isLength(data.name, { min: 2, max: 30 })) {
    // Add to errors object
    errors.name = 'Name must be between 2 and 30 characters';
  }

  // Empty name
  if(Validator.isEmpty(data.name)) {
    // Add to errors object
    errors.name = 'Name field is required';
  }

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

  // Password length out of range
  if(!Validator.isLength(data.password, { min: 6, max: 30 })) {
    // Add to errors object
    errors.password = 'Password length out of range';
  }

  // Empty password
  if(Validator.isEmpty(data.password)) {
    // Add to errors object
    errors.password = 'Password field is required';
  }

  // Passwords do not match
  if(!Validator.equals(data.password, data.password2)) {
    // Add to errors object
    errors.password2 = 'Password fields must match';
  }

  // Empty password confirmation
  if(Validator.isEmpty(data.password2)) {
    // Add to errors object
    errors.password2 = 'Confirm password field is required';
  }
  
  // Return object with errors and boolean
  return {
    errors,
    isValid: isEmpty(errors)
  }
}