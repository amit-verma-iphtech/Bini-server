const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
  sequelize.define('store', {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    locationId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  });
};
