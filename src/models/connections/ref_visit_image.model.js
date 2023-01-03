const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('ref_visit_image', {
    image: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  });
};
