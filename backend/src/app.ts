import express from 'express';
import sequelize from './db/postgres';
import { connectMongoDB } from './db/mongo';
import movieRoutes from './modules/auth/routes/movieRoutes';
import metadataRoutes from './modules/auth/routes/metadataRoutes';
import authRoutes from './modules/auth/routes/authRoutes';
import { authMiddleware } from './modules/auth/utils/auth';
import User from './modules/auth/models/User';
import Movie from './modules/auth/models/Movie';
import cors from 'cors';
import fileUpload from 'express-fileupload';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(fileUpload());
app.use('/posters', express.static('public/posters'));

// Database initialization
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // Note: Use migrations in production
    console.log('✅ Database connected and tables synced!');

    // Initialize MongoDB
    await connectMongoDB();
    
    // Optional: Create admin user if doesn't exist
    await User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        username: 'admin',
        password: 'admin123' 
      }
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// Routes
app.get('/', (req, res) => {
  res.send('🎬 Cinema Management System Backend is Running!');
});

// Unprotected routes
app.use('/auth', authRoutes);

// Protected routes (require JWT)
app.use('/movies', authMiddleware, movieRoutes);

// Protected routes
app.use('/movies', authMiddleware, movieRoutes);       // PostgreSQL (with validation)
app.use('/metadata', authMiddleware, metadataRoutes);    // MongoDB (no validation)

// Error handling middleware (must be last)
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
    console.log(`- PostgreSQL: Movies/Core Data`);
    console.log(`- MongoDB: Metadata/Unstructured Data`);
  });
});

export default app;