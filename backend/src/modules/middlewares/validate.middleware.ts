import { RequestHandler } from 'express';
import Joi from 'joi';

/**
 * @swagger
 * components:
 *   schemas:
 *     MovieInput:
 *       type: object
 *       required:
 *         - title
 *         - duration
 *         - poster_url
 *       properties:
 *         title:
 *           type: string
 *           minLength: 2
 *           example: "Inception"
 *         duration:
 *           type: number
 *           minimum: 1
 *           example: 148
 *         release_year:
 *           type: number
 *           minimum: 1888
 *           maximum: 2025
 *           example: 2010
 *         poster_url:
 *           type: string
 *           pattern: "^[a-zA-Z0-9\-_]+\.(jpg|jpeg|png)$"
 *           example: "inception-poster.jpg"
 *     ValidationError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Validation failed: title is required"
 */

const movieSchema = Joi.object({
  title: Joi.string().min(2).required(),
  duration: Joi.number().min(1).required(),
  release_year: Joi.number().integer().min(1888).max(new Date().getFullYear() + 1),
  poster_url: Joi.string().pattern(/^[a-zA-Z0-9\-_]+\.(jpg|jpeg|png)$/).required()
});

/**
 * Validates movie data against schema
 * @throws {ValidationError} Returns 400 if validation fails
 */
const validateMovie: RequestHandler = (req, res, next) => {
  const { error } = movieSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return; 
  }
  next();
};

export default validateMovie;