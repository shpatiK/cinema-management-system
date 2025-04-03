
const Joi = require('joi');

// Validation rules for movies
const movieSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  duration: Joi.number().integer().min(1).max(300).required(),
  
});

module.exports = movieSchema;