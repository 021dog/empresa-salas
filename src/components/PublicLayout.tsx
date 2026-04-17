import { Outlet, Link, useLocation } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { Menu, X, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function PublicLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, settings } = useWorkspace();

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Salas', path: '/salas' },
    { name: 'Empresas', path: '/empresas' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9] font-sans">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold tracking-tighter text-black flex items-center">
                <div className="w-8 h-8 bg-black rounded-lg mr-2"></div>
                {settings.appName}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.path ? 'text-black underline underline-offset-8' : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <Link
                  to="/admin/dashboard"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-500 hover:text-black flex items-center"
                >
                  <UserIcon className="w-4 h-4 mr-1" />
                  Entrar
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-black focus:outline-none"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-gray-200"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md"
                  >
                    {link.name}
                  </Link>
                ))}
                {!user && (
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 text-base font-medium text-black bg-gray-100 rounded-md"
                    >
                      Login Administrador
                    </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 py-12 mt-auto text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <Link to="/" className="text-xl font-bold tracking-tighter text-black flex items-center mb-4">
                <div className="w-6 h-6 bg-black rounded-lg mr-2"></div>
                {settings.appName}
              </Link>
              <p className="max-w-xs text-sm">
                Soluções inteligentes para espaços de trabalho modernos. Gestão de salas, residências e comunidades empresariais.
              </p>
            </div>
            <div>
              <h3 className="text-black font-semibold mb-4 text-sm uppercase tracking-wider">Plataforma</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/salas" className="hover:text-black transition-colors">Ver Salas</Link></li>
                <li><Link to="/empresas" className="hover:text-black transition-colors">Diretório</Link></li>
                <li><Link to="/login" className="hover:text-black transition-colors">Administração</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-black font-semibold mb-4 text-sm uppercase tracking-wider">Contato</h3>
              <ul className="space-y-2 text-sm">
                <li>contato@workspace.central</li>
                <li>São Paulo, Brasil</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-12 pt-8 text-xs flex justify-between items-center">
            <p>© 2026 WorkSpace Central. Inspirado pela WeWork.</p>
            <div className="flex space-x-4">
              <span>Termos</span>
              <span>Privacidade</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
