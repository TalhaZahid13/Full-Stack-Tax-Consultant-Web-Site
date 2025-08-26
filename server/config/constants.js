/**
 * Application constants
 */

module.exports = {
  // Document types
  DOCUMENT_TYPES: {
    INVOICE: 'invoice',
    BILL: 'bill',
    INVOICE_RECURRING: 'invoice_recurring',
    BILL_RECURRING: 'bill_recurring',
  },

  // Transaction types
  TRANSACTION_TYPES: {
    INCOME: 'income',
    EXPENSE: 'expense',
    TRANSFER: 'transfer',
    PAYMENT: 'payment',
  },

  // Contact types
  CONTACT_TYPES: {
    CUSTOMER: 'customer',
    VENDOR: 'vendor',
    EMPLOYEE: 'employee',
  },

  // Category types
  CATEGORY_TYPES: {
    INCOME: 'income',
    EXPENSE: 'expense',
    ITEM: 'item',
    OTHER: 'other',
  },

  // Document statuses
  DOCUMENT_STATUSES: {
    DRAFT: 'draft',
    SENT: 'sent',
    VIEWED: 'viewed',
    APPROVED: 'approved',
    PARTIAL: 'partial',
    PAID: 'paid',
    OVERDUE: 'overdue',
    CANCELLED: 'cancelled',
  },

  // User roles
  USER_ROLES: {
    ADMIN: 'admin',
    MANAGER: 'manager',
    EMPLOYEE: 'employee',
    CUSTOMER: 'customer',
  },

  // Permissions
  PERMISSIONS: {
    // Auth
    READ_AUTH_USERS: 'read-auth-users',
    CREATE_AUTH_USERS: 'create-auth-users',
    UPDATE_AUTH_USERS: 'update-auth-users',
    DELETE_AUTH_USERS: 'delete-auth-users',

    // Banking
    READ_BANKING_ACCOUNTS: 'read-banking-accounts',
    CREATE_BANKING_ACCOUNTS: 'create-banking-accounts',
    UPDATE_BANKING_ACCOUNTS: 'update-banking-accounts',
    DELETE_BANKING_ACCOUNTS: 'delete-banking-accounts',

    READ_BANKING_TRANSACTIONS: 'read-banking-transactions',
    CREATE_BANKING_TRANSACTIONS: 'create-banking-transactions',
    UPDATE_BANKING_TRANSACTIONS: 'update-banking-transactions',
    DELETE_BANKING_TRANSACTIONS: 'delete-banking-transactions',

    // Sales
    READ_SALES_INVOICES: 'read-sales-invoices',
    CREATE_SALES_INVOICES: 'create-sales-invoices',
    UPDATE_SALES_INVOICES: 'update-sales-invoices',
    DELETE_SALES_INVOICES: 'delete-sales-invoices',

    READ_SALES_CUSTOMERS: 'read-sales-customers',
    CREATE_SALES_CUSTOMERS: 'create-sales-customers',
    UPDATE_SALES_CUSTOMERS: 'update-sales-customers',
    DELETE_SALES_CUSTOMERS: 'delete-sales-customers',

    // Purchases
    READ_PURCHASES_BILLS: 'read-purchases-bills',
    CREATE_PURCHASES_BILLS: 'create-purchases-bills',
    UPDATE_PURCHASES_BILLS: 'update-purchases-bills',
    DELETE_PURCHASES_BILLS: 'delete-purchases-bills',

    READ_PURCHASES_VENDORS: 'read-purchases-vendors',
    CREATE_PURCHASES_VENDORS: 'create-purchases-vendors',
    UPDATE_PURCHASES_VENDORS: 'update-purchases-vendors',
    DELETE_PURCHASES_VENDORS: 'delete-purchases-vendors',

    // Items
    READ_ITEMS: 'read-items',
    CREATE_ITEMS: 'create-items',
    UPDATE_ITEMS: 'update-items',
    DELETE_ITEMS: 'delete-items',

    // Reports
    READ_REPORTS: 'read-reports',
    CREATE_REPORTS: 'create-reports',

    // Settings
    READ_SETTINGS: 'read-settings',
    UPDATE_SETTINGS: 'update-settings',
  },

  // Recurring frequencies
  RECURRING_FREQUENCIES: {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    QUARTERLY: 'quarterly',
    YEARLY: 'yearly',
  },

  // Default currency
  DEFAULT_CURRENCY: 'USD',

  // Default locale
  DEFAULT_LOCALE: 'en-GB',

  // File upload limits
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB

  // Pagination
  DEFAULT_PAGE_SIZE: 25,
  MAX_PAGE_SIZE: 100,
};
