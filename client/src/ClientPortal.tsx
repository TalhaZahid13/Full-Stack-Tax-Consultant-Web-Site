import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "./stores/authStore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Report {
  id: number;
  year: string;
  file_url: string;
}

interface DashboardData {
  month: string;
  expenses: number;
  income: number;
  tax: number;
}

export default function ClientPortal() {
  const { user } = useAuthStore();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'dashboard' | 'reports'>('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardData[]>([]);

  const roles = user?.roles
    ? user.roles.map(r => (typeof r === 'string' ? r.toLowerCase() : String(r).toLowerCase()))
    : [];

  const isClient = roles.includes('client') || roles.includes('user');

  // Fetch reports
  useEffect(() => {
    if (isClient && user?.id) {
      axios.get(`/api/client/reports?client_id=${user.id}`)
        .then(res => {
          const fetchedReports = res.data as Report[];
          if (!fetchedReports || fetchedReports.length === 0) {
            setReports([{
              id: 0,
              year: "Dummy Report",
              file_url: "/dummy-report.pdf"
            }]);
          } else {
            setReports(fetchedReports);
          }
        })
        .catch(() => {
          setReports([{
            id: 0,
            year: "Dummy Report",
            file_url: "/dummy-report.pdf"
          }]);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  // Dummy dashboard data
  useEffect(() => {
    const dummyData: DashboardData[] = [
      { month: 'Jan', expenses: 1200, income: 2000, tax: 300 },
      { month: 'Feb', expenses: 1500, income: 2200, tax: 350 },
      { month: 'Mar', expenses: 1300, income: 2100, tax: 320 },
      { month: 'Apr', expenses: 1600, income: 2500, tax: 400 },
      { month: 'May', expenses: 1400, income: 2300, tax: 360 },
      { month: 'Jun', expenses: 1700, income: 2600, tax: 420 },
      { month: 'Jul', expenses: 1500, income: 2400, tax: 380 },
      { month: 'Aug', expenses: 1600, income: 2500, tax: 400 },
    ];
    setDashboardData(dummyData);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-xl font-semibold">🚫 Access Denied - Clients Only</h1>
      </div>
    );
  }

  // Calculate totals
  const totalExpenses = dashboardData.reduce((sum, item) => sum + item.expenses, 0);
  const totalIncome = dashboardData.reduce((sum, item) => sum + item.income, 0);
  const totalTax = dashboardData.reduce((sum, item) => sum + item.tax, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 border-b border-gray-700 p-4 flex space-x-4">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-md ${activeTab === 'dashboard' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-md ${activeTab === 'reports' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          Reports
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-md ${activeTab === 'profile' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          Profile
        </button>
      </nav>

      <div className="p-6">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : activeTab === 'dashboard' ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={dashboardData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="month" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip />
                <Bar dataKey="expenses" fill="#ef4444" />
                <Bar dataKey="income" fill="#22c55e" />
                <Bar dataKey="tax" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>

            {/* Totals */}
            <div className="flex justify-around mt-6 text-white bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div>
                <h3 className="text-lg font-semibold">Total Expenses</h3>
                <p className="text-red-400 font-bold">${totalExpenses.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Total Income</h3>
                <p className="text-green-400 font-bold">${totalIncome.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Total Tax</h3>
                <p className="text-blue-400 font-bold">${totalTax.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ) : activeTab === 'reports' ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Yearly Reports</h2>
            {reports.length > 0 ? (
              <ul className="divide-y divide-gray-700">
                {reports.map((report) => (
                  <li key={report.id} className="py-3 flex justify-between items-center hover:bg-gray-700 rounded-md px-3 transition">
                    <span className="font-medium">{report.year}</span>
                    <a
                      href={report.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-1 bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium"
                    >
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No reports available.</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Profile</h2>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Locale:</strong> {user?.locale}</p>
            <p><strong>Last Logged In:</strong> {user?.last_logged_in_at}</p>
          </div>
        )}
      </div>
    </div>
  );
}
