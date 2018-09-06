const Validator = require('validator');
// Load custom function
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
  // Initialize errors object
  let errors = {};

  // Set fields to empty strings if necessary so validator works on those fields
  data.title = !isEmpty(data.title) ? data.title : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.from = !isEmpty(data.from) ? data.from : '';
  
  // No job title
  if(Validator.isEmpty(data.title)) {
    // Add to errors object
    errors.title = 'Job title field is required';
  }

  // No company entered
  if(Validator.isEmpty(data.company)) {
    // Add to errors object
    errors.company = 'Company field is required';
  }

  // No start date
  if(Validator.isEmpty(data.from)) {
    // Add to errors object
    errors.from = 'From date field is required';
  }

  // Return object with errors and boolean
  return {
    errors,
    isValid: isEmpty(errors)
  }
}