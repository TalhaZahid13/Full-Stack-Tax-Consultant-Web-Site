const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sale_price: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false
  },
  purchase_price: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  tax_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'items',
  indexes: [
    {
      unique: true,
      fields: ['company_id', 'sku', 'deleted_at']
    }
  ]
});

module.exports = Item;
