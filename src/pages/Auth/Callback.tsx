import { useEffect } from 'react';

export default function AuthCallback() {
  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
      window.close();
    } else {
      window.location.href = '/';
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-sans">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-medium text-gray-500">Autenticação concluída. Fechando janela...</p>
      </div>
    </div>
  );
}
