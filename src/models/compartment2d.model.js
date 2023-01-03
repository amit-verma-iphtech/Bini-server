const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('compartment2d', {
    cameraId: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    itemId: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    x1: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    x2: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    x3: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    x4: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    y1: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    y2: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    y3: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    y4: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
  });
  return sequelize;
};
