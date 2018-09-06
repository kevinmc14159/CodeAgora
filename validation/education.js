const Validator = require('validator');
// Load custom function
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
  // Initialize errors object
  let errors = {};

  // Set fields to empty strings if necessary so validator works on those fields
  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  // Empty school
  if(Validator.isEmpty(data.school)) {
    // Add to errors object
    errors.school = 'School field is required';
  }

  // No degree
  if(Validator.isEmpty(data.degree)) {
    // Add to errors object
    errors.degree = 'Degree field is required';
  }

  // No field of study
  if(Validator.isEmpty(data.fieldofstudy)) {
    // Add to errors object
    errors.fieldofstudy = 'Field of study is required';
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