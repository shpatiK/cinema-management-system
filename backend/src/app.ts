import express from 'express';
import sequelize from './db/postgres';
import movieRoutes from './modules/routes/movieRoutes';
import authRoutes from './modules/routes/authRoutes';
import { authMiddleware } from './modules/utils/auth';
import User from './modules/models/User';
import Movie from './modules/models/Movie';
import cors from 'cors';
import path from 'path';


const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001' // Your frontend URL
}));
app.use('/posters', express.static(path.join(__dirname, '../public/posters')));

console.log('Static files served from:', path.join(__dirname, '../public/posters'));
// Database initialization
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // Note: Use migrations in production
    console.log('✅ Database connected and tables synced!');
    
    // Optional: Create admin user if doesn't exist
    await User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        username: 'admin',
        password: 'admin123' // Change this in production!
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
app.use('/movies', movieRoutes);

// Protected routes (require JWT)
app.use('/movies', authMiddleware, movieRoutes);

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
  });
});

export default app;