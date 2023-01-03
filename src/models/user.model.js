const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
  sequelize.define('user', {
    name: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    mobileNo: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    role: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    firebaseUID: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    customerId: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    avatar: {
      allowNull: true,
      type: DataTypes.STRING,
      default: '',
    },
  });
};
