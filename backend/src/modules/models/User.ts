import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../db/postgres';
import bcrypt from 'bcryptjs';

class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string; // Added email property
  public password!: string;
  public role!: string;
  public isActive!: boolean;
  public activationToken!: string | null;

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      len: [3, 50]
    }
  },
  email: {  
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 255]
    }
    // Removed the automatic hashing from here since we handle it in the controller
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user', // Fixed: was 'ROLE_USER'
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  activationToken: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, { 
  sequelize, 
  modelName: 'user',
  tableName: 'users', // Explicit table name
  timestamps: true // Add createdAt and updatedAt
});

export default User;