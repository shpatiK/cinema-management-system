import express from 'express';
import sequelize from './db/postgres';
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

const app = express();
const PORT = process.env.PORT || 3000;

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
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001' // Your frontend URL
}));
app.use('/posters', express.static(path.join(__dirname, '../public/posters')));

// Database initialization
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // Note: Use migrations in production
    console.log('✅ Database connected and tables synced!');
    
    // Create admin user if doesn't exist
    await User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        username: 'admin',
        password: 'admin123' // Change this in production!
      }
    });

    // Create sample movie if none exists
    await Movie.findOrCreate({
      where: { title: 'Inception' },
      defaults: {
        title: 'Inception',
        duration: 148,
        poster_url: '/posters/inception.jpg',
        release_year: 2010
      }
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
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
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "🎬 Cinema Management System Backend is Running!"
 */
app.get('/', (req, res) => {
  res.send('🎬 Cinema Management System Backend is Running!');
});

// Routes
app.use('/auth', authRoutes);
app.use('/movies', movieRoutes);
app.use('/movies', authMiddleware, movieRoutes); // Protected routes

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// Start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
  });
});

export default app;