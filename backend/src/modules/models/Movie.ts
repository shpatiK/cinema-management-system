import { DataTypes, Model, type Optional } from "sequelize"
import { sequelize } from "../../db/postgres"

interface MovieAttributes {
  id: number
  title: string
  duration: number
  release_year: number
  poster_url: string
  description: string
  director: string
  actors: string
  createdAt?: Date
  updatedAt?: Date
}

interface MovieCreationAttributes extends Optional<MovieAttributes, "id" | "createdAt" | "updatedAt"> {}

class Movie extends Model<MovieAttributes, MovieCreationAttributes> implements MovieAttributes {
  public id!: number
  public title!: string
  public duration!: number
  public release_year!: number
  public poster_url!: string
  public description!: string
  public director!: string
  public actors!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Movie.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    release_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    poster_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "/placeholder.svg?height=300&width=200",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    director: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
    },
    actors: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
  },
  {
    sequelize,
    modelName: "Movie",
    tableName: "movies",
    timestamps: true,
  },
)

export default Movie
