
import React, { useState, useEffect } from 'react';
import { Product, Order, CartItem, Neighborhood, User } from './types';
import { fetchProducts } from './services/api';
import CustomerView from './components/CustomerView';
import AttendantView from './components/AttendantView';
import AdminView from './components/AdminView';
import LoginView from './components/LoginView';
import { ShoppingBag, LayoutDashboard, UtensilsCrossed, AlertCircle, Settings, LogOut, User as UserIcon } from 'lucide-react';

const DEFAULT_NEIGHBORHOODS: Neighborhood[] = [
  { id: '1', name: "Centro", fee: 5.00 },
  { id: '2', name: "Bairro das Flores", fee: 8.00 },
  { id: '3', name: "Vila Maritima", fee: 10.00 }
];

const INITIAL_ADMIN: User = {
  id: 'admin-root',
  username: 'admin',
  password: 'password123',
  name: 'Administrador Mestre',
  canAccessAdmin: true,
  canAccessProduction: true
};

const App: React.FC = () => {
  const [view, setView] = useState<'customer' | 'attendant' | 'admin'>('customer');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>(() => {
    const saved = localStorage.getItem('ch_neighborhoods');
    return saved ? JSON.parse(saved) : DEFAULT_NEIGHBORHOODS;
  });
  
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ch_users');
    return saved ? JSON.parse(saved) : [INITIAL_ADMIN];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem('ch_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [loading, setLoading] = useState(true);
  const [isApiConnected, setIsApiConnected] = useState(true);

  useEffect(() => {
    localStorage.setItem('ch_neighborhoods', JSON.stringify(neighborhoods));
  }, [neighborhoods]);

  useEffect(() => {
    localStorage.setItem('ch_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const { products, isFromApi } = await fetchProducts();
      setProducts(products);
      setIsApiConnected(isFromApi);
      setLoading(false);
    };
    loadData();
  }, []);

  const handlePlaceOrder = (
    customerName: string, 
    whatsapp: string, 
    items: CartItem[], 
    deliveryMethod: 'DELIVERY' | 'PICKUP',
    seller?: string, 
    isComplete?: boolean, 
    deliveryDate?: string,
    deliveryTime?: string,
    pickupStore?: string,
    companyName?: string,
    addressData?: { address?: string, number?: string, cep?: string, complement?: string, city?: string, neighborhood?: string, deliveryFee?: number }
  ) => {
    const itemsTotal = items.reduce((sum, item) => sum + (item.PRECO * item.quantity), 0);
    const finalTotal = itemsTotal + (addressData?.deliveryFee || 0);

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      customerName,
      whatsapp,
      seller,
      companyName,
      deliveryMethod,
      pickupStore,
      neighborhood: addressData?.neighborhood,
      deliveryFee: addressData?.deliveryFee,
      isCompleteRegistration: !!isComplete,
      deliveryDate,
      deliveryTime,
      address: addressData?.address,
      addressNumber: addressData?.number,
      cep: addressData?.cep,
      complement: addressData?.complement,
      city: addressData?.city,
      items,
      total: finalTotal,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    sessionStorage.setItem('ch_current_user', JSON.stringify(user));
    // Redireciona para a primeira tela permitida
    if (user.canAccessProduction) setView('attendant');
    else if (user.canAccessAdmin) setView('admin');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('ch_current_user');
    setView('customer');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600 font-medium text-center px-4 tracking-widest uppercase text-[10px] font-black">CH Litoral • Sincronizando</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (view === 'customer') {
      return <CustomerView products={products} neighborhoods={neighborhoods} onPlaceOrder={handlePlaceOrder} />;
    }

    if (!currentUser) {
      return <LoginView users={users} onLogin={handleLogin} />;
    }

    if (view === 'attendant' && currentUser.canAccessProduction) {
      return <AttendantView orders={orders} onUpdateStatus={updateOrderStatus} />;
    }

    if (view === 'admin' && currentUser.canAccessAdmin) {
      return <AdminView neighborhoods={neighborhoods} setNeighborhoods={setNeighborhoods} orders={orders} users={users} setUsers={setUsers} />;
    }

    // Se tentar acessar algo sem permissão
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-black uppercase tracking-tighter">Acesso Negado</h2>
        <p className="text-gray-500 max-w-xs mt-2">Você não possui permissão para visualizar esta área.</p>
        <button onClick={() => setView('customer')} className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs">Voltar ao Início</button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="no-print sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gray-900 p-2.5 rounded-2xl shadow-lg shadow-gray-100">
            <UtensilsCrossed className="text-white w-5 h-5" />
          </div>
          <div className="hidden xs:block">
            <span className="font-black text-lg tracking-tighter text-gray-900 uppercase">CH Litoral</span>
            <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest leading-none">Management System</p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 bg-gray-100/50 p-1.5 rounded-[24px] border border-gray-100">
          <button
            onClick={() => setView('customer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              view === 'customer' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Encomenda</span>
          </button>
          
          {(currentUser?.canAccessProduction || !currentUser) && (
            <button
              onClick={() => setView('attendant')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                view === 'attendant' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Produção</span>
              {orders.filter(o => o.status === 'PENDING').length > 0 && (
                <span className="ml-1 bg-red-500 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                  {orders.filter(o => o.status === 'PENDING').length}
                </span>
              )}
            </button>
          )}

          {(currentUser?.canAccessAdmin || !currentUser) && (
            <button
              onClick={() => setView('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                view === 'admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {currentUser && (
            <div className="flex items-center gap-3 pl-2 border-l border-gray-200 ml-2">
              <div className="hidden md:flex flex-col items-end leading-none">
                <span className="text-[9px] font-black text-gray-900 uppercase">{currentUser.name}</span>
                <span className="text-[7px] font-black text-indigo-500 uppercase tracking-widest">Conectado</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-500 transition-colors shadow-sm"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1 overflow-auto max-w-7xl mx-auto w-full p-4 sm:p-6 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
