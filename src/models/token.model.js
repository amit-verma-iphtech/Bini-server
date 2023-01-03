const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
  sequelize.define('token', {
    token: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    expires: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    type: {
      allowNull: false,
      type: DataTypes.ENUM('access', 'refresh', 'resetPassword'),
    },
    blacklisted: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
  });
};
