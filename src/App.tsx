/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';

// Pages
import Home from './pages/Public/Home';
import RoomList from './pages/Public/RoomList';
import RoomDetail from './pages/Public/RoomDetail';
import CompanyDirectory from './pages/Public/CompanyDirectory';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Admin/Dashboard';
import AdminRooms from './pages/Admin/Rooms';
import AdminCompanies from './pages/Admin/Companies';
import AdminBookings from './pages/Admin/Bookings';
import AdminWaitlist from './pages/Admin/Waitlist';
import AdminSettings from './pages/Admin/Settings';

// Layouts
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useWorkspace();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function AppContent() {
  const { isLoading } = useWorkspace();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F9F9F9] font-sans">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-bold tracking-widest text-black uppercase animate-pulse">Iniciando Ecossistema...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/salas" element={<RoomList />} />
        <Route path="/salas/:id" element={<RoomDetail />} />
        <Route path="/empresas" element={<CompanyDirectory />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <PrivateRoute>
          <AdminLayout />
        </PrivateRoute>
      }>
        <Route index element={<Navigate to="/admin/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="rooms" element={<AdminRooms />} />
        <Route path="companies" element={<AdminCompanies />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="waitlist" element={<AdminWaitlist />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <WorkspaceProvider>
      <Router>
        <AppContent />
      </Router>
    </WorkspaceProvider>
  );
}
