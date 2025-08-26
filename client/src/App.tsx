import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ClientPortal from './ClientPortal';
import Contacts from './pages/Contacts';
import Accounts from './pages/Accounts';
import Transactions from './pages/Transactions';
import Invoices from './pages/Invoices';
import Bills from './pages/Bills';
import Items from './pages/Items';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// ✅ Protected Route Component
const ProtectedRoute: React.FC<{ allowedRoles: string[], children: JSX.Element }> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, loading } = useAuthStore();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // ✅ Safely normalize roles to lowercase strings
  const userRoles = user?.roles
    ? user.roles.map(r => (typeof r === 'string' ? r.toLowerCase() : String(r).toLowerCase()))
    : [];

  const hasAccess = allowedRoles.some(role => userRoles.includes(role.toLowerCase()));

  if (!hasAccess) return <Navigate to={userRoles.includes('admin') ? '/Dashboard' : '/ClientPortal'} replace />;

  return children;
};

function App() {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        {/* Admin Routes */}
        <Route path="/Dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/contacts/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Contacts />
          </ProtectedRoute>
        } />
        <Route path="/accounts/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Accounts />
          </ProtectedRoute>
        } />
        <Route path="/transactions/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Transactions />
          </ProtectedRoute>
        } />
        <Route path="/sales/invoices/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Invoices />
          </ProtectedRoute>
        } />
        <Route path="/purchases/bills/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Bills />
          </ProtectedRoute>
        } />
        <Route path="/items/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Items />
          </ProtectedRoute>
        } />
        <Route path="/reports/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Reports />
          </ProtectedRoute>
        } />
        <Route path="/settings/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Settings />
          </ProtectedRoute>
        } />

        {/* Client Routes */}
        <Route path="/ClientPortal" element={
          <ProtectedRoute allowedRoles={['user', 'client']}>
            <ClientPortal />
          </ProtectedRoute>
        } />

        {/* Default */}
        <Route path="*" element={<Navigate to={isAuthenticated ? '/Dashboard' : '/login'} replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
