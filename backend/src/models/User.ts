import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/postgres';
import bcrypt from 'bcryptjs';

class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;

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
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value: string) {
      const hash = bcrypt.hashSync(value, 10);
      this.setDataValue('password', hash);
    }
  }
}, { sequelize, modelName: 'user' });

export default User;