import { Model, DataTypes } from 'sequelize';
import sequelize from '../../db/postgres';
import bcrypt from 'bcryptjs';

class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public role!: string;
  public isActive!: boolean;
  public activationToken!: string | null;

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

User.init({
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
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
    set(value: string) {
      const hash = bcrypt.hashSync(value, 10);
      this.setDataValue('password', hash);
    }
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'ROLE_USER',
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
}, { sequelize, modelName: 'user' });

export default User;