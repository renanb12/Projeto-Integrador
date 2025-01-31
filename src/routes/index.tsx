import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Stats } from '../components/Stats/Stats';
import { ProductList } from '../components/ProductList/ProductList';
import { EntriesList } from '../components/EntriesList/EntriesList';
import { ExitsList } from '../components/ExitsList/ExitsList';
import { HistoryList } from '../components/HistoryList/HistoryList';
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
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout>
              <div className="p-4 md:p-6">
                <Stats />
                <ProductList />
              </div>
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
        path="/history"
        element={
          <PrivateRoute>
            <Layout>
              <HistoryList />
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}