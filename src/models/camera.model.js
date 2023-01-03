const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('camera', {
    rtsp_uri: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    model_name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    imageLink: {
      allowNull: true,
      type: DataTypes.STRING,
    },
  });
  return sequelize;
};
