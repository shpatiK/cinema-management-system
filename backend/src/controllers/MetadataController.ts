import { Request, Response } from 'express';
import { MovieMetadata } from '../models/MovieMetadata';

export default class MetadataController {
  static async addMetadata(req: Request, res: Response) {
    try {
      const { postgresMovieId, trailers, socialMediaTags } = req.body;
      const metadata = await MovieMetadata.create({
        postgresMovieId,
        trailers,
        socialMediaTags
      });
      res.status(201).json(metadata);
    } catch (error) {
      res.status(400).json({ error: 'Invalid metadata format' });
    }
  }

  static async getMetadata(req: Request, res: Response) {
    try {
      const metadata = await MovieMetadata.findOne({
        postgresMovieId: Number(req.params.movieId)
      });
      res.json(metadata);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch metadata' });
    }
  }
}