-- Accounting System MERN Stack Database Schema
-- MySQL/MariaDB compatible

SET foreign_key_checks = 0;

-- Drop tables if they exist (for clean install)
DROP TABLE IF EXISTS `user_permissions`;
DROP TABLE IF EXISTS `user_roles`;
DROP TABLE IF EXISTS `role_permissions`;
DROP TABLE IF EXISTS `user_companies`;
DROP TABLE IF EXISTS `document_item_taxes`;
DROP TABLE IF EXISTS `document_items`;
DROP TABLE IF EXISTS `document_totals`;
DROP TABLE IF EXISTS `document_histories`;
DROP TABLE IF EXISTS `documents`;
DROP TABLE IF EXISTS `transaction_taxes`;
DROP TABLE IF EXISTS `transactions`;
DROP TABLE IF EXISTS `item_taxes`;
DROP TABLE IF EXISTS `items`;
DROP TABLE IF EXISTS `transfers`;
DROP TABLE IF EXISTS `reconciliations`;
DROP TABLE IF EXISTS `recurring`;
DROP TABLE IF EXISTS `contact_persons`;
DROP TABLE IF EXISTS `contacts`;
DROP TABLE IF EXISTS `accounts`;
DROP TABLE IF EXISTS `settings`;
DROP TABLE IF EXISTS `taxes`;
DROP TABLE IF EXISTS `currencies`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `companies`;

SET foreign_key_checks = 1;

-- Companies table
CREATE TABLE `companies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `domain` varchar(255) NOT NULL,
  `enabled` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `companies_domain_unique` (`domain`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users table
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `last_logged_in_at` timestamp NULL DEFAULT NULL,
  `locale` varchar(10) DEFAULT 'en-GB',
  `landing_page` varchar(255) DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT 1,
  `created_from` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_deleted_at_unique` (`email`, `deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Companies relationship table
CREATE TABLE `user_companies` (
  `user_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`, `company_id`),
  KEY `user_companies_company_id_foreign` (`company_id`),
  CONSTRAINT `user_companies_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_companies_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories table
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `color` varchar(7) DEFAULT '#55588b',
  `enabled` tinyint(1) DEFAULT 1,
  `created_from` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `categories_company_id_index` (`company_id`),
  KEY `categories_type_index` (`type`),
  CONSTRAINT `categories_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Currencies table
CREATE TABLE `currencies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(3) NOT NULL,
  `rate` decimal(15,8) DEFAULT 1.00000000,
  `precision` varchar(10) DEFAULT '2',
  `symbol` varchar(10) DEFAULT NULL,
  `symbol_first` tinyint(1) DEFAULT 1,
  `decimal_mark` varchar(1) DEFAULT '.',
  `thousands_separator` varchar(1) DEFAULT ',',
  `enabled` tinyint(1) DEFAULT 1,
  `created_from` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `currencies_company_id_index` (`company_id`),
  KEY `currencies_code_index` (`code`),
  UNIQUE KEY `currencies_company_code_deleted_unique` (`company_id`, `code`, `deleted_at`),
  CONSTRAINT `currencies_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Taxes table
CREATE TABLE `taxes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `rate` decimal(15,4) NOT NULL,
  `type` varchar(255) DEFAULT 'normal',
  `enabled` tinyint(1) DEFAULT 1,
  `created_from` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `taxes_company_id_index` (`company_id`),
  CONSTRAINT `taxes_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Accounts table
CREATE TABLE `accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL,
  `type` varchar(255) DEFAULT 'bank',
  `name` varchar(255) NOT NULL,
  `number` varchar(255) NOT NULL,
  `currency_code` varchar(3) DEFAULT 'USD',
  `opening_balance` decimal(15,4) DEFAULT 0.0000,
  `bank_name` varchar(255) DEFAULT NULL,
  `bank_phone` varchar(255) DEFAULT NULL,
  `bank_address` text DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT 1,
  `created_from` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `accounts_company_id_index` (`company_id`),
  CONSTRAINT `accounts_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contacts table
CREATE TABLE `contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `tax_number` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `zip_code` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `currency_code` varchar(3) DEFAULT 'USD',
  `reference` varchar(255) DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT 1,
  `created_from` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contacts_company_id_index` (`company_id`),
  KEY `contacts_type_index` (`type`),
  KEY `contacts_user_id_index` (`user_id`),
  CONSTRAINT `contacts_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `contacts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Items table
CREATE TABLE `items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `sku` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `sale_price` decimal(15,4) NOT NULL,
  `purchase_price` decimal(15,4) NOT NULL,
  `quantity` int(11) DEFAULT 0,
  `category_id` int(11) DEFAULT NULL,
  `tax_id` int(11) DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT 1,
  `created_from` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `items_company_id_index` (`company_id`),
  UNIQUE KEY `items_company_sku_deleted_unique` (`company_id`, `sku`, `deleted_at`),
  CONSTRAINT `items_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default data
INSERT INTO `companies` (`domain`, `enabled`) VALUES 
('default-company', 1);

INSERT INTO `categories` (`company_id`, `name`, `type`, `color`) VALUES 
(1, 'General', 'income', '#6da252'),
(1, 'General', 'expense', '#e85656'),
(1, 'General', 'item', '#55588b'),
(1, 'General', 'other', '#328aff');

INSERT INTO `currencies` (`company_id`, `name`, `code`, `rate`, `symbol`, `symbol_first`) VALUES 
(1, 'US Dollar', 'USD', 1.00000000, '$', 1),
(1, 'Euro', 'EUR', 0.85000000, '€', 0),
(1, 'British Pound', 'GBP', 0.75000000, '£', 1);

INSERT INTO `taxes` (`company_id`, `name`, `rate`, `type`) VALUES 
(1, 'VAT', 20.0000, 'normal'),
(1, 'GST', 10.0000, 'normal'),
(1, 'Sales Tax', 8.5000, 'normal');
