const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DocumentItem = sequelize.define('DocumentItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  document_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: true
  },
  quantity: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false
  },
  tax: {
    type: DataTypes.DECIMAL(15, 4),
    defaultValue: 0.0000
  }
}, {
  tableName: 'document_items'
});

module.exports = DocumentItem;
