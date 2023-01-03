const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
  sequelize.define('product', {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    price: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    discountedPrice: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    stock: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  });
};
