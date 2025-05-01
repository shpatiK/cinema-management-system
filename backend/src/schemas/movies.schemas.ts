import Joi from 'joi';

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       required:
 *         - title
 *         - duration
 *         - poster_url
 *         - release_year
 *       properties:
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "Inception"
 *         duration:
 *           type: integer
 *           minimum: 1
 *           maximum: 300
 *           example: 148
 *           description: Duration in minutes
 *         poster_url:
 *           type: string
 *           format: uri
 *           example: "https://example.com/posters/inception.jpg"
 *         release_year:
 *           type: integer
 *           minimum: 1900
 *           maximum: 2025
 *           example: 2010
 *     MovieMetadata:
 *       type: object
 *       required:
 *         - postgresMovieId
 *       properties:
 *         postgresMovieId:
 *           type: integer
 *           example: 123
 *         trailers:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *           example: ["https://youtube.com/trailer1", "https://vimeo.com/trailer2"]
 *         socialMediaTags:
 *           type: object
 *           properties:
 *             twitter:
 *               type: string
 *               example: "#Inception"
 *             instagram:
 *               type: string
 *               example: "#InceptionMovie"
 */

// Joi validation schema
const movieSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  duration: Joi.number().integer().min(1).max(300).required(),
  poster_url: Joi.string().uri().required(),
  release_year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 5).required()
});

export default movieSchema;