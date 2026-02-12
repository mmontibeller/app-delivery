
import React, { useState } from 'react';
import { Neighborhood, Order, User } from '../types';
import { Settings, Plus, Trash2, MapPin, Wallet, Info, CheckCircle2, PackageSearch, Users, ShieldCheck, Key, UserPlus } from 'lucide-react';

interface AdminViewProps {
  neighborhoods: Neighborhood[];
  setNeighborhoods: React.Dispatch<React.SetStateAction<Neighborhood[]>>;
  orders: Order[];
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const AdminView: React.FC<AdminViewProps> = ({ neighborhoods, setNeighborhoods, orders, users, setUsers }) => {
  const [activeTab, setActiveTab] = useState<'fees' | 'users' | 'stats'>('fees');
  
  // States para novos bairros
  const [newName, setNewName] = useState('');
  const [newFee, setNewFee] = useState('');

  // States para novos usuários
  const [userUsername, setUserUsername] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [userAccessProd, setUserAccessProd] = useState(false);
  const [userAccessAdmin, setUserAccessAdmin] = useState(false);

  const addNeighborhood = () => {
    if (!newName.trim() || !newFee) return;
    const newEntry: Neighborhood = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      fee: parseFloat(newFee)
    };
    setNeighborhoods(prev => [...prev, newEntry]);
    setNewName('');
    setNewFee('');
  };

  const removeNeighborhood = (id: string) => {
    setNeighborhoods(prev => prev.filter(n => n.id !== id));
  };

  const addUser = () => {
    if (!userUsername.trim() || !userPassword.trim() || !userName.trim()) return;
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: userUsername.toLowerCase().trim(),
      password: userPassword,
      name: userName,
      canAccessProduction: userAccessProd,
      canAccessAdmin: userAccessAdmin
    };
    setUsers(prev => [...prev, newUser]);
    setUserUsername('');
    setUserPassword('');
    setUserName('');
    setUserAccessProd(false);
    setUserAccessAdmin(false);
  };

  const removeUser = (id: string) => {
    if (id === 'admin-root') {
      alert("O usuário administrador mestre não pode ser removido.");
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    neighborhoodsCount: neighborhoods.length,
    pendingProducao: orders.filter(o => o.status === 'PENDING').length
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Admin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-[40px] shadow-sm border border-gray-100">
        <div className="flex items-center gap-5">
          <div className="bg-indigo-600 p-4 rounded-3xl shadow-xl shadow-indigo-100">
            <Settings className="text-white w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Administração</h2>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Central de Configurações</p>
          </div>
        </div>

        <div className="flex bg-gray-100 p-1.5 rounded-[24px]">
          <button onClick={() => setActiveTab('fees')} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'fees' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Taxas</button>
          <button onClick={() => setActiveTab('users')} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Equipe</button>
          <button onClick={() => setActiveTab('stats')} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'stats' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Métricas</button>
        </div>
      </div>

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4">
          {[
            { label: 'Total Pedidos', value: stats.totalOrders, icon: PackageSearch, color: 'text-indigo-600' },
            { label: 'Faturamento', value: `R$ ${stats.totalRevenue.toFixed(2)}`, icon: Wallet, color: 'text-emerald-600' },
            { label: 'Bairros', value: stats.neighborhoodsCount, icon: MapPin, color: 'text-blue-600' },
            { label: 'Em Produção', value: stats.pendingProducao, icon: CheckCircle2, color: 'text-amber-600' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
              <stat.icon className={`w-8 h-8 mb-4 ${stat.color}`} />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900 tracking-tighter">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'fees' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-left-4">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-8">
            <div className="flex items-center gap-3">
              <MapPin className="text-indigo-600 w-6 h-6" />
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Entrega por Bairros</h3>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Nome do Bairro" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm" value={newName} onChange={(e) => setNewName(e.target.value)} />
              <div className="flex gap-2">
                <input type="number" placeholder="Taxa R$" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm" value={newFee} onChange={(e) => setNewFee(e.target.value)} />
                <button onClick={addNeighborhood} className="bg-gray-900 text-white p-4 rounded-2xl hover:bg-gray-800"><Plus className="w-6 h-6" /></button>
              </div>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
              {neighborhoods.map((n) => (
                <div key={n.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group">
                  <div>
                    <p className="font-black text-gray-900 uppercase text-[11px]">{n.name}</p>
                    <p className="text-indigo-600 font-black text-[11px]">R$ {n.fee.toFixed(2)}</p>
                  </div>
                  <button onClick={() => removeNeighborhood(n.id)} className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-indigo-900 p-10 rounded-[40px] text-white flex flex-col justify-center">
             <Info className="w-10 h-10 mb-6 text-indigo-300" />
             <h3 className="text-2xl font-black uppercase mb-4 leading-none">Aviso Importante</h3>
             <p className="text-indigo-100 text-sm leading-relaxed opacity-80">As taxas cadastradas aqui são refletidas imediatamente no checkout para o cliente. Certifique-se de manter os valores atualizados de acordo com a logística local.</p>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-right-4">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-8">
            <div className="flex items-center gap-3">
              <UserPlus className="text-indigo-600 w-6 h-6" />
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Novo Colaborador</h3>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Nome Completo" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm" value={userName} onChange={(e) => setUserName(e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Usuário (Login)" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm" value={userUsername} onChange={(e) => setUserUsername(e.target.value)} />
                <input type="password" placeholder="Senha" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
              </div>
              <div className="p-5 bg-gray-50 rounded-2xl space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Permissões de Acesso</p>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={userAccessProd} onChange={(e) => setUserAccessProd(e.target.checked)} className="w-5 h-5 rounded-lg border-gray-200 text-indigo-600" />
                    <span className="text-[11px] font-black text-gray-700 uppercase">Acesso à Produção (Cozinha)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={userAccessAdmin} onChange={(e) => setUserAccessAdmin(e.target.checked)} className="w-5 h-5 rounded-lg border-gray-200 text-indigo-600" />
                    <span className="text-[11px] font-black text-gray-700 uppercase">Acesso Administrativo (Painel)</span>
                  </label>
                </div>
              </div>
              <button onClick={addUser} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase text-xs shadow-xl shadow-indigo-100 active:scale-95 transition-all">Salvar Usuário</button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3"><Users className="w-6 h-6 text-gray-400" /> Equipe Cadastrada</h3>
            <div className="space-y-3">
              {users.map((u) => (
                <div key={u.id} className="p-5 border border-gray-100 rounded-2xl flex items-center justify-between hover:bg-gray-50 transition-all group">
                  <div>
                    <p className="font-black text-gray-900 text-[12px] uppercase">{u.name}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">@{u.username}</p>
                    <div className="flex gap-2 mt-2">
                       {u.canAccessProduction && <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-2 py-0.5 rounded-full border border-emerald-100 uppercase">Produção</span>}
                       {u.canAccessAdmin && <span className="bg-indigo-50 text-indigo-600 text-[8px] font-black px-2 py-0.5 rounded-full border border-indigo-100 uppercase">Admin</span>}
                    </div>
                  </div>
                  {u.id !== 'admin-root' && (
                    <button onClick={() => removeUser(u.id)} className="p-3 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-5 h-5" /></button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
