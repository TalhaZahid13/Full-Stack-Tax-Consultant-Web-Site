const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Account = sequelize.define('Account', {
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
    defaultValue: 'bank'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  currency_code: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'USD'
  },
  opening_balance: {
    type: DataTypes.DECIMAL(15, 4),
    defaultValue: 0.0000
  },
  bank_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bank_phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bank_address: {
    type: DataTypes.TEXT,
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
  tableName: 'accounts',
  indexes: [
    {
      fields: ['company_id']
    },
    {
      fields: ['name']
    },
    {
      fields: ['number']
    }
  ]
});

// Instance methods
Account.prototype.getBalance = async function() {
  const { Transaction } = require('./index');
  
  let total = parseFloat(this.opening_balance);
  
  const incomeTransactions = await Transaction.findAll({
    where: {
      account_id: this.id,
      type: ['income', 'transfer']
    }
  });
  
  const expenseTransactions = await Transaction.findAll({
    where: {
      account_id: this.id,
      type: ['expense', 'payment']
    }
  });
  
  // Sum incomes
  total += incomeTransactions.reduce((sum, transaction) => {
    return sum + parseFloat(transaction.amount);
  }, 0);
  
  // Subtract expenses
  total -= expenseTransactions.reduce((sum, transaction) => {
    return sum + parseFloat(transaction.amount);
  }, 0);
  
  return total;
};

Account.prototype.getInitials = function() {
  return this.name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};

module.exports = Account;
