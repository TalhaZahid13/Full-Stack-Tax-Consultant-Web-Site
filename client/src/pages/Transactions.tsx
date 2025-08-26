import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface Transaction {
  id: number;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  category: string;
  account: string;
  contact?: string;
  reference?: string;
  date: string;
  created_at: string;
}

interface TransactionForm {
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  category: string;
  account: string;
  contact?: string;
  reference?: string;
  date: string;
}

// Sample data
const initialTransactions: Transaction[] = [
  {
    id: 1,
    type: 'income',
    amount: 2500.00,
    description: 'Monthly salary',
    category: 'Salary',
    account: 'Main Checking',
    contact: 'ABC Company',
    date: '2024-01-15',
    created_at: '2024-01-15',
  },
  {
    id: 2,
    type: 'expense',
    amount: 150.75,
    description: 'Office supplies purchase',
    category: 'Office Expenses',
    account: 'Main Checking',
    contact: 'Office Depot',
    reference: 'INV-001',
    date: '2024-01-14',
    created_at: '2024-01-14',
  },
  {
    id: 3,
    type: 'income',
    amount: 1200.00,
    description: 'Consulting services',
    category: 'Services',
    account: 'Business Savings',
    contact: 'XYZ Corp',
    reference: 'INV-102',
    date: '2024-01-12',
    created_at: '2024-01-12',
  },
];

const categories = {
  income: ['Sales', 'Services', 'Salary', 'Interest', 'Other Income'],
  expense: ['Office Expenses', 'Marketing', 'Utilities', 'Travel', 'Equipment', 'Other Expenses'],
  transfer: ['Internal Transfer']
};

