const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transfer = sequelize.define('Transfer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  payment_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  revenue_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'transfers'
});

module.exports = Transfer;
