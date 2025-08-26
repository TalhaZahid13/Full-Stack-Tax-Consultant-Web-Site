const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
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
      isIn: [['income', 'expense', 'transfer', 'payment']]
    }
  },
  account_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'accounts',
      key: 'id'
    }
  },
  paid_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false
  },
  currency_code: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'USD'
  },
  currency_rate: {
    type: DataTypes.DECIMAL(15, 8),
    defaultValue: 1.00000000
  },
  document_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'documents',
      key: 'id'
    }
  },
  contact_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'contacts',
      key: 'id'
    }
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: true
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: true
  },
  parent_id: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  split_id: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  reconciled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
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
  tableName: 'transactions',
  indexes: [
    {
      fields: ['company_id']
    },
    {
      fields: ['type']
    },
    {
      fields: ['account_id']
    },
    {
      fields: ['contact_id']
    },
    {
      fields: ['category_id']
    }
  ]
});

module.exports = Transaction;
