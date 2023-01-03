const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
  sequelize.define('transaction', {
    shippingAddress: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    shippingDateTime: {
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      type: DataTypes.DATE,
    },
    message: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    uuid: {
      type: DataTypes.STRING,
      // defaultValue: DataTypes.UUIDV4,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'initial',
      allowNull: false,
    },
  });
};
