const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
  sequelize.define('image', {
    url: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    itemId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'item',
        key: 'id',
      },
    },
  });
};
