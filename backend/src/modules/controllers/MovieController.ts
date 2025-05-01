import { Request, Response } from 'express';
import Movie from '../models/Movie';
import redisClient from '../../cache/redisClient';

export default class MovieController {
  // GET all movies with Redis cache
  static getAllMovies = async (req: Request, res: Response): Promise<void> => {
    const cacheKey = 'all_movies';
    
    try {
      const cached = await redisClient.get(cacheKey);

      if (cached) {
        const cachedString = cached.toString(); // konverto në string
        res.json(JSON.parse(cachedString));
        return;
      }

      const movies = await Movie.findAll();
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(movies)); // Cache for 1 hour
      console.log('✅ Cached fresh data');
      res.json(movies);
    } catch (error) {
      console.error('❌ Error fetching movies:', error);
      res.status(500).json({ error: 'Failed to fetch movies' });
    }
  };

  // POST new movie 
  static createMovie = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, duration, release_year, poster_url } = req.body;
      
      if (!title || !duration || !release_year || !poster_url) {
        res.status(400).json({ 
          error: 'Missing required fields',
          required: ['title', 'duration', 'release_year', 'poster_url']
        });
        return;
      }

      if (isNaN(release_year)) {
        res.status(400).json({ error: 'Release year must be a number' });
        return;
      }

      const movie = await Movie.create({
        title,
        duration,
        release_year: parseInt(release_year),
        poster_url
      });

      await redisClient.del('all_movies'); // Clear cache after creation
      res.status(201).json(movie);
    } catch (error) {
      res.status(400).json({ 
        error: 'Invalid movie data',
        details: error.errors?.map((err: any) => err.message) || error.message
      });
    }
  };

  // PUT update movie 
  static updateMovie = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { release_year, ...rest } = req.body;

      const updateData = release_year 
        ? { ...rest, release_year: parseInt(release_year) }
        : rest;

      const [affectedCount] = await Movie.update(updateData, { 
        where: { id },
        validate: true
      });
      
      if (affectedCount > 0) {
        const updatedMovie = await Movie.findByPk(id);
        await redisClient.del('all_movies'); // Clear cache after update
        res.json(updatedMovie);
      } else {
        res.status(404).json({ error: 'Movie not found' });
      }
    } catch (error) {
      res.status(400).json({ 
        error: 'Update failed',
        details: error.errors?.map((err: any) => err.message) || error.message
      });
    }
  };

  // DELETE movie 
  static deleteMovie = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deletedCount = await Movie.destroy({ where: { id } });
      
      if (deletedCount > 0) {
        await redisClient.del('all_movies'); // Clear cache after deletion
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Movie not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Deletion failed' });
    }
  };
}
