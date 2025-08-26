import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  XMarkIcon,
  DocumentTextIcon,
  CreditCardIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface Bill {
  id: number;
  bill_number: string;
  vendor: string;
  amount: number;
  status: 'draft' | 'received' | 'partial' | 'paid';
  date: string;
  due_date: string;
  category: string;
  created_at: string;
}

interface BillForm {
  vendor: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  due_date: string;
}

const initialBills: Bill[] = [
  {
    id: 1,
    bill_number: 'BILL-001',
    vendor: 'Office Supplies Co',
    amount: 450.75,
    status: 'paid',
    date: '2024-01-10',
    due_date: '2024-02-10',
    category: 'Office Expenses',
    created_at: '2024-01-10',
  },
  {
    id: 2,
    bill_number: 'BILL-002',
    vendor: 'Electric Company',
    amount: 325.5,
    status: 'received',
    date: '2024-01-15',
    due_date: '2024-02-15',
    category: 'Utilities',
    created_at: '2024-01-15',
  },
];

const vendors = ['Office Supplies Co', 'Electric Company', 'Internet Provider', 'Cleaning Service'];
const categories = ['Office Expenses', 'Utilities', 'Marketing', 'Travel', 'Equipment', 'Professional Services'];

export default function Bills() {
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BillForm>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  });

  const onSubmit = (data: BillForm) => {
    const newBill: Bill = {
      id: Date.now(),
      bill_number: `BILL-${String(bills.length + 1).padStart(3, '0')}`,
      vendor: data.vendor,
      amount: data.amount,
      status: 'draft',
      date: data.date,
      due_date: data.due_date,
      category: data.category,
      created_at: new Date().toISOString().split('T')[0],
    };

    setBills([newBill, ...bills]);
    setIsModalOpen(false);
    reset({
      date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    toast.success('Bill created successfully!');
  };

  const deleteBill = (id: number) => {
    setBills(bills.filter(bill => bill.id !== id));
    toast.success('Bill deleted successfully!');
  };

  const updateBillStatus = (id: number, status: Bill['status']) => {
    setBills(bills.map(bill => (bill.id === id ? { ...bill, status } : bill)));
    toast.success(`Bill marked as ${status}!`);
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch =
      bill.bill_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || bill.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-200 text-gray-800';
      case 'received':
        return 'bg-purple-100 text-purple-700';
      case 'partial':
        return 'bg-yellow-100 text-yellow-700';
      case 'paid':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getTotalsByStatus = () => {
    const totals = { total: 0, paid: 0, pending: 0 };
    filteredBills.forEach(bill => {
      totals.total += bill.amount;
      if (bill.status === 'paid') {
        totals.paid += bill.amount;
      } else {
        totals.pending += bill.amount;
      }
    });
    return totals;
  };

  const totals = getTotalsByStatus();

  return (
    <div className="space-y-6 bg-gray-900 min-h-screen p-6 text-white">
      {/* Header */}
      <div className="text-2xl font-bold text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Bills</h1>
            <p className="text-gray-400">Manage bills and payments to your vendors</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Bill
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <DocumentTextIcon className="h-10 w-10 text-blue-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-white">Total Amount</p>
              <p className="block text-sm font-medium text-gray-300 mb-2">{formatCurrency(totals.total)}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <CheckCircleIcon className="h-10 w-10 text-green-500" />
            <div className="ml-4">
              <p className="text-2xl font-medium text-white">Paid</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(totals.paid)}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <CreditCardIcon className="h-10 w-10 text-purple-500" />
            <div className="ml-4">
              <p className="text-1xl font-medium text-white">Pending</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(totals.pending)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search bills..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="received">Received</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
      </div>

<div className="bg-gray-800 shadow rounded-lg p-6">
  {/* Header */}
  <div className="text-2xl font-bold text-white">
    <h3 className="px-6 py-4 border-b border-gray-200">Bills ({filteredBills.length})</h3>
  </div>

  {/* Bills List */}
  <div className="divide-y divide-gray-200">
    {filteredBills.map((bill) => (
      <div
        key={bill.id}
        className="p-6 hover:bg-gray-700 transition"
      >
        <div className="flex items-center justify-between">
          {/* Bill Info */}
          <div className="flex items-center space-x-4">
            <DocumentTextIcon className="h-10 w-10 text-gray-500" />
            <div>
              <h4 className="text-lg font-bold text-gray-300">{bill.bill_number}</h4>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <span className="font-medium">{bill.vendor}</span>
                <span>•</span>
                <span className="font-medium">{bill.category}</span>
                <span>•</span>
                <span className="font-medium">Due: {bill.due_date}</span>
                <span>•</span>
                <span className="font-medium">Created: {bill.date}</span>
              </div>
            </div>
          </div>

          {/* Amount + Status */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-lg font-extrabold text-gray-900">
                {formatCurrency(bill.amount)}
              </p>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${getStatusColor(
                  bill.status
                )}`}
              >
                {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {(bill.status === "received" || bill.status === "partial") && (
                <button
                  onClick={() => updateBillStatus(bill.id, "paid")}
                  className="text-green-600 hover:text-green-800 transition"
                  title="Mark as Paid"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={() => deleteBill(bill.id)}
                className="text-red-600 hover:text-red-800 transition"
                title="Delete Bill"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    ))}
      {/* Empty State */}
      {filteredBills.length === 0 && (
        <div className="p-12 text-center">
          <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No bills found</h3>
          <p className="text-gray-700">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Get started by adding your first bill."}
          </p>
        </div>
      )}
    </div>
  </div>


      {/* Add Bill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Add New Bill</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-200">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Bill Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Vendor */}
              <div>
                <label className="block text-sm font-medium text-gray-300">Vendor *</label>
                <select
                  {...register('vendor', { required: 'Vendor is required' })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select vendor</option>
                  {vendors.map(vendor => (
                    <option key={vendor} value={vendor}>
                      {vendor}
                    </option>
                  ))}
                </select>
                {errors.vendor && <p className="mt-1 text-sm text-red-600">{errors.vendor.message}</p>}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-300">Amount *</label>
                <input
                  {...register('amount', {
                    required: 'Amount is required',
                    valueAsNumber: true,
                    min: { value: 0.01, message: 'Amount must be greater than 0' },
                  })}
                  type="number"
                  step="0.01"
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300">Category *</label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300">Description *</label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
              </div>

              {/* Bill Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300">Bill Date *</label>
                <input
                  {...register('date', { required: 'Date is required' })}
                  type="date"
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300">Due Date *</label>
                <input
                  {...register('due_date', { required: 'Due date is required' })}
                  type="date"
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.due_date && <p className="mt-1 text-sm text-red-600">{errors.due_date.message}</p>}
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
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition"
                >
                  Add Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

}
