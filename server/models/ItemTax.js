const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ItemTax = sequelize.define('ItemTax', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tax_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'item_taxes'
});

module.exports = ItemTax;
