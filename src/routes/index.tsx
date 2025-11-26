import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { EntriesList } from '../components/EntriesList/EntriesList';
import { ExitsList } from '../components/ExitsList/ExitsList';
import { HistoryList } from '../components/HistoryList/HistoryList';
import { Customers } from '../pages/Customers/Customers';
import { Inventory } from '../pages/Inventory/Inventory';
import { Deliveries } from '../pages/Deliveries/Deliveries';
import { Users } from '../pages/Users/Users';
import { Settings } from '../pages/Settings/Settings';
import { Login } from '../pages/Login/Login';
import { Register } from '../pages/Register/Register';
import { PrivateRoute } from '../components/PrivateRoute';

export function AppRoutes() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gray-100">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 w-full overflow-x-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/entries"
        element={
          <PrivateRoute>
            <Layout>
              <EntriesList />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/exits"
        element={
          <PrivateRoute>
            <Layout>
              <ExitsList />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <PrivateRoute>
            <Layout>
              <Customers />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <PrivateRoute>
            <Layout>
              <Inventory />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/deliveries"
        element={
          <PrivateRoute>
            <Layout>
              <Deliveries />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/users"
        element={
          <PrivateRoute>
            <Layout>
              <Users />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/history"
        element={
          <PrivateRoute>
            <Layout>
              <HistoryList />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Layout>
              <Settings />
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}