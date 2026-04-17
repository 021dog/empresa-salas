import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  LayoutDashboard,
  DoorOpen,
  Building2,
  CalendarDays,
  ListOrdered,
  Settings,
  LogOut,
  Bell,
  Search
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function AdminLayout() {
  const { user, logout, settings } = useWorkspace();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Salas', icon: DoorOpen, path: '/admin/rooms' },
    { name: 'Empresas', icon: Building2, path: '/admin/companies' },
    { name: 'Reservas', icon: CalendarDays, path: '/admin/bookings' },
    { name: 'Lista de Espera', icon: ListOrdered, path: '/admin/waitlist' },
    { name: 'Configurações', icon: Settings, path: '/admin/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-[#F4F4F4] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <Link to="/" className="text-xl font-bold tracking-tighter text-black flex items-center">
            <div className="w-6 h-6 bg-black rounded-lg mr-2"></div>
            {settings.appName}
            <span className="ml-1 text-[10px] bg-black text-white px-1.5 py-0.5 rounded uppercase font-bold tracking-widest">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-black text-white shadow-sm"
                    : "text-gray-600 hover:text-black hover:bg-gray-50"
                )}
              >
                <item.icon className={cn("w-4 h-4 mr-3", isActive ? "text-white" : "text-gray-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sair do Painel
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="flex-1 flex max-w-md bg-gray-50 rounded-full px-4 py-1.5 border border-gray-100 invisible md:visible">
            <Search className="w-4 h-4 text-gray-400 mr-2 self-center" />
            <input
              type="text"
              placeholder="Buscar em todo o sistema..."
              className="bg-transparent border-none focus:ring-0 text-sm w-full"
            />
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative text-gray-400 hover:text-black transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center">
              <div className="text-right mr-3 hidden sm:block">
                <p className="text-xs font-semibold text-black">{user?.name}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">{user?.role}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                {user?.name?.[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
