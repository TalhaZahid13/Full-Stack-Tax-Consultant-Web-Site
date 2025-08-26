const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserPermission = sequelize.define('UserPermission', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  permission_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'permissions',
      key: 'id'
    }
  },
  user_type: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: 'App\\Models\\Auth\\User'
  }
}, {
  tableName: 'user_permissions',
  timestamps: false
});

module.exports = UserPermission;
