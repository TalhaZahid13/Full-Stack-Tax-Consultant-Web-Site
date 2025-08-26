const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      // Capitalize first letter
      this.setDataValue('name', value ? value.charAt(0).toUpperCase() + value.slice(1) : '');
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  role:{
    type: DataTypes.ENUM('Admin', 'Client'),
    allowNull: false,
    defaultValue: 'Client'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  remember_token: {
    type: DataTypes.STRING,
    allowNull: true
  },
  last_logged_in_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  locale: {
    type: DataTypes.STRING,
    defaultValue: 'en-GB'
  },
  landing_page: {
    type: DataTypes.STRING,
    allowNull: true
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
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance methods
User.prototype.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password;
  delete values.remember_token;
  return values;
};

// Static methods
User.findByEmail = function(email) {
  return this.findOne({ where: { email } });
};

module.exports = User;
