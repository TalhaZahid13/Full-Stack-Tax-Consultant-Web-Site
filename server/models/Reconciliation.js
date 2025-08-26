const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reconciliation = sequelize.define('Reconciliation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  account_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  started_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  ended_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  closing_balance: {
    type: DataTypes.DECIMAL(15, 4),
    defaultValue: 0.0000
  },
  reconciled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'reconciliations'
});

module.exports = Reconciliation;
