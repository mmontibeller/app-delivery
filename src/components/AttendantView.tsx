
import React, { useState, useEffect, useRef } from 'react';
import { Order } from '../types';
import { Clock, Printer, ChefHat, BellRing, PackageCheck, User, Calendar, Phone, MessageSquare, MapPin, Truck, Store, Building2, Wallet } from 'lucide-react';
import { Receipt } from './Receipt';

interface AttendantViewProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: Order['status']) => void;
}

const AttendantView: React.FC<AttendantViewProps> = ({ orders, onUpdateStatus }) => {
  const [filter, setFilter] = useState<Order['status'] | 'ALL'>('ALL');
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);
  const prevOrdersCount = useRef(orders.length);

  const filteredOrders = orders.filter(o => filter === 'ALL' || o.status === filter);
  const pendingCount = orders.filter(o => o.status === 'PENDING').length;

  useEffect(() => {
    if (orders.length > prevOrdersCount.current) {
      const newOrder = orders[0];
      if (newOrder && newOrder.status === 'PENDING') {
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.play();
        } catch (e) {}
      }
    }
    prevOrdersCount.current = orders.length;
  }, [orders]);

  const handlePrint = (order: Order) => {
    setPrintingOrder(order);
    setTimeout(() => {
      window.print();
      setPrintingOrder(null);
    }, 150);
  };

  const statusColors = {
    PENDING: 'bg-orange-100 text-orange-800 border-orange-200',
    PREPARING: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    READY: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    DELIVERED: 'bg-slate-100 text-slate-800 border-slate-200'
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl shadow-sm no-print border border-gray-100">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-gray-900 p-2 sm:p-3.5 rounded-2xl shadow-xl shadow-gray-200">
            <ChefHat className="text-white w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-gray-800 tracking-tighter uppercase leading-none">Produção</h2>
            <p className="text-[8px] sm:text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Gestão de Pedidos</p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {(['ALL', 'PENDING', 'PREPARING', 'READY', 'DELIVERED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 sm:px-5 py-2.5 rounded-2xl text-[9px] sm:text-[10px] font-black transition-all whitespace-nowrap border uppercase tracking-widest ${
                filter === s 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                  : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
              }`}
            >
              {s === 'ALL' ? 'Todos' : 
               s === 'PENDING' ? `Novos (${pendingCount})` :
               s === 'PREPARING' ? 'Cozinha' :
               s === 'READY' ? 'Prontos' : 'Finalizados'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 no-print">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full py-24 bg-white rounded-[40px] shadow-sm border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
            <PackageCheck className="w-16 h-16 sm:w-20 sm:h-20 mb-6 opacity-10" />
            <p className="text-sm font-black uppercase tracking-widest opacity-40">Nenhum pedido nesta fase</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-500">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                <div className="flex flex-col gap-1">
                  <span className="font-black text-xl text-gray-900 uppercase tracking-tight truncate max-w-[180px]">{order.customerName}</span>
                  <div className="flex items-center gap-2 text-[11px] text-indigo-600 font-black">
                    <Phone className="w-3.5 h-3.5" />
                    <span className="font-mono">{order.whatsapp}</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest ${statusColors[order.status]}`}>
                  {order.status === 'PENDING' ? 'Novo' : order.status}
                </div>
              </div>

              <div className="p-6 flex-1 space-y-5">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border ${order.deliveryMethod === 'PICKUP' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                      {order.deliveryMethod === 'PICKUP' ? <Store className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
                      {order.deliveryMethod === 'PICKUP' ? 'Retirada' : 'Entrega'}
                    </div>
                    {order.companyName && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase bg-gray-100 text-gray-600 border border-gray-200">
                        <Building2 className="w-3.5 h-3.5" /> {order.companyName}
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                       <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Agendado</span>
                       <span className="text-slate-800">{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : '--/--/--'} {order.deliveryTime && ` às ${order.deliveryTime}`}</span>
                    </div>
                    
                    {order.deliveryMethod === 'PICKUP' ? (
                      <div className="flex items-start gap-2 text-[11px] font-bold text-slate-700 leading-snug">
                        <Store className="w-4 h-4 text-amber-500 shrink-0" /> 
                        <span>{order.pickupStore}</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-[11px] font-bold text-slate-700 leading-snug">
                          <MapPin className="w-4 h-4 text-blue-500 shrink-0" /> 
                          <span>{order.neighborhood}: {order.address}, {order.addressNumber}</span>
                        </div>
                        {order.complement && (
                          <div className="flex items-start gap-2 text-[10px] text-slate-500 italic pl-6 bg-white/50 p-2 rounded-lg">
                            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                            <span>Obs: {order.complement}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1">Composição do Pedido</p>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex flex-col gap-1.5 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <span className="font-black text-indigo-600 text-xs bg-indigo-50 w-7 h-7 flex items-center justify-center rounded-xl">{item.quantity}x</span>
                          <span className="text-slate-800 font-bold text-xs leading-tight uppercase tracking-tight">{item.DESCRICAO}</span>
                        </div>
                        {item.notes && (
                          <div className="text-[10px] text-slate-400 italic pl-10 border-l-2 border-slate-100 ml-3.5 py-1">
                            "{item.notes}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 flex flex-col gap-1 border-t border-slate-50">
                   {order.deliveryFee && order.deliveryFee > 0 && (
                     <div className="flex items-center justify-between text-[10px] font-bold text-indigo-400 uppercase">
                        <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> Taxa de Entrega</span>
                        <span>R$ {order.deliveryFee.toFixed(2)}</span>
                     </div>
                   )}
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor do Pedido</span>
                      <span className="text-2xl font-black text-gray-900 tracking-tighter">R$ {order.total.toFixed(2)}</span>
                   </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex gap-3">
                <button 
                  onClick={() => handlePrint(order)}
                  className="p-4 bg-gray-50 border border-gray-100 text-gray-400 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm active:scale-90"
                  title="Imprimir"
                >
                  <Printer className="w-6 h-6" />
                </button>
                
                {order.status === 'PENDING' && (
                  <button 
                    onClick={() => onUpdateStatus(order.id, 'PREPARING')}
                    className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-3xl hover:bg-indigo-700 shadow-lg active:scale-95 transition-all text-xs uppercase tracking-widest"
                  >
                    Mandar p/ Cozinha
                  </button>
                )}

                {order.status === 'PREPARING' && (
                  <button 
                    onClick={() => onUpdateStatus(order.id, 'READY')}
                    className="flex-1 bg-emerald-600 text-white font-black py-4 rounded-3xl hover:bg-emerald-700 shadow-lg active:scale-95 transition-all text-xs uppercase tracking-widest"
                  >
                    Pedido Pronto
                  </button>
                )}

                {order.status === 'READY' && (
                  <button 
                    onClick={() => onUpdateStatus(order.id, 'DELIVERED')}
                    className="flex-1 bg-gray-900 text-white font-black py-4 rounded-3xl hover:bg-gray-800 shadow-lg active:scale-95 transition-all text-xs uppercase tracking-widest"
                  >
                    Concluir Entrega
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="print-only fixed inset-0 bg-white z-[9999]">
        {printingOrder && <Receipt order={printingOrder} />}
      </div>
    </div>
  );
};

export default AttendantView;
