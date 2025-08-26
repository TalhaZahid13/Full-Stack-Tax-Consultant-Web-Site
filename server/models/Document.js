const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Document = sequelize.define('Document', {
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
      isIn: [['invoice', 'bill', 'invoice_recurring', 'bill_recurring']]
    }
  },
  document_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  order_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'draft'
  },
  issued_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  due_at: {
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
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  contact_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'contacts',
      key: 'id'
    }
  },
  contact_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contact_email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contact_tax_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contact_phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contact_address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  footer: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  parent_id: {
    type: DataTypes.INTEGER,
    defaultValue: 0
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
  tableName: 'documents',
  indexes: [
    {
      fields: ['company_id']
    },
    {
      fields: ['type']
    },
    {
      fields: ['contact_id']
    },
    {
      fields: ['status']
    },
    {
      unique: true,
      fields: ['company_id', 'document_number', 'deleted_at']
    }
  ]
});

// Static constants
Document.INVOICE_TYPE = 'invoice';
Document.BILL_TYPE = 'bill';
Document.INVOICE_RECURRING_TYPE = 'invoice_recurring';
Document.BILL_RECURRING_TYPE = 'bill_recurring';

module.exports = Document;
