// src/routes/metadataRoutes.ts
import { Router } from 'express';
import MetadataController from '../controllers/MetadataController';

const router = Router();

router.post('/metadata/:movieId', MetadataController.addMetadata);
router.get('/metadata/:movieId', MetadataController.getMetadata);

export default router;

