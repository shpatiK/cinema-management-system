import { Sequelize } from 'sequelize';
import { config } from '../config'; 

const sequelize = new Sequelize(config.db.postgres, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: config.isProduction ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

export async function connectPostgres() {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected to:', config.db.postgres.split('@')[1]);
    return sequelize;
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
    throw error;
  }
}

export { sequelize };