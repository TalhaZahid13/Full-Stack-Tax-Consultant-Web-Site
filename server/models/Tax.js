const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tax = sequelize.define('Tax', {
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
  rate: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: 'normal'
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'taxes'
});

module.exports = Tax;
