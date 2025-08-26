import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UsersIcon,
  BanknotesIcon,
  ArrowsRightLeftIcon,
  DocumentTextIcon,
  ReceiptPercentIcon,
  CubeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  PowerIcon,
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Contacts', href: '/contacts', icon: UsersIcon },
  { name: 'Accounts', href: '/accounts', icon: BanknotesIcon },
  { name: 'Transactions', href: '/transactions', icon: ArrowsRightLeftIcon },
  { name: 'Invoices', href: '/sales/invoices', icon: DocumentTextIcon },
  { name: 'Bills', href: '/purchases/bills', icon: ReceiptPercentIcon },
  { name: 'Items', href: '/items', icon: CubeIcon },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  return (
    <div className="h-screen flex overflow-hidden bg-slate-900 text-gray-100">
      {/* Mobile sidebar */}
      <div className={classNames(
        sidebarOpen ? 'fixed inset-0 flex z-40 md:hidden' : 'hidden'
      )}>
        <div className="fixed inset-0 bg-black bg-opacity-70" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          <SidebarContent />
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700">
          <SidebarContent />
        </div>
      </div>

      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 px-4 py-4 sm:px-6 lg:px-8 shadow-lg">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">
              {navigation.find(item => location.pathname.startsWith(item.href))?.name || 'Dashboard'}
            </h1>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition"
              >
                <PowerIcon className="h-5 w-5" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-slate-900">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent() {
  const location = useLocation();

  return (
    <>
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-slate-800 border-b border-slate-700">
        <div className="text-white font-bold text-xl">
          Accounting System
        </div>
      </div>
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  isActive
                    ? 'bg-slate-700 text-white'
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white',
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition'
                )}
              >
                <item.icon
                  className={classNames(
                    isActive ? 'text-indigo-400' : 'text-gray-400 group-hover:text-gray-200',
                    'mr-3 flex-shrink-0 h-6 w-6'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
