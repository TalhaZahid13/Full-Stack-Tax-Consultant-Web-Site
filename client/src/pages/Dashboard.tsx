import React from "react";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentTextIcon,
  ReceiptPercentIcon,
  CreditCardIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// Dummy graph data
const revenueData = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 15000 },
  { month: "Mar", revenue: 18000 },
  { month: "Apr", revenue: 20000 },
  { month: "May", revenue: 17000 },
  { month: "Jun", revenue: 22000 },
];

const expensesData = [
  { month: "Jan", expenses: 8000 },
  { month: "Feb", expenses: 9500 },
  { month: "Mar", expenses: 10000 },
  { month: "Apr", expenses: 12000 },
  { month: "May", expenses: 9000 },
  { month: "Jun", expenses: 11000 },
];

const profitData = [
  { month: "Jan", profit: 4000 },
  { month: "Feb", profit: 5500 },
  { month: "Mar", profit: 8000 },
  { month: "Apr", profit: 8000 },
  { month: "May", profit: 8000 },
  { month: "Jun", profit: 11000 },
];

const invoiceData = [
  { name: "Paid", value: 65 },
  { name: "Outstanding", value: 35 },
];

export default function DashboardContent({
  user,
  stats,
  recentTransactions,

}: any) {
  const COLORS = ["#3b82f6", "#22c55e", "#ef4444", "#eab308", "#a855f7"]
  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
    {/* Welcome Section */}
    <div className="mb-10">
      <h1 className="text-3xl font-extrabold tracking-tight">
        Good Morning, {user?.name || "User"} 🌟
      </h1>
      <p className="mt-2 text-slate-400">
        Here's what's happening with your business today.
      </p>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {(stats ?? []).map((item: any) => (
        <div
          key={item.name}
          className="relative bg-slate-800/70 backdrop-blur-lg border border-slate-700 shadow-xl rounded-2xl p-6 hover:scale-105 transition-transform"
        >
          <div className="absolute -top-3 -left-3 bg-blue-600 p-3 rounded-xl shadow-lg">
            <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <p className="ml-10 text-sm font-medium text-slate-400">{item.name}</p>
          <p className="ml-10 mt-2 text-3xl font-bold text-white">{item.value}</p>
          <p
            className={`ml-10 mt-1 text-sm font-semibold ${
              item.changeType === "increase" ? "text-green-400" : "text-red-400"
            }`}
          >
            {item.change}
          </p>
        </div>
      ))}
    </div>

    {/* Main Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Recent Transactions */}
      <div className="bg-slate-800/70 backdrop-blur-lg border border-slate-700 shadow-xl rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-6">💳 Recent Transactions</h3>
        <ul className="divide-y divide-slate-700">
          {(recentTransactions ?? []).map((transaction: any) => (
            <li key={transaction.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`p-2 rounded-full ${
                    transaction.type === "income"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {transaction.type === "income" ? (
                    <ArrowTrendingUpIcon className="h-5 w-5" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-slate-400">{transaction.date}</p>
                </div>
              </div>
              <span
                className={`font-semibold ${
                  transaction.type === "income" ? "text-green-400" : "text-red-400"
                }`}
              >
                {transaction.amount}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 text-center">
          <a
            href="/transactions"
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md"
          >
            View all transactions
          </a>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800/70 backdrop-blur-lg border border-slate-700 shadow-xl rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-6">⚡ Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <a
            href="/sales/invoices/create"
            className="group bg-slate-700/40 p-5 rounded-xl border border-slate-600 hover:bg-slate-700 transition"
          >
            <DocumentTextIcon className="h-7 w-7 text-blue-400 group-hover:scale-110 transition" />
            <p className="mt-3 font-medium">New Invoice</p>
            <p className="text-xs text-slate-400">Send invoices to customers</p>
          </a>

          <a
            href="/purchases/bills/create"
            className="group bg-slate-700/40 p-5 rounded-xl border border-slate-600 hover:bg-slate-700 transition"
          >
            <ReceiptPercentIcon className="h-7 w-7 text-green-400 group-hover:scale-110 transition" />
            <p className="mt-3 font-medium">New Bill</p>
            <p className="text-xs text-slate-400">Record vendor bills</p>
          </a>

          <a
            href="/transactions/create"
            className="group bg-slate-700/40 p-5 rounded-xl border border-slate-600 hover:bg-slate-700 transition"
          >
            <CreditCardIcon className="h-7 w-7 text-purple-400 group-hover:scale-110 transition" />
            <p className="mt-3 font-medium">Add Transaction</p>
            <p className="text-xs text-slate-400">Record income or expense</p>
          </a>

          <a
            href="/contacts/create"
            className="group bg-slate-700/40 p-5 rounded-xl border border-slate-600 hover:bg-slate-700 transition"
          >
            <BanknotesIcon className="h-7 w-7 text-yellow-400 group-hover:scale-110 transition" />
            <p className="mt-3 font-medium">New Contact</p>
            <p className="text-xs text-slate-400">Add customers or vendors</p>
          </a>
        </div>
      </div>
    </div>

    {/* Analytics Graphs */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
      {/* Total Revenue */}
      <div className="bg-slate-800/70 backdrop-blur-lg rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-semibold mb-4">📈 Total Revenue</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={revenueData ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Total Expenses */}
      <div className="bg-slate-800/70 backdrop-blur-lg rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-semibold mb-4">📉 Total Expenses</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={expensesData ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="expenses" fill="#ef4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Net Profit */}
      <div className="bg-slate-800/70 backdrop-blur-lg rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-semibold mb-4">💰 Net Profit</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={profitData ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="profit" stroke="#22c55e" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Outstanding Invoices */}
      <div className="bg-slate-800/70 backdrop-blur-lg rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-semibold mb-4">🧾 Outstanding Invoices</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={invoiceData ?? []}
              cx="50%"
              cy="50%"
              outerRadius={90}
              dataKey="value"
              label
            >
              {(invoiceData ?? []).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);
}