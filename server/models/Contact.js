const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Contact = sequelize.define('Contact', {
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
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['customer', 'vendor', 'employee']]
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  tax_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  zip_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true
  },
  currency_code: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'USD'
  },
  reference: {
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
  tableName: 'contacts',
  indexes: [
    {
      fields: ['company_id']
    },
    {
      fields: ['type']
    },
    {
      fields: ['email']
    }
  ]
});

// Instance methods
Contact.prototype.isCustomer = function() {
  return this.type === 'customer';
};

Contact.prototype.isVendor = function() {
  return this.type === 'vendor';
};

Contact.prototype.isEmployee = function() {
  return this.type === 'employee';
};

// Virtual fields
Contact.prototype.getInitials = function() {
  return this.name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};

module.exports = Contact;
