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
import Auditorium from './pages/Public/Auditorium';
import CompanyDirectory from './pages/Public/CompanyDirectory';
import MyBookings from './pages/Public/MyBookings';
import Login from './pages/Auth/Login';
import AuthCallback from './pages/Auth/Callback';
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
  const { isLoading, user } = useWorkspace();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F9F9F9] font-sans">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-bold tracking-widest text-black uppercase animate-pulse">Iniciando Ecossistema...</p>
      </div>
    );
  }

  // Global Auth Wall
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* Public Routes protected but accessible if logged in */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/salas" element={<RoomList />} />
        <Route path="/salas/:id" element={<RoomDetail />} />
        <Route path="/auditorio" element={<Auditorium />} />
        <Route path="/empresas" element={<CompanyDirectory />} />
        <Route path="/meus-agendamentos" element={<MyBookings />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/login" element={<Navigate to={user.role === 'admin' ? "/admin/dashboard" : "/meus-agendamentos"} replace />} />
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

      {/* Catch all for authenticated users */}
      <Route path="*" element={<Navigate to="/" replace />} />
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
