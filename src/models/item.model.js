const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
  sequelize.define('item', {
    name: {
      allowNull: false,
      type: DataTypes.STRING(1000),
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING(3000),
    },
    imageUrl: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  });
  return sequelize;
};
