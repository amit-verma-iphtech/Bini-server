const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
  sequelize.define('visit', {
    start: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    end: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    storeCustomerId: {
      allowNull: true,
      type: DataTypes.STRING,
    },
  });
  return sequelize;
};
