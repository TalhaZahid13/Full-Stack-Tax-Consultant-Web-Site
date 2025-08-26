const sequelize = require('../config/database');

// Import all models
const User = require('./User');
const Company = require('./Company');
const UserCompany = require('./UserCompany');
const Contact = require('./Contact');
const ContactPerson = require('./ContactPerson');
const Account = require('./Account');
const Transaction = require('./Transaction');
const TransactionTax = require('./TransactionTax');
const Category = require('./Category');
const Currency = require('./Currency');
const Tax = require('./Tax');
const Item = require('./Item');
const ItemTax = require('./ItemTax');
const Document = require('./Document');
const DocumentItem = require('./DocumentItem');
const DocumentItemTax = require('./DocumentItemTax');
const DocumentTotal = require('./DocumentTotal');
const DocumentHistory = require('./DocumentHistory');
const Transfer = require('./Transfer');
const Reconciliation = require('./Reconciliation');
const Recurring = require('./Recurring');
const Setting = require('./Setting');
const Permission = require('./Permission');
const Role = require('./Role');
const RolePermission = require('./RolePermission');
const UserRole = require('./UserRole');
const UserPermission = require('./UserPermission');

// Define associations
const defineAssociations = () => {
  // User associations
  User.belongsToMany(Company, { 
    through: UserCompany, 
    foreignKey: 'user_id',
    otherKey: 'company_id',
    as: 'companies'
  });
  
  User.hasOne(Contact, { 
    foreignKey: 'user_id',
    as: 'contact'
  });

  User.belongsToMany(Role, {
    through: UserRole,
    foreignKey: 'user_id',
    otherKey: 'role_id',
    as: 'roles'
  });

  User.belongsToMany(Permission, {
    through: UserPermission,
    foreignKey: 'user_id',
    otherKey: 'permission_id',
    as: 'permissions'
  });

  // Company associations
  Company.belongsToMany(User, {
    through: UserCompany,
    foreignKey: 'company_id',
    otherKey: 'user_id',
    as: 'users'
  });

  // Contact associations
  Contact.belongsTo(User, { 
    foreignKey: 'user_id',
    as: 'user'
  });
  
  Contact.belongsTo(Company, { 
    foreignKey: 'company_id',
    as: 'company'
  });
  
  Contact.belongsTo(Currency, { 
    foreignKey: 'currency_code',
    targetKey: 'code',
    as: 'currency'
  });
  
  Contact.hasMany(ContactPerson, { 
    foreignKey: 'contact_id',
    as: 'contact_persons'
  });
  
  Contact.hasMany(Document, { 
    foreignKey: 'contact_id',
    as: 'documents'
  });
  
  Contact.hasMany(Transaction, { 
    foreignKey: 'contact_id',
    as: 'transactions'
  });

  // Account associations
  Account.belongsTo(Company, { 
    foreignKey: 'company_id',
    as: 'company'
  });
  
  Account.belongsTo(Currency, { 
    foreignKey: 'currency_code',
    targetKey: 'code',
    as: 'currency'
  });
  
  Account.hasMany(Transaction, { 
    foreignKey: 'account_id',
    as: 'transactions'
  });
  
  Account.hasMany(Reconciliation, { 
    foreignKey: 'account_id',
    as: 'reconciliations'
  });

  // Transaction associations
  Transaction.belongsTo(Account, { 
    foreignKey: 'account_id',
    as: 'account'
  });
  
  Transaction.belongsTo(Contact, { 
    foreignKey: 'contact_id',
    as: 'contact'
  });
  
  Transaction.belongsTo(Category, { 
    foreignKey: 'category_id',
    as: 'category'
  });
  
  Transaction.belongsTo(Document, { 
    foreignKey: 'document_id',
    as: 'document'
  });
  
  Transaction.hasMany(TransactionTax, { 
    foreignKey: 'transaction_id',
    as: 'taxes'
  });

  // Document associations
  Document.belongsTo(Contact, { 
    foreignKey: 'contact_id',
    as: 'contact'
  });
  
  Document.belongsTo(Category, { 
    foreignKey: 'category_id',
    as: 'category'
  });
  
  Document.hasMany(DocumentItem, { 
    foreignKey: 'document_id',
    as: 'items'
  });
  
  Document.hasMany(DocumentTotal, { 
    foreignKey: 'document_id',
    as: 'totals'
  });
  
  Document.hasMany(DocumentHistory, { 
    foreignKey: 'document_id',
    as: 'histories'
  });
  
  Document.hasMany(Transaction, { 
    foreignKey: 'document_id',
    as: 'transactions'
  });

  // Category associations
  Category.belongsTo(Company, { 
    foreignKey: 'company_id',
    as: 'company'
  });

  // Currency associations
  Currency.belongsTo(Company, { 
    foreignKey: 'company_id',
    as: 'company'
  });

  // Item associations
  Item.belongsTo(Company, { 
    foreignKey: 'company_id',
    as: 'company'
  });
  
  Item.belongsTo(Category, { 
    foreignKey: 'category_id',
    as: 'category'
  });
  
  Item.belongsTo(Tax, { 
    foreignKey: 'tax_id',
    as: 'tax'
  });

  // Role and Permission associations
  Role.belongsToMany(Permission, {
    through: RolePermission,
    foreignKey: 'role_id',
    otherKey: 'permission_id',
    as: 'permissions'
  });

  Permission.belongsToMany(Role, {
    through: RolePermission,
    foreignKey: 'permission_id',
    otherKey: 'role_id',
    as: 'roles'
  });
};

// Initialize associations
defineAssociations();

module.exports = {
  sequelize,
  User,
  Company,
  UserCompany,
  Contact,
  ContactPerson,
  Account,
  Transaction,
  TransactionTax,
  Category,
  Currency,
  Tax,
  Item,
  ItemTax,
  Document,
  DocumentItem,
  DocumentItemTax,
  DocumentTotal,
  DocumentHistory,
  Transfer,
  Reconciliation,
  Recurring,
  Setting,
  Permission,
  Role,
  RolePermission,
  UserRole,
  UserPermission
};
