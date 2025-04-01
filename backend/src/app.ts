import express from 'express';
import sequelize from './db/postgres';  // Import your Sequelize instance
import Movie from './models/Movie';     // Import your Movie model

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initialize database connection and sync models
async function initializeDatabase() {
  try {
    await sequelize.authenticate(); // Test connection
    await sequelize.sync({ alter: true }); // Create tables if they don't exist
    console.log('✅ Database connected and tables synced!');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

// Routes
app.get('/', (req, res) => {
  res.send('🎬 Cinema Management System Backend is Running!');
});

// Get all movies FROM DATABASE (updated route)
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.findAll(); // Fetch from PostgreSQL
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// Add a new movie (new route)
app.post('/movies', async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ error: 'Invalid movie data' });
  }
});

// Start server after DB initialization
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});