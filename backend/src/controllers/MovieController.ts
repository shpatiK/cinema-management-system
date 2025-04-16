import { Request, Response } from 'express';
import Movie from '../models/Movie';
import path from 'path';
import fs from 'fs';


export default class MovieController {
  // GET all movies
  static getAllMovies = async (req: Request, res: Response): Promise<void> => {
    try {
      const movies = await Movie.findAll({
        attributes: ['id', 'title', 'duration', 'poster_url', 'release_year'] // Explicitly include new fields
      });
      res.json(movies);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch movies' });
    }
  };

  // POST new movie
  static createMovie = async (req: Request, res: Response): Promise<void> => {
    try {
  const movie = await Movie.create(req.body);
      res.status(201).json(movie);
    } catch (error) {
      res.status(400).json({ error: 'Invalid movie data' });
    }
  };

  // PUT update movie
  static updateMovie = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const [affectedCount] = await Movie.update(req.body, { where: { id } });
      
      if (affectedCount > 0) {
        const updatedMovie = await Movie.findByPk(id);
        res.json(updatedMovie);
      } else {
        res.status(404).json({ error: 'Movie not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Update failed' });
    }
  };

  // DELETE movie
  static deleteMovie = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deletedCount = await Movie.destroy({ where: { id } });
      
      if (deletedCount > 0) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Movie not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Deletion failed' });
    }
  };
}