import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  MoreVertical, 
  Phone, 
  MapPin, 
  Package, 
  CreditCard, 
  Eye,
  ArrowLeft,
  Loader2,
  X,
  ExternalLink,
  User
} from 'lucide-react';

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  department: string;
  province: string;
  district: string;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  items: any[];
  payment_method: string;
  payment_proof_url: string;
  shipping_method: string;
  created_at: string;
}

const statusConfig = {
  pending: { label: 'Pendiente', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
  paid: { label: 'Pagado', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  shipped: { label: 'Enviado', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Truck },
  delivered: { label: 'Entregado', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: Package },
  cancelled: { label: 'Cancelado', color: 'bg-rose-100 text-rose-700 border-rose-200', icon: XCircle },
};

export default function CRM() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'customers'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setOrders(data);
    setLoading(false);
  }

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);
    
    if (!error) {
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
      if (selectedOrder?.id === id) setSelectedOrder({ ...selectedOrder, status });
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.customer_phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const customers = Array.from(new Set(orders.map(o => o.customer_phone))).map(phone => {
    const customerOrders = orders.filter(o => o.customer_phone === phone);
    const latestOrder = customerOrders[0];
    return {
      name: latestOrder.customer_name,
      phone: latestOrder.customer_phone,
      address: latestOrder.customer_address,
      location: `${latestOrder.district}, ${latestOrder.province}, ${latestOrder.department}`,
      totalSpent: customerOrders.reduce((sum, o) => sum + o.total, 0),
      orderCount: customerOrders.length,
      lastOrderDate: latestOrder.created_at
    };
  });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  if (loading && orders.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-black" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <a href="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-black transition-colors hover:bg-black hover:text-white">
              <ArrowLeft size={20} />
            </a>
            <h1 className="text-xl font-black tracking-tight">CRM <span className="text-slate-400 font-medium">FORTISOL</span></h1>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Pedidos
            </button>
            <button 
              onClick={() => setActiveTab('customers')}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'customers' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Clientes
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder={activeTab === 'orders' ? "Buscar pedido..." : "Buscar cliente..."} 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-64 rounded-full border border-slate-200 bg-slate-100 py-2 pl-12 pr-6 text-xs font-medium focus:border-black focus:outline-none transition-all"
              />
            </div>
            {activeTab === 'orders' && (
              <select 
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="rounded-full border border-slate-200 bg-slate-100 px-6 py-2 text-xs font-black uppercase tracking-widest focus:border-black focus:outline-none"
              >
                <option value="all">TODOS LOS ESTADOS</option>
                {Object.entries(statusConfig).map(([key, { label }]) => (
                  <option key={key} value={key}>{label.toUpperCase()}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50">
          {activeTab === 'orders' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Cliente</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Fecha</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Estado</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map(order => {
                    const StatusIcon = statusConfig[order.status].icon;
                    return (
                      <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-black font-black text-xs">
                              {order.customer_name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-black text-black">{order.customer_name}</p>
                              <p className="text-xs font-medium text-slate-500">{order.customer_phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-xs font-medium text-slate-500">
                            {new Date(order.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-black text-black">S/ {order.total}</p>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest ${statusConfig[order.status].color}`}>
                            <StatusIcon size={10} />
                            {statusConfig[order.status].label}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all"
                          >
                            <Eye size={12} /> Detalles
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-32">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                          <Package size={32} strokeWidth={1} className="text-slate-200" />
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest">No se encontraron pedidos</p>
                        <p className="text-xs mt-2">Los pedidos aparecerán aquí cuando los clientes compren.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Cliente</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ubicación</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pedidos</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Gastado</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Última Compra</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer, idx) => (
                    <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-black font-black text-xs">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-black">{customer.name}</p>
                            <p className="text-xs font-medium text-slate-500">{customer.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-xs font-medium text-slate-500">{customer.location}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-black">{customer.orderCount}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-black">S/ {customer.totalSpent.toFixed(2)}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-xs font-medium text-slate-500">
                          {new Date(customer.lastOrderDate).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
                        </p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-32">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                          <User size={32} strokeWidth={1} className="text-slate-200" />
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest">No se encontraron clientes</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-end p-6 sm:p-12">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative h-full w-full max-w-xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 p-8">
              <div>
                <h3 className="text-xl font-black tracking-tight uppercase">Detalle del Pedido</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">ID: {selectedOrder.id.slice(0, 8)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="rounded-full bg-slate-100 p-2 text-slate-400 hover:text-black transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Status Update */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Actualizar Estado</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {Object.entries(statusConfig).map(([key, { label, color }]) => (
                    <button 
                      key={key}
                      onClick={() => updateOrderStatus(selectedOrder.id, key as Order['status'])}
                      className={`rounded-2xl border p-3 text-[9px] font-black uppercase tracking-widest transition-all ${selectedOrder.status === key ? color : 'bg-white border-slate-100 text-slate-400 hover:border-black hover:text-black'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><User size={12} /> Cliente</label>
                  <p className="text-sm font-black">{selectedOrder.customer_name}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Phone size={12} /> Teléfono</label>
                  <p className="text-sm font-black">{selectedOrder.customer_phone}</p>
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><MapPin size={12} /> Ubicación</label>
                  <p className="text-sm font-black">{selectedOrder.district}, {selectedOrder.province}, {selectedOrder.department}</p>
                  {selectedOrder.customer_address && (
                    <p className="text-xs font-medium text-slate-500 mt-1">{selectedOrder.customer_address}</p>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Package size={12} /> Productos</label>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white p-1">
                          <img src={item.product.image_url} alt={item.product.name} className="h-full w-full object-contain" />
                        </div>
                        <div>
                          <p className="text-xs font-black">{item.product.name}</p>
                          <p className="text-[10px] font-medium text-slate-500">Cantidad: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-xs font-black">S/ {item.product.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Proof */}
              {selectedOrder.payment_proof_url && (
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><CreditCard size={12} /> Comprobante de Pago</label>
                  <a 
                    href={selectedOrder.payment_proof_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="group relative block aspect-video overflow-hidden rounded-2xl border border-slate-100 bg-slate-50"
                  >
                    <img src={selectedOrder.payment_proof_url} alt="Comprobante" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink size={24} className="text-white" />
                    </div>
                  </a>
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 p-8 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total del Pedido</span>
                <span className="text-2xl font-black text-black">S/ {selectedOrder.total}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
