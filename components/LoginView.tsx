
import React, { useState } from 'react';
import { Lock, ArrowRight, AlertCircle, ShieldCheck, User as UserIcon, Key } from 'lucide-react';
import { User } from '../types';

interface LoginViewProps {
  users: User[];
  onLogin: (user: User) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ users, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = users.find(u => u.username === username.toLowerCase().trim() && u.password === password);
    
    if (user) {
      onLogin(user);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
      setPassword('');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className={`bg-white w-full max-w-md p-10 rounded-[48px] shadow-2xl shadow-indigo-100 border border-gray-100 transition-all duration-300 ${error ? 'translate-x-2' : ''}`}>
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="bg-gray-900 p-6 rounded-[32px] shadow-xl shadow-gray-200">
            <Lock className="text-white w-10 h-10" />
          </div>
          
          <div>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Área Privada</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Identifique-se para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div className="space-y-4">
              <div className="relative">
                <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Seu usuário"
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-3xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
              </div>
              
              <div className="relative">
                <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                <input
                  type="password"
                  placeholder="Sua senha"
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-3xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center justify-center gap-2 text-[10px] font-black text-red-500 uppercase animate-in fade-in slide-in-from-top-2">
                 <AlertCircle className="w-4 h-4" /> Usuário ou senha incorretos
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl active:scale-95"
            >
              Acessar Painel
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="pt-4 flex flex-col items-center gap-2 text-[9px] font-black text-gray-300 uppercase tracking-widest">
             <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                Conexão Criptografada
             </div>
             <p className="opacity-40">CH Litoral ERP • v2.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
