import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  XMarkIcon,
  CubeIcon,
  TagIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

interface Item {
  id: number;
  name: string;
  description: string;
  type: 'product' | 'service';
  category: string;
  price: number;
  unit: string;
  tax_rate: number;
  enabled: boolean;
  created_at: string;
}

interface ItemForm {
  name: string;
  description: string;
  type: 'product' | 'service';
  category: string;
  price: number;
  unit: string;
  tax_rate: number;
}

// Sample data
const initialItems: Item[] = [
  {
    id: 1,
    name: 'Web Development Service',
    description: 'Custom web development and design services',
    type: 'service',
    category: 'Professional Services',
    price: 100.00,
    unit: 'hour',
    tax_rate: 10,
    enabled: true,
    created_at: '2024-01-01',
  },
  {
    id: 2,
    name: 'Software License',
    description: 'Annual software license subscription',
    type: 'product',
    category: 'Software',
    price: 299.99,
    unit: 'license',
    tax_rate: 8,
    enabled: true,
    created_at: '2024-01-05',
  },
  {
    id: 3,
    name: 'Consulting Service',
    description: 'Business strategy and consulting',
    type: 'service',
    category: 'Consulting',
    price: 150.00,
    unit: 'hour',
    tax_rate: 10,
    enabled: true,
    created_at: '2024-01-10',
  },
];

const categories = ['Professional Services', 'Software', 'Consulting', 'Training', 'Support', 'Products'];
const units = ['hour', 'piece', 'license', 'month', 'project', 'day'];

export default function Items() {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ItemForm>({
    defaultValues: {
      tax_rate: 10,
    },
  });

  const onSubmit = (data: ItemForm) => {
    const newItem: Item = {
      id: Date.now(),
      ...data,
      enabled: true,
      created_at: new Date().toISOString().split('T')[0],
    };

    setItems([newItem, ...items]);
    setIsModalOpen(false);
    reset({
      tax_rate: 10,
    });
    toast.success('Item added successfully!');
  };

  const deleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
    toast.success('Item deleted successfully!');
  };

  const toggleItemStatus = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, enabled: !item.enabled } : item
    ));
    toast.success('Item status updated!');
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'product': return 'bg-blue-100 text-blue-800';
      case 'service': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getAveragePrice = () => {
    if (filteredItems.length === 0) return 0;
    const total = filteredItems.reduce((sum, item) => sum + item.price, 0);
    return total / filteredItems.length;
  };

  const getItemCounts = () => {
    return {
      total: filteredItems.length,
      products: filteredItems.filter(item => item.type === 'product').length,
      services: filteredItems.filter(item => item.type === 'service').length,
      enabled: filteredItems.filter(item => item.enabled).length,
    };
  };

  const counts = getItemCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Items</h1>
            <p className="text-gray-400">Manage your products and services</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Item
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center justify-center">
            <div className="flex-shrink-0">
              <CubeIcon className="h-8 w-8 text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Total Items</p>
              <p className="text-2xl font-bold text-gray-300">{counts.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TagIcon className="h-8 w-8 text-green-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Products</p>
              <p className="text-2xl font-bold text-blue-300">{counts.products}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CubeIcon className="h-8 w-8 text-purple-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Services</p>
              <p className="text-2xl font-bold text-green-300">{counts.services}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-yellow-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Avg. Price</p>
              <p className="text-2xl font-bold text-gray-300">{formatCurrency(getAveragePrice())}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Types</option>
              <option value="product">Products</option>
              <option value="service">Services</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="text-2xl font-bold text-white">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-white">
            Items ({filteredItems.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredItems.map((item) => (
            <div key={item.id} className="p-6 hover:bg-gray-700 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <CubeIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="block text-sm font-medium text-gray-300 mb-2">{item.name}</h4>
                    <p className="block text-sm font-medium text-gray-300 mb-2">{item.description}</p>
                    <div className="flex items-center space-x-4 text-sm font-medium text-gray-300 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(item.type)}`}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </span>
                      <span>{item.category}</span>
                      <span>•</span>
                      <span>Tax: {item.tax_rate}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="block text-sm font-medium text-gray-300 mb-2">
                      {formatCurrency(item.price)}
                    </p>
                    <p className="block text-sm font-medium text-gray-300 mb-2">per {item.unit}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleItemStatus(item.id)}
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        item.enabled
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.enabled ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="p-12 text-center">
              <CubeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="block text-sm font-medium text-gray-300 mb-2">No items found</h3>
              <p className="text-gray-600">
                {searchTerm || filterType !== 'all' || filterCategory !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding your first item.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Add New Item</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Name *</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Type *</label>
                <select
                  {...register('type', { required: 'Type is required' })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select type</option>
                  <option value="product">Product</option>
                  <option value="service">Service</option>
                </select>
                {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Category *</label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Price *</label>
                  <input
                    {...register('price', {
                      required: 'Price is required',
                      valueAsNumber: true,
                      min: { value: 0.01, message: 'Price must be greater than 0' }
                    })}
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Unit *</label>
                  <select
                    {...register('unit', { required: 'Unit is required' })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select unit</option>
                    {units.map((unit) => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                  {errors.unit && <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Tax Rate (%) *</label>
                <input
                  {...register('tax_rate', {
                    required: 'Tax rate is required',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Tax rate cannot be negative' },
                    max: { value: 100, message: 'Tax rate cannot exceed 100%' }
                  })}
                  type="number"
                  step="0.01"
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.tax_rate && <p className="mt-1 text-sm text-red-600">{errors.tax_rate.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Description</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
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
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
