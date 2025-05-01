import { Request, Response } from 'express';
import { MovieMetadata } from '../models/MovieMetadata';

export default class MetadataController {
  /**
   * @swagger
   * /metadata:
   *   post:
   *     summary: Add metadata for a movie
   *     tags: [Metadata]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/MovieMetadata'
   *     responses:
   *       201:
   *         description: Metadata created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MovieMetadata'
   *       400:
   *         description: Invalid metadata format
   *       401:
   *         description: Unauthorized
   */
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

  /**
   * @swagger
   * /metadata/{movieId}:
   *   get:
   *     summary: Get metadata for a movie
   *     tags: [Metadata]
   *     parameters:
   *       - in: path
   *         name: movieId
   *         schema:
   *           type: integer
   *         required: true
   *         description: Numeric ID of the movie
   *     responses:
   *       200:
   *         description: Movie metadata
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MovieMetadata'
   *       404:
   *         description: Metadata not found
   *       500:
   *         description: Server error
   */
  static async getMetadata(req: Request, res: Response) {
    try {
      const metadata = await MovieMetadata.findOne({
        postgresMovieId: Number(req.params.movieId)
      });
      if (!metadata) {
        return res.status(404).json({ error: 'Metadata not found' });
      }
      res.json(metadata);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch metadata' });
    }
  }
}