// src/models/MovieMetadata.ts
import { Schema, model } from 'mongoose';

interface IMovieMetadata {
  postgresMovieId: number; // Links to SQL record
  trailers: Array<{
    url: string;
    type: string;
  }>;
  socialMediaTags: string[];
}

const MovieMetadataSchema = new Schema<IMovieMetadata>({
  postgresMovieId: { type: Number, required: true },
  trailers: [{
    url: String,
    type: String
  }],
  socialMediaTags: [String]
});

export const MovieMetadata = model<IMovieMetadata>('MovieMetadata', MovieMetadataSchema);