const accounts = ['Main Checking', 'Business Savings', 'Petty Cash', 'Credit Card'];
const contacts = ['ABC Company', 'XYZ Corp', 'Office Depot', 'John Smith', 'Sarah Johnson'];

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense' | 'transfer'>('all');
  const [filterAccount, setFilterAccount] = useState<string>('all');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<TransactionForm>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    },
  });

  const watchType = watch('type');

  const onSubmit = (data: TransactionForm) => {
    const newTransaction: Transaction = {
      id: Date.now(),
      ...data,
      created_at: new Date().toISOString().split('T')[0],
    };

    setTransactions([newTransaction, ...transactions]);
    setIsModalOpen(false);
    reset({
      date: new Date().toISOString().split('T')[0],
    });
    toast.success('Transaction added successfully!');
  };

  const deleteTransaction = (id: number) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
    toast.success('Transaction deleted successfully!');
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
                         (transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesAccount = filterAccount === 'all' || transaction.account === filterAccount;
    return matchesSearch && matchesType && matchesAccount;
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return ArrowUpIcon;
      case 'expense':
        return ArrowDownIcon;
      default:
        return ArrowUpIcon;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'income': return 'text-green-600 bg-green-100';
      case 'expense': return 'text-red-600 bg-red-100';
      case 'transfer': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getTotalsByType = () => {
    const totals = { income: 0, expense: 0, net: 0 };
    filteredTransactions.forEach(transaction => {
      if (transaction.type === 'income') {
        totals.income += transaction.amount;
      } else if (transaction.type === 'expense') {
        totals.expense += transaction.amount;
      }
    });
    totals.net = totals.income - totals.expense;
    return totals;
  };

  const totals = getTotalsByType();

return (
  <div className="space-y-6">
    {/* Header */}
    <div className="bg-gray-800 shadow rounded-lg p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Transactions</h1>
          <p className="text-gray-400">
            View and manage all your financial transactions
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Transaction
        </button>
      </div>
    </div>

    {/* Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-r from-green-500 to-green-600 shadow rounded-lg p-6 text-white">
        <div className="flex items-center">
          <ArrowUpIcon className="h-8 w-8 text-white" />
          <div className="ml-4">
            <p className="text-sm">Total Income</p>
            <p className="text-2xl font-bold">{formatCurrency(totals.income)}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-red-500 to-red-600 shadow rounded-lg p-6 text-white">
        <div className="flex items-center">
          <ArrowDownIcon className="h-8 w-8 text-white" />
          <div className="ml-4">
            <p className="text-sm">Total Expenses</p>
            <p className="text-2xl font-bold">{formatCurrency(totals.expense)}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 shadow rounded-lg p-6 text-white">
        <div className="flex items-center">
          <FunnelIcon className="h-8 w-8 text-white" />
          <div className="ml-4">
            <p className="text-sm">Net Income</p>
            <p className="text-2xl font-bold">{formatCurrency(totals.net)}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Filters */}
    <div className="bg-gray-800 shadow rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Search
          </label>
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-8 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-3 focus:ring-green-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Type
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Account
          </label>
          <select
            value={filterAccount}
            onChange={(e) => setFilterAccount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Accounts</option>
            {accounts.map((account) => (
              <option key={account} value={account}>
                {account}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterType("all");
              setFilterAccount("all");
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    {/* Transactions List */}
    <div className="bg-gray-800 shadow rounded-lg p-6">
      <div className="bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-2xl font-bold text-white">
          Transactions ({filteredTransactions.length})
        </h3>
      </div>
      <div className="block text-sm font-medium text-gray-300 mb-2">
        {filteredTransactions.map((transaction) => {
          const IconComponent = getTransactionIcon(transaction.type);
          return (
            <div
              key={transaction.id}
              className="p-6 hover:bg-gray-700 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex-shrink-0 p-2 rounded-full ${getTransactionColor(
                      transaction.type
                    )}`}
                  >
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="block text-sm font-medium text-gray-300 mb-2">
                      {transaction.description}
                    </h4>
                    <div className="flex items-center space-x-4 block text-sm font-medium text-gray-300 mb-2">
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span>{transaction.account}</span>
                      {transaction.contact && (
                        <>
                          <span>•</span>
                          <span>{transaction.contact}</span>
                        </>
                      )}
                      {transaction.reference && (
                        <>
                          <span>•</span>
                          <span>Ref: {transaction.reference}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{transaction.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p
                      className={`text-lg font-semibold ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "expense" ? "-" : "+"}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">
                      {transaction.type}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteTransaction(transaction.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filteredTransactions.length === 0 && (
          <div className="p-12 text-center">
            <ArrowUpIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No transactions found
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterType !== "all" || filterAccount !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first transaction."}
            </p>
          </div>
        )}
      </div>
    </div>

    {/* Modal */}
    {isModalOpen && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-70 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">
              Add New Transaction
            </h3>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-400 hover:text-gray-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Type *</label>
                <select
                  {...register('type', { required: 'Type is required' })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select type</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                  <option value="transfer">Transfer</option>
                </select>
                {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Amount *</label>
                <input
                  {...register('amount', {
                    required: 'Amount is required',
                    valueAsNumber: true,
                    min: { value: 0.01, message: 'Amount must be greater than 0' }
                  })}
                  type="number"
                  step="0.01"
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Description *</label>
                <input
                  {...register('description', { required: 'Description is required' })}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Category *</label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select category</option>
                  {watchType && categories[watchType as keyof typeof categories]?.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Account *</label>
                <select
                  {...register('account', { required: 'Account is required' })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select account</option>
                  {accounts.map((account) => (
                    <option key={account} value={account}>{account}</option>
                  ))}
                </select>
                {errors.account && <p className="mt-1 text-sm text-red-600">{errors.account.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Contact</label>
                <select
                  {...register('contact')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select contact (optional)</option>
                  {contacts.map((contact) => (
                    <option key={contact} value={contact}>{contact}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Reference</label>
                <input
                  {...register('reference')}
                  type="text"
                  placeholder="Invoice number, receipt, etc."
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Date *</label>
                <input
                  {...register('date', { required: 'Date is required' })}
                  type="date"
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
