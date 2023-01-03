const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
  sequelize.define('ref_push_token', {
    // The following specification of the 'id' attribute could be omitted
    // since it is the default.
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    token: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: 1,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  });
};
