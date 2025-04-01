// Import Sequelize
import { Sequelize } from 'sequelize';

// Configure connection (replace credentials with yours)
const sequelize = new Sequelize({
  database: 'cinema',       // Database name
  username: 'postgres',     // Default PostgreSQL username
  password: 'eniguhelli', // Your PostgreSQL password
  host: 'localhost',        // Database server
  port: 5432,               // Default PostgreSQL port
  dialect: 'postgres',      // Database type
  logging: console.log            // Disable SQL query logs in console
});

// Test connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection established!');
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
})();

// Export for use in models
export default sequelize;