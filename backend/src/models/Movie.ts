import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/postgres';

// Movie model definition
class Movie extends Model {}

// Initialize model with schema
Movie.init(
  {
    // Column: title (string, required)
    title: {
      type: DataTypes.STRING,
      allowNull: false,  
      validate: {
        notEmpty: true   
      }
    },

    // Column: duration (integer, optional)
    duration: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1  
      }
    }
  },
  {
    sequelize,           // Link to database
    modelName: 'movie',  // Table name in database
    timestamps: true     // Auto-add createdAt/updatedAt fields
  }
);

// Forcefully sync tables
(async () => {
    try {
      await sequelize.sync(); // Drops and recreates tables
      console.log('✅ Movies table created!');
    } catch (error) {
      console.error('❌ Creation failed:', error);
    }
})();

export default Movie;