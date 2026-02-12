
import React, { useState, useMemo } from 'react';
import { Product, CartItem, Neighborhood } from '../types';
import { Search, Plus, Minus, Send, X, ShoppingBag, MessageSquare, Calendar, MapPin, Clock, Building2, Store, Truck, ChevronLeft, ArrowRight } from 'lucide-react';

interface CustomerViewProps {
  products: Product[];
  neighborhoods: Neighborhood[];
  onPlaceOrder: (
    name: string, 
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
  ) => void;
}

const STORES = [
  "Loja Centro - Av. Principal, 100",
  "Loja Shopping - Piso L2",
  "Loja Litoral - Orla da Praia, 500"
];

const CustomerView: React.FC<CustomerViewProps> = ({ products, neighborhoods, onPlaceOrder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details'>('cart');
  
  const [customerName, setCustomerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'DELIVERY' | 'PICKUP'>('PICKUP');
  const [pickupStore, setPickupStore] = useState(STORES[0]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood>(neighborhoods[0] || { id: '0', name: 'Nenhum', fee: 0 });
  
  const [isCompleteReg, setIsCompleteReg] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  
  const [address, setAddress] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [cep, setCep] = useState('');
  const [complement, setComplement] = useState('');
  const [city, setCity] = useState('');
  
  const [showCart, setShowCart] = useState(false);
  const toggleMobileCart = () => setShowCart(prev => !prev);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productNote, setProductNote] = useState('');
  const [productQty, setProductQty] = useState(1);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.CATEGORIA)));
    return ['TODOS', ...cats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.DESCRICAO.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'TODOS' || p.CATEGORIA === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const addToCart = (product: Product, qty: number, note?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.ID === product.ID && item.notes === note);
      if (existing) {
        return prev.map(item => (item.ID === product.ID && item.notes === note) ? { ...item, quantity: item.quantity + qty } : item);
      }
      return [...prev, { ...product, quantity: qty, notes: note }];
    });
    setSelectedProduct(null);
    setProductNote('');
    setProductQty(1);
  };

  const updateQuantity = (id: string, delta: number, note?: string) => {
    setCart(prev => prev.map(item => {
      if (item.ID === id && item.notes === note) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const itemsTotal = cart.reduce((sum, item) => sum + (item.PRECO * item.quantity), 0);
  const currentDeliveryFee = deliveryMethod === 'DELIVERY' ? selectedNeighborhood.fee : 0;
  const finalTotal = itemsTotal + currentDeliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !whatsapp.trim() || cart.length === 0) {
      alert('⚠️ Nome e WhatsApp são obrigatórios!');
      return;
    }
    
    onPlaceOrder(
      customerName, 
      whatsapp, 
      cart, 
      deliveryMethod,
      sellerName, 
      isCompleteReg, 
      deliveryDate,
      deliveryTime,
      pickupStore,
      companyName,
      { 
        address, 
        number: addressNumber, 
        cep, 
        complement, 
        city, 
        neighborhood: deliveryMethod === 'DELIVERY' ? selectedNeighborhood.name : undefined,
        deliveryFee: currentDeliveryFee
      }
    );

    setCart([]);
    setCustomerName('');
    setWhatsapp('');
    setSellerName('');
    setCompanyName('');
    setIsCompleteReg(false);
    setDeliveryDate('');
    setDeliveryTime('');
    setAddress('');
    setAddressNumber('');
    setCep('');
    setComplement('');
    setCity('');
    setShowCart(false);
    setCheckoutStep('cart');
    alert('✅ Encomenda registrada com sucesso!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
      <div className="lg:col-span-3 space-y-4 sm:space-y-6">
        <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tighter">Cardápio Digital</h2>
              <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest">Monte seu pedido agora</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
              <input
                type="text"
                placeholder="Pesquisar..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-[10px] sm:text-[11px] font-black transition-all whitespace-nowrap border uppercase tracking-[0.1em] ${
                  selectedCategory === cat 
                    ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                    : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 pb-24 lg:pb-0">
          {filteredProducts.map((product) => (
            <div key={product.ID} className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col border border-gray-100">
              <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-50">
                <img 
                  src={product.IMAGEM_URL} 
                  alt={product.DESCRICAO}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-gray-900 px-3 py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest shadow-sm">
                  {product.CATEGORIA}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="mb-4">
                  <h3 className="font-black text-gray-800 text-sm sm:text-base mb-1 leading-tight uppercase tracking-tight line-clamp-2">{product.DESCRICAO}</h3>
                  <p className="text-indigo-600 font-black text-lg sm:text-xl tracking-tighter">R$ {product.PRECO.toFixed(2)}</p>
                </div>
                <div className="mt-auto">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setProductQty(1);
                      setProductNote('');
                    }}
                    className="w-full bg-gray-900 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black hover:bg-gray-800 flex items-center justify-center gap-2 transition-all active:scale-95 text-[10px] sm:text-xs uppercase tracking-widest"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${showCart ? 'fixed inset-0 z-50 bg-white lg:relative lg:bg-transparent lg:block' : 'hidden lg:block'}`}>
        <div className="sticky top-0 lg:top-24 space-y-0 lg:space-y-6 h-full lg:h-[calc(100vh-8rem)] flex flex-col p-0 lg:p-0">
          
          <div className="bg-white rounded-none lg:rounded-[40px] shadow-2xl border border-gray-50 flex-1 flex flex-col overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                {checkoutStep === 'details' && (
                  <button onClick={() => setCheckoutStep('cart')} className="p-2 hover:bg-gray-100 rounded-full text-indigo-600 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}
                <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">
                  {checkoutStep === 'cart' ? 'Itens Escolhidos' : 'Confirmar Dados'}
                </h3>
              </div>
              <button onClick={() => setShowCart(false)} className="p-2 lg:hidden text-gray-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 scrollbar-hide">
              {checkoutStep === 'cart' ? (
                cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-300 text-center opacity-40 py-20">
                    <ShoppingBag className="w-20 h-20 mb-6" />
                    <p className="font-black uppercase text-[10px] tracking-widest">Seu carrinho está vazio</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {cart.map((item, index) => (
                      <div key={`${item.ID}-${index}`} className="flex flex-col gap-3 pb-5 border-b border-gray-50 last:border-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-gray-900 text-sm uppercase tracking-tight leading-snug">{item.DESCRICAO}</p>
                            <p className="text-indigo-600 text-xs font-black mt-1">R$ {(item.PRECO * item.quantity).toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1 shrink-0">
                            <button onClick={() => updateQuantity(item.ID, -1, item.notes)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-xs font-black w-5 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.ID, 1, item.notes)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {item.notes && (
                          <div className="text-[10px] text-gray-400 italic bg-gray-50 p-2 rounded-xl flex items-start gap-2 border-l-2 border-indigo-100">
                            <MessageSquare className="w-3 h-3 mt-0.5" />
                            <span>{item.notes}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Contatos</p>
                    <input
                      type="text"
                      placeholder="Nome do Cliente *"
                      className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="WhatsApp *"
                      className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                    />
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input
                        type="text"
                        placeholder="Empresa (Opcional)"
                        className="w-full pl-11 pr-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Logística</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setDeliveryMethod('PICKUP')}
                        className={`flex flex-col items-center gap-2 py-4 rounded-3xl text-[10px] font-black uppercase border-2 transition-all ${deliveryMethod === 'PICKUP' ? 'bg-gray-900 text-white border-gray-900 shadow-xl' : 'bg-white text-gray-400 border-gray-100'}`}
                      >
                        <Store className="w-5 h-5" /> Retirada
                      </button>
                      <button 
                        onClick={() => setDeliveryMethod('DELIVERY')}
                        className={`flex flex-col items-center gap-2 py-4 rounded-3xl text-[10px] font-black uppercase border-2 transition-all ${deliveryMethod === 'DELIVERY' ? 'bg-gray-900 text-white border-gray-900 shadow-xl' : 'bg-white text-gray-400 border-gray-100'}`}
                      >
                        <Truck className="w-5 h-5" /> Entrega
                      </button>
                    </div>
                  </div>

                  {deliveryMethod === 'PICKUP' ? (
                    <div className="space-y-3 p-5 bg-amber-50 rounded-3xl border border-amber-100">
                      <label className="text-[10px] font-black text-amber-700 uppercase tracking-widest ml-1">Local da Retirada</label>
                      <select 
                        className="w-full px-4 py-3 bg-white border border-amber-200 rounded-xl text-xs outline-none"
                        value={pickupStore}
                        onChange={(e) => setPickupStore(e.target.value)}
                      >
                        {STORES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-4">
                       <div className="space-y-3">
                        <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Bairro de Entrega</label>
                        <select 
                          className="w-full px-5 py-3.5 bg-white border border-indigo-100 rounded-2xl text-sm outline-none"
                          value={JSON.stringify(selectedNeighborhood)}
                          onChange={(e) => setSelectedNeighborhood(JSON.parse(e.target.value))}
                        >
                          {neighborhoods.map(n => <option key={n.id} value={JSON.stringify(n)}>{n.name} • R$ {n.fee.toFixed(2)}</option>)}
                        </select>
                       </div>

                       <div className="space-y-3 p-5 bg-white border border-gray-100 rounded-3xl shadow-sm">
                          <input
                            type="text"
                            placeholder="Logradouro (Rua/Av) *"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Nº *"
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none"
                              value={addressNumber}
                              onChange={(e) => setAddressNumber(e.target.value)}
                            />
                            <input
                              type="text"
                              placeholder="CEP"
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none"
                              value={cep}
                              onChange={(e) => setCep(e.target.value)}
                            />
                          </div>
                          <textarea
                            placeholder="Complemento / Observações do Endereço"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none min-h-[80px] resize-none"
                            value={complement}
                            onChange={(e) => setComplement(e.target.value)}
                          />
                       </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-[10px] font-black text-amber-600 ml-1 mb-3 uppercase tracking-widest">Agendamento</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300" />
                        <input
                          type="date"
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-[10px] outline-none"
                          value={deliveryDate}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                        />
                      </div>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300" />
                        <input
                          type="time"
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-[10px] outline-none"
                          value={deliveryTime}
                          onChange={(e) => setDeliveryTime(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 sm:p-8 bg-white border-t border-gray-100 shadow-inner">
              <div className="space-y-2 mb-5">
                <div className="flex items-center justify-between text-[10px] text-gray-400 font-black uppercase tracking-widest">
                  <span>Itens</span>
                  <span>R$ {itemsTotal.toFixed(2)}</span>
                </div>
                {deliveryMethod === 'DELIVERY' && (
                  <div className="flex items-center justify-between text-[10px] text-indigo-400 font-black uppercase tracking-widest">
                    <span>Taxa ({selectedNeighborhood.name})</span>
                    <span>R$ {selectedNeighborhood.fee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-black text-gray-900 uppercase">Total</span>
                  <span className="text-3xl font-black text-gray-900 tracking-tighter">R$ {finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {checkoutStep === 'cart' ? (
                <button
                  onClick={() => setCheckoutStep('details')}
                  disabled={cart.length === 0}
                  className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-700 disabled:opacity-30 transition-all shadow-xl active:scale-95 text-xs"
                >
                  Finalizar Pedido
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!customerName.trim() || !whatsapp.trim()}
                  className="w-full bg-emerald-600 text-white py-5 rounded-[24px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-700 disabled:opacity-30 transition-all shadow-xl active:scale-95 text-xs"
                >
                  Confirmar Encomenda
                  <Send className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="relative h-64 sm:h-80 bg-gray-100">
              <img src={selectedProduct.IMAGEM_URL} className="w-full h-full object-cover" />
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 bg-black/20 backdrop-blur-xl p-3 rounded-full text-white hover:bg-black/40"
              >
                <X className="w-7 h-7" />
              </button>
            </div>
            <div className="p-8 sm:p-10 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-tight">{selectedProduct.DESCRICAO}</h3>
                  <p className="text-indigo-600 font-black text-2xl tracking-tighter">R$ {selectedProduct.PRECO.toFixed(2)}</p>
                </div>
                
                <div className="flex items-center gap-4 bg-gray-50 p-2.5 rounded-3xl">
                   <button onClick={() => setProductQty(Math.max(1, productQty - 1))} className="w-10 h-10 flex items-center justify-center bg-white rounded-2xl shadow-sm text-gray-400 hover:text-red-500"><Minus className="w-5 h-5" /></button>
                   <span className="text-xl font-black w-6 text-center">{productQty}</span>
                   <button onClick={() => setProductQty(productQty + 1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-2xl shadow-sm text-gray-400 hover:text-indigo-600"><Plus className="w-5 h-5" /></button>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-500" /> Observações
                </label>
                <textarea 
                  className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[32px] text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 min-h-[120px] resize-none transition-all shadow-inner"
                  placeholder="Ex: Sem cebola, embalagem para presente..."
                  value={productNote}
                  onChange={(e) => setProductNote(e.target.value)}
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button onClick={() => setSelectedProduct(null)} className="flex-1 py-5 bg-gray-100 rounded-2xl font-black text-gray-400 uppercase tracking-widest text-[11px]">Voltar</button>
                <button 
                  onClick={() => addToCart(selectedProduct, productQty, productNote)}
                  className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3"
                >
                  Confirmar Item
                  <span className="bg-white/20 px-3 py-1 rounded-full">R$ {(selectedProduct.PRECO * productQty).toFixed(2)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {cart.length > 0 && !showCart && (
        <button
          onClick={toggleMobileCart}
          className="lg:hidden fixed bottom-6 right-6 left-6 bg-gray-900 text-white p-5 rounded-3xl shadow-2xl z-40 flex items-center justify-between active:scale-95 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <ShoppingBag className="w-7 h-7" />
              <span className="absolute -top-3 -right-3 bg-indigo-500 text-white text-[11px] w-6 h-6 rounded-full flex items-center justify-center border-4 border-gray-900 font-black">{cart.length}</span>
            </div>
            <div className="flex flex-col items-start leading-none">
               <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Ver Carrinho</span>
               <span className="text-xl font-black">R$ {itemsTotal.toFixed(2)}</span>
            </div>
          </div>
          <ArrowRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default CustomerView;
