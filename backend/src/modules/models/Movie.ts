import { DataTypes, Model } from 'sequelize';
import sequelize from '../../db/postgres';

class Movie extends Model {}

Movie.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1
      }
    },
    release_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1888, // First movie ever made
        max: new Date().getFullYear() + 5 // Allow future releases
      }
    },
    poster_url: {
      type: DataTypes.STRING,
      allowNull: false, // Make required
      validate: {
        notEmpty: true,
        isUrl: true // Validate it's a proper URL/path
      }
    }
  },
  {
    sequelize,
    modelName: 'movie',
    timestamps: true
  }
);

// Safe sync - use force: false to prevent data loss
(async () => {
  try {
    await Movie.sync({ alter: true }); // Correct way to use alter
    console.log('✅ Movies table updated safely!');
  } catch (error) {
    console.error('❌ Update failed:', error);
  }
})();

export default Movie;