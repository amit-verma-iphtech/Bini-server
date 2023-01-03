const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
  sequelize.define('video', {
    video_url: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });
  return sequelize;
};
