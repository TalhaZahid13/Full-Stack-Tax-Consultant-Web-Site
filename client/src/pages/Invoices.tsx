import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  XMarkIcon,
  DocumentTextIcon,
  EyeIcon,
  PaperAirplaneIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';

interface Invoice {
  id: number;
  invoice_number: string;
  customer: string;
  amount: number;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue';
  date: string;
  due_date: string;
  created_at: string;
}

interface InvoiceForm {
  customer: string;
  amount: number;
  description: string;
  date: string;
  due_date: string;
}

// Sample data
const initialInvoices: Invoice[] = [
  {
    id: 1,
    invoice_number: 'INV-001',
    customer: 'ABC Corp',
    amount: 2500.00,
    status: 'paid',
    date: '2024-01-15',
    due_date: '2024-02-15',
    created_at: '2024-01-15',
  },
  {
    id: 2,
    invoice_number: 'INV-002',
    customer: 'XYZ Company',
    amount: 1200.00,
    status: 'sent',
    date: '2024-01-20',
    due_date: '2024-02-20',
    created_at: '2024-01-20',
  },
];

const customers = ['ABC Corp', 'XYZ Company', 'John Smith', 'Tech Solutions Inc.'];

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InvoiceForm>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  });

  const onSubmit = (data: InvoiceForm) => {
    const newInvoice: Invoice = {
      id: Date.now(),
      invoice_number: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      customer: data.customer,
      amount: data.amount,
      status: 'draft',
      date: data.date,
      due_date: data.due_date,
      created_at: new Date().toISOString().split('T')[0],
    };

    setInvoices([newInvoice, ...invoices]);
    setIsModalOpen(false);
    reset({
      date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    toast.success('Invoice created successfully!');
  };

  const deleteInvoice = (id: number) => {
    setInvoices(invoices.filter(invoice => invoice.id !== id));
    toast.success('Invoice deleted successfully!');
  };

  const updateInvoiceStatus = (id: number, status: Invoice['status']) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === id ? { ...invoice, status } : invoice
    ));
    toast.success(`Invoice marked as ${status}!`);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'viewed': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
    filteredInvoices.forEach(invoice => {
      totals.total += invoice.amount;
      if (invoice.status === 'paid') {
        totals.paid += invoice.amount;
      } else {
        totals.pending += invoice.amount;
      }
    });
    return totals;
  };

  const totals = getTotalsByStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Invoices</h1>
            <p className="text-gray-400">Create and manage invoices for your customers</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600"
          >
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Create New Invoice
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="block text-sm font-medium text-gray-300 mb-2">Total Amount</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totals.total)}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white-700">Paid</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totals.paid)}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white-700">Pending</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(totals.pending)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-300">Search</label>
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="viewed">Viewed</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-gray-800 shadow rounded-lg p-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-medium text-white-700">
            Invoices ({filteredInvoices.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredInvoices.map((invoice) => (
            <div key={invoice.id} className="p-6 hover:bg-gray-700 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <DocumentTextIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white-700">{invoice.invoice_number}</h4>
                    <div className="flex items-center space-x-4 text-sml text-white-700">
                      <span>{invoice.customer}</span>
                      <span>•</span>
                      <span>Due: {invoice.due_date}</span>
                      <span>•</span>
                      <span>Created: {invoice.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-semibold text-white-700">{formatCurrency(invoice.amount)}</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {invoice.status === 'draft' && (
                      <button
                        onClick={() => updateInvoiceStatus(invoice.id, 'sent')}
                        className="text-blue-600 hover:text-blue-800"
                        title="Send Invoice"
                      >
                        <PaperAirplaneIcon className="h-5 w-5" />
                      </button>
                    )}
                    {(invoice.status === 'sent' || invoice.status === 'viewed') && (
                      <button
                        onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                        className="text-green-600 hover:text-green-800"
                        title="Mark as Paid"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteInvoice(invoice.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredInvoices.length === 0 && (
            <div className="p-12 text-center">
              <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating your first invoice.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Invoice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 bg-gray-800 shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white-700">Create New Invoice</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:bg-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white-700">Customer *</label>
                <select
                  {...register('customer', { required: 'Customer is required' })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select customer</option>
                  {customers.map((customer) => (
                    <option key={customer} value={customer}>{customer}</option>
                  ))}
                </select>
                {errors.customer && <p className="mt-1 text-sm text-red-600">{errors.customer.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white-700">Amount *</label>
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
                <label className="block text-sm font-medium text-white-700">Description *</label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white-700">Invoice Date *</label>
                <input
                  {...register('date', { required: 'Date is required' })}
                  type="date"
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white-700">Due Date *</label>
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
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
