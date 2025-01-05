"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Blogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Blogs.belongsTo(models.Users, {
        foreignKey: "user_id",
        as: "user", // Alias untuk relasi
        onDelete: "SET NULL", // Jika user dihapus, user_id di blog menjadi NULL
        onUpdate: "CASCADE", // Jika user diupdate, update terkait di blog
      });
    }
  }

  Blogs.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      post_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Blogs", // Nama model singular untuk konvensi Sequelize
      tableName: "blogs", // Nama tabel di database
    }
  );

  return Blogs;
};
