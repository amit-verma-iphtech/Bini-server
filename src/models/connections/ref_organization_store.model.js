const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
  sequelize.define('ref_organization_store', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    invitedBy: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    active: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    storeId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    organizationId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  });
};
