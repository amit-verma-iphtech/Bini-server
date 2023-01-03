const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
  sequelize.define('ref_item_store', {
    // The following specification of the 'id' attribute could be omitted
    // since it is the default.
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    stock: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    price: {
      type: DataTypes.FLOAT,
    },
    discountedPrice: {
      type: DataTypes.FLOAT,
    },
    storeItemId: {
      allowNull: true,
      type: DataTypes.STRING,
    },
  });
};
