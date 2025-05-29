import { DataTypes, Model, type Optional } from "sequelize"
import { sequelize } from "../../db/postgres"
import bcrypt from "bcryptjs"

interface UserAttributes {
  id: number
  username: string
  email: string
  password: string
  role: string
  isActive: boolean
  activationToken: string | null
  createdAt?: Date
  updatedAt?: Date
}

interface UserCreationAttributes extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number
  public username!: string
  public email!: string
  public password!: string
  public role!: string
  public isActive!: boolean
  public activationToken!: string | null
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  // Instance method to compare passwords
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password)
  }

  // Static method to hash password
  public static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        len: [3, 50],
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 255],
      },
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user",
      allowNull: false,
      validate: {
        isIn: [["user", "admin"]],
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    activationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          user.password = await User.hashPassword(user.password)
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed("password")) {
          user.password = await User.hashPassword(user.password)
        }
      },
    },
  },
)

export default User
