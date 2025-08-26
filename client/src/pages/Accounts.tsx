import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  XMarkIcon,
  BanknotesIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  EyeIcon,
  EyeSlashIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';

interface Account {
  id: number;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'cash';
  number: string;
  bank: string;
  currency: string;
  opening_balance: number;
  current_balance: number;
  enabled: boolean;
  created_at: string;
}

interface AccountForm {
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'cash';
  number: string;
  bank?: string;
  currency: string;
  opening_balance: number;
}

// Sample data
const initialAccounts: Account[] = [
  {
    id: 1,
    name: 'Main Checking Account',
    type: 'checking',
    number: '****1234',
    bank: 'First National Bank',
    currency: 'USD',
    opening_balance: 10000,
    current_balance: 15234.67,
    enabled: true,
    created_at: '2024-01-01',
  },
  {
    id: 2,
    name: 'Business Savings',
    type: 'savings',
    number: '****5678',
    bank: 'Commerce Bank',
    currency: 'USD',
    opening_balance: 25000,
    current_balance: 32150.89,
    enabled: true,
    created_at: '2024-01-15',
  },
  {
    id: 3,
    name: 'Petty Cash',
    type: 'cash',
    number: 'CASH-001',
    bank: 'N/A',
    currency: 'USD',
    opening_balance: 500,
    current_balance: 345.25,
    enabled: true,
    created_at: '2024-01-01',
  },
];

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBalances, setShowBalances] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<AccountForm>();

  const watchAccountType = watch('type');

  const onSubmit = (data: AccountForm) => {
    const newAccount: Account = {
      id: Date.now(),
      ...data,
      bank: data.type === 'cash' ? 'N/A' : (data.bank || ''),
      current_balance: data.opening_balance,
      enabled: true,
      created_at: new Date().toISOString().split('T')[0],
    };

    setAccounts([newAccount, ...accounts]);
    setIsModalOpen(false);
    reset();
    toast.success('Account added successfully!');
  };

  const toggleAccountStatus = (id: number) => {
    setAccounts(accounts.map(account =>
      account.id === id
        ? { ...account, enabled: !account.enabled }
        : account
    ));
    toast.success('Account status updated!');
  };

  const deleteAccount = (id: number) => {
    setAccounts(accounts.filter(account => account.id !== id));
    toast.success('Account deleted successfully!');
  };

  const filteredAccounts = accounts.filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return BuildingLibraryIcon;
      case 'savings':
        return BanknotesIcon;
      case 'credit':
        return CreditCardIcon;
      case 'cash':
        return BanknotesIcon;
      default:
        return BanknotesIcon;
    }
  };

  const getAccountColor = (type: string) => {
    switch (type) {
      case 'checking': return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
      case 'savings': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'credit': return 'bg-gradient-to-r from-orange-500 to-amber-500 text-white';
      case 'cash': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getTotalBalance = () => {
    return accounts
      .filter(account => account.enabled)
      .reduce((total, account) => total + account.current_balance, 0);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-gray-800 shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Accounts</h1>
            <p className="text-gray-400">Manage your bank accounts and financial accounts</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600"
          >
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Add New Account
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">Total Balance</p>
              <p className="block text-sm font-medium text-gray-300 mb-2">
                {showBalances ? formatCurrency(getTotalBalance()) : '****'}
              </p>
            </div>
            <button
              onClick={() => setShowBalances(!showBalances)}
              className="text-gray-500 hover:bg-gray-700"
            >
              {showBalances ? <EyeSlashIcon className="h-6 w-6" /> : <EyeIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <div className="bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BuildingLibraryIcon className="h-10 w-10 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-white">Active Accounts</p>
              <p className="block text-sm font-medium text-gray-300 mb-2">
                {accounts.filter(a => a.enabled).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BanknotesIcon className="h-10 w-10 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-white">Total Accounts</p>
              <p className="block text-sm font-medium text-gray-300 mb-2">{accounts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-gray-800 shadow rounded-lg p-6">
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-300 mb-2">Search Accounts</label>
          <input
            type="text"
            placeholder="Search by name, bank, or account number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Accounts List */}
      <div className="text-2xl font-bold text-white">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-white">
            Accounts ({filteredAccounts.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredAccounts.map((account) => {
            const IconComponent = getAccountIcon(account.type);
            return (
              <div key={account.id} className="p-6 hover:bg-gray-700 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <IconComponent className="h-10 w-10 text-gray-500" />
                    </div>
                    <div>
                      <h4 className="block text-sm font-medium text-gray-300 mb-2">{account.name}</h4>
                      <div className="flex items-center space-x-3 block text-sm font-medium text-gray-300 mb-2">
                        <span>{account.bank}</span>
                        <span>•</span>
                        <span>{account.number}</span>
                        <span>•</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getAccountColor(account.type)}`}>
                          {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="block text-sm font-medium text-gray-300 mb-2">
                        {showBalances ? formatCurrency(account.current_balance) : '****'}
                      </p>
                      <p className="block text-sm font-medium text-gray-300 mb-2">Current Balance</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleAccountStatus(account.id)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full transition ${
                          account.enabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {account.enabled ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => deleteAccount(account.id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredAccounts.length === 0 && (
            <div className="p-12 text-center">
              <BuildingLibraryIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No accounts found</h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Try adjusting your search criteria.' 
                  : 'Get started by adding your first account.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Add New Account</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Account Name *</label>
                <input
                  {...register('name', { required: 'Account name is required' })}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Account Type *</label>
                <select
                  {...register('type', { required: 'Account type is required' })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select type</option>
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                  <option value="credit">Credit Card</option>
                  <option value="cash">Cash</option>
                </select>
                {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Account Number</label>
                <input
                  {...register('number')}
                  type="text"
                  placeholder="Last 4 digits recommended"
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {watchAccountType && watchAccountType !== 'cash' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300">Bank Name *</label>
                  <input
                    {...register('bank', { required: 'Bank name is required' })}
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {errors.bank && <p className="mt-1 text-sm text-red-600">{errors.bank.message}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300">Currency *</label>
                <select
                  {...register('currency', { required: 'Currency is required' })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select currency</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
                {errors.currency && <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Opening Balance *</label>
                <input
                  {...register('opening_balance', {
                    required: 'Opening balance is required',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Balance cannot be negative' }
                  })}
                  type="number"
                  step="0.01"
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.opening_balance && <p className="mt-1 text-sm text-red-600">{errors.opening_balance.message}</p>}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition"
                >
                  Add Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
