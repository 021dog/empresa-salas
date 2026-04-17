import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import { motion } from 'motion/react';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signUp, settings } = useWorkspace();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isRegistering) {
        const result = await signUp(email, password, name);
        if (result.success) {
          setIsRegistering(false);
          setError('Conta criada! Agora você pode entrar.');
        } else {
          setError(result.message || 'Erro ao criar conta.');
        }
      } else {
        const result = await login(email, password);
        if (result.success) {
          navigate('/admin/dashboard');
        } else {
          setError(result.message || 'Credenciais inválidas. Verifique seu email e senha.');
        }
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F9F9F9] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md px-4"
      >
        <div className="flex justify-center mb-6">
            <Link to="/" className="text-3xl font-bold tracking-tighter text-black flex items-center mb-4">
                <div className="w-8 h-8 bg-black rounded-lg mr-2"></div>
                {settings.appName}
            </Link>
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-black">
          {isRegistering ? 'Criar Nova Conta' : 'Portal de Acesso'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
           {isRegistering ? 'Junte-se ao ecossistema WorkSpace.' : 'Acesse ferramentas de gestão e monitoramento.'}
        </p>
      </motion.div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-10 px-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100 rounded-[2.5rem] sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className={cn(
                "px-4 py-3 rounded-xl text-sm flex items-center",
                error.includes('Conta criada') ? "bg-green-50 border border-green-100 text-green-700" : "bg-red-50 border border-red-100 text-red-700"
              )}>
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                {error}
              </div>
            )}

            {isRegistering && (
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-100 text-black rounded-2xl text-sm focus:ring-1 focus:ring-black focus:border-black"
                  placeholder="Seu nome"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Endereço de Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 placeholder-gray-400 text-black rounded-2xl text-sm focus:ring-1 focus:ring-black focus:border-black transition-all"
                  placeholder="admin@workspace.central"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Senha de Acesso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 placeholder-gray-400 text-black rounded-2xl text-sm focus:ring-1 focus:ring-black focus:border-black transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-500 font-medium cursor-pointer">
                  Lembrar acesso
                </label>
              </div>

              <div className="text-xs">
                <a href="#" className="font-bold text-black hover:underline underline-offset-4">
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-4 px-4 bg-black text-white rounded-2xl shadow-xl hover:bg-gray-800 focus:outline-none transition-all font-bold text-sm uppercase tracking-widest disabled:opacity-50 group"
              >
                {isLoading ? 'Verificando...' : (isRegistering ? 'Criar Conta' : 'Entrar no Sistema')}
                {!isLoading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm font-bold text-black hover:underline underline-offset-4"
            >
              {isRegistering ? 'Já tem uma conta? Entrar' : 'Não tem conta? Registre-se agora'}
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-gray-400">
             Protegido por criptografia AES-256. Apenas para uso interno autorizado.
          </p>
        </div>

        <div className="mt-8 flex justify-center space-x-6 text-gray-400 italic font-serif text-sm">
           <span>Qualidade WeWork</span>
           <span>·</span>
           <span>Segurança Máxima</span>
        </div>
      </div>
    </div>
  );
}
