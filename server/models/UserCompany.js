const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserCompany = sequelize.define('UserCompany', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  company_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'companies',
      key: 'id'
    }
  }
}, {
  tableName: 'user_companies',
  timestamps: false
});

module.exports = UserCompany;
