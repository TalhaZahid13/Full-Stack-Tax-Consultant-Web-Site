const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Currency = sequelize.define('Currency', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'companies',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rate: {
    type: DataTypes.DECIMAL(15, 8),
    allowNull: false,
    defaultValue: 1.00000000
  },
  precision: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '2'
  },
  symbol: {
    type: DataTypes.STRING,
    allowNull: true
  },
  symbol_first: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  decimal_mark: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '.'
  },
  thousands_separator: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ','
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  created_from: {
    type: DataTypes.STRING,
    allowNull: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'currencies',
  indexes: [
    {
      fields: ['company_id']
    },
    {
      fields: ['code']
    },
    {
      unique: true,
      fields: ['company_id', 'code', 'deleted_at']
    }
  ]
});

module.exports = Currency;
