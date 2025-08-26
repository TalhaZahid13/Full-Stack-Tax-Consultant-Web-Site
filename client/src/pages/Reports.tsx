import React, { useState } from 'react';
import {
  ChartBarIcon,
  DocumentChartBarIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

const reportTypes = [
  {
    id: 'profit-loss',
    name: 'Profit & Loss',
    description: 'Overview of revenues and expenses',
    icon: ChartBarIcon,
    color: 'bg-blue-500',
  },
  {
    id: 'income-summary',
    name: 'Income Summary',
    description: 'Detailed breakdown of income sources',
    icon: CurrencyDollarIcon,
    color: 'bg-green-500',
  },
  {
    id: 'expense-summary',
    name: 'Expense Summary',
    description: 'Analysis of expense categories',
    icon: DocumentChartBarIcon,
    color: 'bg-red-500',
  },
  {
    id: 'cash-flow',
    name: 'Cash Flow',
    description: 'Track money in and out',
    icon: ArrowDownTrayIcon,
    color: 'bg-purple-500',
  },
];

const sampleData = {
  'profit-loss': {
    revenue: 45231.89,
    expenses: 12234.56,
    netProfit: 32997.33,
    profitMargin: 72.9,
  },
  'income-summary': {
    totalIncome: 45231.89,
    categories: [
      { name: 'Sales Revenue', amount: 35000, percentage: 77.4 },
      { name: 'Service Income', amount: 8000, percentage: 17.7 },
      { name: 'Other Income', amount: 2231.89, percentage: 4.9 },
    ],
  },
  'expense-summary': {
    totalExpenses: 12234.56,
    categories: [
      { name: 'Office Supplies', amount: 4500, percentage: 36.8 },
      { name: 'Marketing', amount: 3200, percentage: 26.2 },
      { name: 'Utilities', amount: 2534.56, percentage: 20.7 },
      { name: 'Other', amount: 2000, percentage: 16.3 },
    ],
  },
};

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('this-month');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const generateReport = (reportId: string) => {
    setSelectedReport(reportId);
  };

  const renderReportContent = () => {
    if (!selectedReport) return null;

    const data = sampleData[selectedReport as keyof typeof sampleData];
    
    if (selectedReport === 'profit-loss') {
      const plData = data as typeof sampleData['profit-loss'];
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Total Revenue</h3>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(plData.revenue)}</p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800">Total Expenses</h3>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(plData.expenses)}</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">Net Profit</h3>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(plData.netProfit)}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-2">Profit Margin</h4>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-blue-600 h-4 rounded-full" 
                style={{ width: `${plData.profitMargin}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-600">{plData.profitMargin}% profit margin</p>
          </div>
        </div>
      );
    }

    if (selectedReport === 'income-summary') {
      const incomeData = data as typeof sampleData['income-summary'];
      return (
        <div className="space-y-6">
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800">Total Income</h3>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(incomeData.totalIncome)}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Income by Category</h4>
            <div className="space-y-4">
              {incomeData.categories.map((category, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h5 className="font-medium">{category.name}</h5>
                    <p className="text-sm text-gray-600">{category.percentage}% of total</p>
                  </div>
                  <span className="text-lg font-semibold">{formatCurrency(category.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (selectedReport === 'expense-summary') {
      const expenseData = data as typeof sampleData['expense-summary'];
      return (
        <div className="space-y-6">
          <div className="bg-red-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800">Total Expenses</h3>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(expenseData.totalExpenses)}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Expenses by Category</h4>
            <div className="space-y-4">
              {expenseData.categories.map((category, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h5 className="font-medium">{category.name}</h5>
                    <p className="text-sm text-gray-600">{category.percentage}% of total</p>
                  </div>
                  <span className="text-lg font-semibold">{formatCurrency(category.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Report data will be displayed here.</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Financial Reports</h1>
            <p className="text-gray-400">Generate and view comprehensive financial reports</p>
          </div>
          <div className="flex space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="nline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600"
            >
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="this-quarter">This Quarter</option>
              <option value="this-year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTypes.map((report) => (
          <div
            key={report.id}
            className={`bg-white shadow rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow ${
              selectedReport === report.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => generateReport(report.id)}
          >
            <div className="flex items-center">
              <div className={`${report.color} p-3 rounded-lg`}>
                <report.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-400">{report.name}</h3>
                <p className="text-sm text-gray-400">{report.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Content */}
      {selectedReport && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-300">
              {reportTypes.find(r => r.id === selectedReport)?.name} Report
            </h2>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export PDF
            </button>
          </div>
          {renderReportContent()}
        </div>
      )}

      {!selectedReport && (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Report Type</h3>
          <p className="text-gray-600">Choose from the report types above to generate financial insights.</p>
        </div>
      )}
    </div>
  );
}
