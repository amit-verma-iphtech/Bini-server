const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
  sequelize.define('action', {
    text: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    actionOn: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    actionOnType: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    action: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    visitId: {
      allowNull: true,
      type: DataTypes.NUMBER,
    },
    actionAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    duration: {
      allowNull: true,
      type: DataTypes.NUMBER,
    },
  });
  return sequelize;
};
