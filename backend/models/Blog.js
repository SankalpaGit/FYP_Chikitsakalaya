// models/Blog.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Blog = sequelize.define('Blog', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING,
    },
    isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    publishedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

module.exports = Blog;