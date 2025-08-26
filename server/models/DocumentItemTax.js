const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DocumentItemTax = sequelize.define('DocumentItemTax', {
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
  document_item_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tax_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(15, 4),
    defaultValue: 0.0000
  }
}, {
  tableName: 'document_item_taxes'
});

module.exports = DocumentItemTax;
