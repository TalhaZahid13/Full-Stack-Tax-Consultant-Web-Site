const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Recurring = sequelize.define('Recurring', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  recurable_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  recurable_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  frequency: {
    type: DataTypes.STRING,
    allowNull: false
  },
  interval: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  started_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'recurring'
});

module.exports = Recurring;
