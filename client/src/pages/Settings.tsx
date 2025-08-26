import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import {
  UserCircleIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  TagIcon,
  BellIcon,
  ShieldCheckIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type SettingsTab = 'profile' | 'company' | 'currencies' | 'categories' | 'notifications' | 'security';

interface ProfileForm {
  name: string;
  email: string;
  locale: string;
  landing_page: string;
}

interface PasswordForm {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

const settingsTabs = [
  { id: 'profile', name: 'User Profile', icon: UserCircleIcon },
  { id: 'company', name: 'Company', icon: BuildingOfficeIcon },
  { id: 'currencies', name: 'Currencies', icon: CurrencyDollarIcon },
  { id: 'categories', name: 'Categories', icon: TagIcon },
  { id: 'notifications', name: 'Notifications', icon: BellIcon },
  { id: 'security', name: 'Security', icon: ShieldCheckIcon },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const { user, updateProfile, changePassword } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      locale: user?.locale || 'en-GB',
      landing_page: user?.landing_page || 'dashboard',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    watch,
    reset: resetPasswordForm,
  } = useForm<PasswordForm>();

  const watchNewPassword = watch('new_password');

  const onProfileSubmit = async (data: ProfileForm) => {
    setLoading(true);
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    setLoading(true);
    try {
      await changePassword(data.current_password, data.new_password);
      toast.success('Password changed successfully!');
      resetPasswordForm();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
            <div className="bg-gray-800 shadow rounded-lg p-6">
              <div className="bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-300">Profile Information</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Update your account profile information and email address.
                </p>
              </div>
              
              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                <div className="bg-gray-800 shadow rounded-lg p-6">
                  <label className="block text-sm font-medium text-gray-300">Name</label>
                  <input
                    {...registerProfile('name', { required: 'Name is required' })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {profileErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.name.message}</p>
                  )}
                </div>

                <div className="bg-gray-800 shadow rounded-lg p-6">
                  <label className="block text-sm font-medium text-gray-300">Email</label>
                  <input
                    {...registerProfile('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    type="email"
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {profileErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
                  )}
                </div>

                <div className="bg-gray-800 shadow rounded-lg p-6">
                  <label className="block text-sm font-medium text-gray-300">Language</label>
                  <select
                    {...registerProfile('locale')}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="en-GB">English (UK)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Español</option>
                    <option value="fr-FR">Français</option>
                    <option value="de-DE">Deutsch</option>
                  </select>
                </div>

                <div className="bg-gray-800 shadow rounded-lg p-6">
                  <label className="block text-sm font-medium text-gray-300">Landing Page</label>
                  <select
                    {...registerProfile('landing_page')}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="dashboard">Dashboard</option>
                    <option value="invoices">Invoices</option>
                    <option value="bills">Bills</option>
                    <option value="transactions">Transactions</option>
                    <option value="reports">Reports</option>
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>
                </div>
              </form>
            </div>
        );
      case 'security':
        return (
          <div className="bg-gray-800 shadow rounded-lg p-6">
            <div>
              <h3 className="text-lg font-medium text-white">Change Password</h3>
              <p className="mt-1 text-sm text-gray-200">
                Ensure your account is using a long, random password to stay secure.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white">Current Password</label>
                <input
                  {...registerPassword('current_password', { required: 'Current password is required' })}
                  type="password"
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {passwordErrors.current_password && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.current_password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white">New Password</label>
                <input
                  {...registerPassword('new_password', {
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  type="password"
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {passwordErrors.new_password && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.new_password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white">Confirm New Password</label>
                <input
                  {...registerPassword('confirm_password', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === watchNewPassword || 'Passwords do not match',
                  })}
                  type="password"
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {passwordErrors.confirm_password && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.confirm_password.message}</p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        );

      case 'company':
        return (
          <div className="bg-gray-800 shadow rounded-lg p-6">
            <div>
              <h3 className="text-lg font-medium text-white">Company Information</h3>
              <p className="mt-1 text-sm text-gray-300">
                Manage your company details and business information.
              </p>
            </div>
            <div className="bg-gray-800 shadow rounded-lg p-6">
              <p className="text-sm text-yellow-800">
                Company settings will be available in a future update. Contact support for assistance with company information changes.
              </p>
            </div>
          </div>
        );

      case 'currencies':
        return (
          <div className="bg-gray-800 shadow rounded-lg p-6">
            <div>
              <h3 className="text-lg font-medium text-white">Currency Settings</h3>
              <p className="mt-1 text-sm text-gray-300">
                Configure currencies used in your accounting system.
              </p>
            </div>
            <div className="bg-gray-800 shadow rounded-lg p-6">
              <p className="text-sm text-blue-800">
                Currency management features will be available in the next update. Currently, USD is the default currency.
              </p>
            </div>
          </div>
        );

      case 'categories':
        return (
          <div className="bg-gray-800 shadow rounded-lg p-6">
            <div>
              <h3 className="text-lg font-medium text-white">Transaction Categories</h3>
              <p className="mt-1 text-sm text-gray-300">
                Organize your transactions with custom categories.
              </p>
            </div>
            <div className="bg-gray-800 shadow rounded-lg p-6">
              <p className="text-sm text-green-800">
                Category management features are coming soon. Default categories are currently available for your transactions.
              </p>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="bg-gray-800 shadow rounded-lg p-6">
            <div>
              <h3 className="text-lg font-medium text-white">Notification Preferences</h3>
              <p className="mt-1 text-sm text-gray-300">
                Configure how you receive notifications about your account.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-white">Email Notifications</h4>
                  <p className="text-sm text-gray-200">Receive notifications via email</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-white">Invoice Reminders</h4>
                  <p className="text-sm text-gray-200">Get reminded about overdue invoices</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-white">Monthly Reports</h4>
                  <p className="text-sm text-gray-200">Receive monthly financial summaries</p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gray-800 shadow rounded-lg p-6">
            <p className="bg-gray-800 shadow rounded-lg p-6">Select a settings category from the sidebar.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex">
      {/* Settings Sidebar */}
      <div className="bg-gray-800 shadow rounded-lg p-6">
        <div className="p-6">
          <h2 className="text-lg font-medium text-white">Settings</h2>
          <p className="text-sm text-gray-400">Manage your account preferences</p>
        </div>
        <nav className="mt-6">
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`w-full flex items-center px-6 py-3 text-left text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="mr-3 h-5 w-5" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="bg-gray-800 shadow rounded-lg">
        {renderTabContent()}
      </div>
    </div>
  );
}
