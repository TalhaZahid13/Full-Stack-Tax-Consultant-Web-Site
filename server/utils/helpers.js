/**
 * Helper utilities for the server
 */

const crypto = require('crypto');

/**
 * Generate a random string
 * @param {number} length 
 * @returns {string}
 */
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Format currency amount
 * @param {number} amount 
 * @param {string} currency 
 * @returns {string}
 */
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Slugify a string
 * @param {string} text 
 * @returns {string}
 */
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * Calculate tax amount
 * @param {number} amount 
 * @param {number} taxRate 
 * @returns {number}
 */
const calculateTax = (amount, taxRate) => {
  return (amount * taxRate) / 100;
};

/**
 * Calculate percentage
 * @param {number} value 
 * @param {number} total 
 * @returns {number}
 */
const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

module.exports = {
  generateRandomString,
  formatCurrency,
  isValidEmail,
  slugify,
  calculateTax,
  calculatePercentage,
};
