
const Joi = require('joi');

// Validation rules for movies
const movieSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  duration: Joi.number().integer().min(1).max(300).required(),
  // NEW VALIDATIONS:
  poster_url: Joi.string().uri().required(),
  release_year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 5).required()
});

module.exports = movieSchema;