const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
  sequelize.define('observation', {
    // The following specification of the 'id' attribute could be omitted
    // since it is the default.
    available: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    start: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    end: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return sequelize;
};
