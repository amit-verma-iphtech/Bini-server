const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
  sequelize.define('tag', {
    text: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    priority: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  });
};
