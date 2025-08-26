const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserRole = sequelize.define('UserRole', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  role_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'roles',
      key: 'id'
    }
  },
  user_type: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: 'App\\Models\\Auth\\User'
  }
}, {
  tableName: 'user_roles',
  timestamps: false
});

module.exports = UserRole;
