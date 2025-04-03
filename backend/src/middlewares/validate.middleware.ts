import { RequestHandler } from 'express';
import Joi from 'joi';

const movieSchema = Joi.object({
  title: Joi.string().min(2).required(),
  duration: Joi.number().min(1).required()
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