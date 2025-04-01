import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/postgres';

// Define Movie class as a Sequelize model
class Movie extends Model {}

// Initialize model with schema
Movie.init(
  {
    // Column: title (string, required)
    title: {
      type: DataTypes.STRING,
      allowNull: false,  // Disallow null values
      validate: {
        notEmpty: true   // Ensure empty strings aren't allowed
      }
    },

    // Column: duration (integer, optional)
    duration: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1  // Minimum movie duration: 1 minute
      }
    }
  },
  {
    sequelize,           // Link to database
    modelName: 'movie',  // Table name in database
    timestamps: true     // Auto-add createdAt/updatedAt fields
  }
);

// Forcefully sync tables (only in development
(async () => {
    try {
      await sequelize.sync(); // Drops and recreates tables
      console.log('✅ Movies table created!');
    } catch (error) {
      console.error('❌ Creation failed:', error);
    }
})();

export default Movie;