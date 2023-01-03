const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
  sequelize.define('location', {
    address: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    long: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    lat: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  });
};
