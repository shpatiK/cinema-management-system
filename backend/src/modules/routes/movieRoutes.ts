import express from 'express';
import MovieController from '../controllers/MovieController';
import validateMovie from '../../../middlewares/validate.middleware';

const router = express.Router();

// Apply validation and authentication to all routes
router.use(validateMovie); 


// Apply validation to POST and PUT
router.post('/', validateMovie, MovieController.createMovie);
router.put('/:id', validateMovie, MovieController.updateMovie);

// No validation needed for GET/DELETE
router.get('/', MovieController.getAllMovies);
router.delete('/:id', MovieController.deleteMovie);

export default router; // This file defines the routes for the movie-related endpoints.