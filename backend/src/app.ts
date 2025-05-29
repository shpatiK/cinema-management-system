import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { sequelize, connectPostgres } from './db/postgres';
import { connectRedis } from './cache/redisClient';
import movieRoutes from './modules/routes/movieRoutes';
import authRoutes from './modules/routes/authRoutes';
import { authMiddleware } from './modules/utils/auth';
import User from './modules/models/User';
import Movie from './modules/models/Movie';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { options } from './modules/swagger/swaggerConfig';
import expressStatusMonitor from 'express-status-monitor';
import { config } from './config';
import adminRoutes from './modules/routes/adminRoutes';

const app = express();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// Swagger setup
const specs = swaggerJsdoc({
  ...options,
  servers: [{ url: config.apiUrl }]
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Middleware
app.use(express.json());
app.use(cors({
  origin: config.frontendUrl
}));
app.use('/posters', express.static(path.join(__dirname, '../public/posters')));
app.use(expressStatusMonitor());


// Enhanced database initialization
async function initializeDatabase() {
  try {
    // Connect to databases first
    await connectPostgres();
    await connectRedis();
    
    // Use alter: true to safely sync without dropping existing columns
    await sequelize.sync({ alter: true });
    console.log('✅ Databases connected and tables synced!');
    
    // Create admin user if doesn't exist
    await User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        username: 'admin',
        password: 'admin123'
      }
    });

    // Create sample movies with new fields
    await Movie.findOrCreate({
      where: { title: 'Inception' },
      defaults: {
        title: 'Inception',
        duration: 148,
        poster_url: '/posters/inception.jpg',
        release_year: 2010,
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        director: 'Christopher Nolan',
        actors: 'Leonardo DiCaprio, Marion Cotillard, Tom Hardy'
      }
    });

    await Movie.findOrCreate({
      where: { title: 'The Dark Knight' },
      defaults: {
        title: 'The Dark Knight',
        duration: 152,
        poster_url: '/posters/dark-knight.jpg',
        release_year: 2008,
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
        director: 'Christopher Nolan',
        actors: 'Christian Bale, Heath Ledger, Aaron Eckhart'
      }
    });

    await Movie.findOrCreate({
      where: { title: 'Interstellar' },
      defaults: {
        title: 'Interstellar',
        duration: 169,
        poster_url: '/posters/interstellar.jpg',
        release_year: 2014,
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        director: 'Christopher Nolan',
        actors: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain'
      }
    });

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

/**
 * @swagger
 * /:
 *   get:
 *     summary: Check server status
 *     responses:
 *       200:
 *         description: Server is running
 */
app.get('/', (req, res) => {
  res.send('🎬 Cinema Management System Backend is Running!');
});

// Routes - Fixed duplicate movie routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes); // Remove the duplicate line
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// Improved server startup
async function startServer() {
  try {
    console.log('⚡ Starting server with configuration:', {
      port: config.port,
      frontendUrl: config.frontendUrl,
      apiUrl: config.apiUrl
    });

    await initializeDatabase();
    
    app.listen(config.port, () => {
      console.log(`🚀 Server running on ${config.apiUrl}`);
      console.log(`📚 API docs available at ${config.apiUrl}/api-docs`);
      console.log(`🌐 Allowing requests from ${config.frontendUrl}`);
    });
  } catch (error) {
    console.error('❌ Fatal startup error:', error);
    process.exit(1);
  }
}

// Start the application
startServer();

export default app;