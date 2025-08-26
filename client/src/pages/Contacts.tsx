import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  UserPlusIcon,
  XMarkIcon,
  UserIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: 'customer' | 'vendor' | 'employee';
  company?: string;
  address?: string;
  created_at: string;
}

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  type: 'customer' | 'vendor' | 'employee';
  company?: string;
  address?: string;
}

// Sample data
const initialContacts: Contact[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    type: 'customer',
    company: 'ABC Corp',
    created_at: '2024-01-15',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@vendor.com',
    phone: '+1 (555) 987-6543',
    type: 'vendor',
    company: 'Supply Co',
    created_at: '2024-01-20',
  },
];

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'customer' | 'vendor' | 'employee'>('all');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>();

  const onSubmit = (data: ContactForm) => {
    const newContact: Contact = {
      id: Date.now(),
      ...data,
      created_at: new Date().toISOString().split('T')[0],
    };

    setContacts([newContact, ...contacts]);
    setIsModalOpen(false);
    reset();
    toast.success('Contact added successfully!');
  };

  const deleteContact = (id: number) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    toast.success('Contact deleted successfully!');
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (contact.company?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesType = filterType === 'all' || contact.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'customer': return 'bg-green-100 text-green-800';
      case 'vendor': return 'bg-blue-100 text-blue-800';
      case 'employee': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

return (
  <div className="space-y-6 bg-gray-900 min-h-screen p-6 text-white">
    {/* Header */}
    <div className="bg-gray-800 shadow rounded-lg p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Contacts</h1>
          <p className="text-gray-400">Manage your customers, vendors, and employees</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600"
        >
          <UserPlusIcon className="h-5 w-5 mr-2" />
          Add New Contact
        </button>
      </div>
    </div>

    {/* Filters */}
    <div className="bg-gray-800 shadow rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Types</option>
            <option value="customer">Customers</option>
            <option value="vendor">Vendors</option>
            <option value="employee">Employees</option>
          </select>
        </div>
      </div>
    </div>

    {/* Contacts List */}
    <div className="bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700">
        <h3 className="text-lg font-medium text-white">
          Contacts ({filteredContacts.length})
        </h3>
      </div>
      <div className="divide-y divide-gray-700">
        {filteredContacts.map((contact) => (
          <div key={contact.id} className="p-6 hover:bg-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <UserIcon className="h-10 w-10 text-gray-400" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white">{contact.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="flex items-center">
                      <EnvelopeIcon className="h-4 w-4 mr-1" />
                      {contact.email}
                    </span>
                    <span className="flex items-center">
                      <PhoneIcon className="h-4 w-4 mr-1" />
                      {contact.phone}
                    </span>
                    {contact.company && (
                      <span className="flex items-center">
                        <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                        {contact.company}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(contact.type)}`}>
                  {contact.type.charAt(0).toUpperCase() + contact.type.slice(1)}
                </span>
                <button
                  onClick={() => deleteContact(contact.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredContacts.length === 0 && (
          <div className="p-12 text-center">
            <UserIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No contacts found</h3>
            <p className="text-gray-400">
              {searchTerm || filterType !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first contact.'}
            </p>
          </div>
        )}
      </div>
    </div>

    {/* Add Contact Modal */}
    {isModalOpen && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-70 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Add New Contact</h3>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-400 hover:text-gray-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300">Name *</label>
              <input
                {...register('name', { required: 'Name is required' })}
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300">Email *</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                type="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-300">Phone</label>
              <input
                {...register('phone')}
                type="tel"
                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300">Type *</label>
              <select
                {...register('type', { required: 'Type is required' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select type</option>
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
                <option value="employee">Employee</option>
              </select>
              {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>}
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-300">Company</label>
              <input
                {...register('company')}
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-300">Address</label>
              <textarea
                {...register('address')}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* File Uploads */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Upload Documents</label>
              {['CNIC Copy', 'Bank Statements', 'Salary Certificates', 'Business Registration', 'Previous Tax Returns'].map((doc, index) => (
                <div key={index}>
                  <span className="text-gray-400">{doc}</span>
                  <input type="file" className="mt-1 block w-full text-sm text-gray-300" />
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Add Contact
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);
}
