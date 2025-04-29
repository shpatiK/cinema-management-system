import { RequestHandler } from 'express';
import Joi from 'joi';

const movieSchema = Joi.object({
  title: Joi.string().min(2).required(),
  duration: Joi.number().min(1).required(),
  release_year: Joi.number().integer().min(1888).max(new Date().getFullYear() + 1),
  poster_url: Joi.string().pattern(/^[a-zA-Z0-9\-_]+\.(jpg|jpeg|png)$/).required()
});

const validateMovie: RequestHandler = (req, res, next) => {
  const { error } = movieSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return; 
  }
  next();
};

export default validateMovie;