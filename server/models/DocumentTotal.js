const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DocumentTotal = sequelize.define('DocumentTotal', {
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
  code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false
  },
  sort_order: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'document_totals'
});

module.exports = DocumentTotal;
