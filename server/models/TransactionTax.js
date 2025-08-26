const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TransactionTax = sequelize.define('TransactionTax', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  transaction_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'transactions',
      key: 'id'
    }
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
  tableName: 'transaction_taxes'
});

module.exports = TransactionTax;
