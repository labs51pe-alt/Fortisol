import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import CRM from './CRM';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  Image as ImageIcon, 
  Package, 
  Layout, 
  ChevronRight, 
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Settings as SettingsIcon,
  Globe,
  Phone as PhoneIcon,
  MessageCircle,
  Instagram,
  Facebook,
  MapPin,
  Users,
  Lock,
  LogIn
} from 'lucide-react';

import { Product, Slide, CompanySettings, Offer } from '../types';

export default function AdminPanel() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'slides' | 'settings' | 'crm' | 'offers'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const { data: productsData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      const { data: slidesData } = await supabase.from('slides').select('*').order('order_index', { ascending: true });
      const { data: offersData } = await supabase.from('offers').select('*');
      const { data: settingsData } = await supabase.from('settings').select('*').eq('key', 'company_info').single();
      
      if (productsData) setProducts(productsData);
      if (slidesData) setSlides(slidesData);
      if (offersData) setOffers(offersData);
      if (settingsData) setSettings(settingsData.value);
    } catch (error) {
      console.error('Error fetching data:', error);
      setStatus({ type: 'error', message: 'Error al cargar datos' });
    } finally {
      setLoading(false);
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${activeTab}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('fortisol-assets')
        .upload(filePath, file);

      if (uploadError) {
        setStatus({ type: 'error', message: 'Error al subir imagen: ' + uploadError.message });
        setUploading(false);
        return;
      }

      const { data } = supabase.storage
        .from('fortisol-assets')
        .getPublicUrl(filePath);
      
      uploadedUrls.push(data.publicUrl);
    }

    if (activeTab === 'products') {
      const currentImages = editForm.images || [];
      setEditForm({ 
        ...editForm, 
        image_url: uploadedUrls[0] || editForm.image_url,
        images: [...currentImages, ...uploadedUrls] 
      });
    } else {
      setEditForm({ ...editForm, image_url: uploadedUrls[0] });
    }
    setUploading(false);
  };

  const removeImage = (index: number) => {
    const newImages = [...(editForm.images || [])];
    newImages.splice(index, 1);
    setEditForm({ 
      ...editForm, 
      images: newImages,
      image_url: newImages[0] || '' 
    });
  };

  const handleSaveProduct = async (product: Partial<Product>) => {
    setLoading(true);
    const { error } = product.id 
      ? await supabase.from('products').update(product).eq('id', product.id)
      : await supabase.from('products').insert([product]);

    if (error) {
      setStatus({ type: 'error', message: 'Error al guardar el producto: ' + error.message });
    } else {
      setStatus({ type: 'success', message: 'Producto guardado correctamente' });
      setIsEditing(null);
      fetchData();
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    setLoading(true);
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      setStatus({ type: 'error', message: 'Error al eliminar: ' + error.message });
    } else {
      setStatus({ type: 'success', message: 'Producto eliminado' });
      fetchData();
    }
    setLoading(false);
  };

  const handleSaveSlide = async (slide: Partial<Slide>) => {
    setLoading(true);
    const { error } = slide.id 
      ? await supabase.from('slides').update(slide).eq('id', slide.id)
      : await supabase.from('slides').insert([slide]);

    if (error) {
      setStatus({ type: 'error', message: 'Error al guardar la diapositiva: ' + error.message });
    } else {
      setStatus({ type: 'success', message: 'Diapositiva guardada correctamente' });
      setIsEditing(null);
      fetchData();
    }
    setLoading(false);
  };

  const handleSaveSettings = async (newSettings: CompanySettings) => {
    setLoading(true);
    const { error } = await supabase
      .from('settings')
      .upsert({ key: 'company_info', value: newSettings }, { onConflict: 'key' });

    if (error) {
      setStatus({ type: 'error', message: 'Error al guardar configuración: ' + error.message });
    } else {
      setStatus({ type: 'success', message: 'Configuración guardada correctamente' });
      fetchData();
    }
    setLoading(false);
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta diapositiva?')) return;
    setLoading(true);
    const { error } = await supabase.from('slides').delete().eq('id', id);
    if (error) {
      setStatus({ type: 'error', message: 'Error al eliminar: ' + error.message });
    } else {
      setStatus({ type: 'success', message: 'Diapositiva eliminada' });
      fetchData();
    }
    setLoading(false);
  };

  const handleSaveOffer = async (offer: Partial<Offer>) => {
    setLoading(true);
    const { error } = offer.id 
      ? await supabase.from('offers').update(offer).eq('id', offer.id)
      : await supabase.from('offers').insert([offer]);

    if (error) {
      setStatus({ type: 'error', message: 'Error al guardar la oferta: ' + error.message });
    } else {
      setStatus({ type: 'success', message: 'Oferta guardada correctamente' });
      setIsEditing(null);
      fetchData();
    }
    setLoading(false);
  };

  const handleDeleteOffer = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta oferta?')) return;
    setLoading(true);
    const { error } = await supabase.from('offers').delete().eq('id', id);
    if (error) {
      setStatus({ type: 'error', message: 'Error al eliminar: ' + error.message });
    } else {
      setStatus({ type: 'success', message: 'Oferta eliminada' });
      fetchData();
    }
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in a real app this should be more secure
    if (password === 'fortisol2024') {
      setIsAuthorized(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      setStatus({ type: 'error', message: 'Clave incorrecta' });
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthorized(true);
    }
  }, []);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white p-10 shadow-2xl shadow-slate-200"
        >
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-xl shadow-black/20">
              <Lock size={28} />
            </div>
            <h2 className="text-2xl font-black tracking-tight uppercase">Acceso Restringido</h2>
            <p className="mt-2 text-sm font-medium text-slate-400">Ingresa la clave de administrador para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Clave Maestra</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-center text-lg font-black tracking-[0.5em] focus:border-black focus:outline-none transition-all"
                autoFocus
              />
            </div>

            {status && status.type === 'error' && (
              <p className="text-center text-[10px] font-black uppercase tracking-widest text-rose-500">{status.message}</p>
            )}

            <button 
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-full bg-black py-5 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-slate-800 shadow-xl shadow-black/10"
            >
              <LogIn size={18} /> Entrar al Panel
            </button>
          </form>

          <div className="mt-10 text-center">
            <a href="/" className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-black transition-colors">Volver a la tienda</a>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading && products.length === 0) {
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
            <h1 className="text-xl font-black tracking-tight">PANEL ADMIN <span className="text-slate-400 font-medium">FORTISOL</span></h1>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-slate-100 p-1">
            <button 
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-black text-white shadow-lg' : 'text-slate-500 hover:text-black'}`}
            >
              <Package size={14} /> Productos
            </button>
            <button 
              onClick={() => setActiveTab('crm')}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'crm' ? 'bg-black text-white shadow-lg' : 'text-slate-500 hover:text-black'}`}
            >
              <Users size={14} /> CRM
            </button>
            <button 
              onClick={() => setActiveTab('slides')}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'slides' ? 'bg-black text-white shadow-lg' : 'text-slate-500 hover:text-black'}`}
            >
              <Layout size={14} /> Diapositivas
            </button>
            <button 
              onClick={() => setActiveTab('offers')}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'offers' ? 'bg-black text-white shadow-lg' : 'text-slate-500 hover:text-black'}`}
            >
              <Package size={14} /> Ofertas
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-black text-white shadow-lg' : 'text-slate-500 hover:text-black'}`}
            >
              <SettingsIcon size={14} /> Configuración
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('admin_auth');
                setIsAuthorized(false);
              }}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        {status && (
          <div className={`mb-6 flex items-center justify-between rounded-2xl p-4 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
            <div className="flex items-center gap-3">
              {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <p className="text-sm font-bold">{status.message}</p>
            </div>
            <button onClick={() => setStatus(null)} className="p-1 hover:opacity-50"><X size={16} /></button>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black tracking-tight uppercase">
            {activeTab === 'products' ? 'Gestión de Productos' : activeTab === 'slides' ? 'Carrusel de Inicio' : activeTab === 'offers' ? 'Gestión de Ofertas' : activeTab === 'crm' ? 'Gestión de Pedidos y Clientes' : 'Configuración de Empresa'}
          </h2>
          {activeTab !== 'settings' && activeTab !== 'crm' && (
            <button 
              onClick={() => {
                setIsEditing('new');
                setEditForm(activeTab === 'products' ? { 
                  name: '', 
                  price: 0, 
                  category: '', 
                  description: '', 
                  image_url: '', 
                  stock: 0,
                  benefits: [],
                  usage: '',
                  nutritional_info: { servingSize: '', servingsPerContainer: '', energy: '' }
                } : activeTab === 'offers' ? {
                  title: '',
                  product_id: '',
                  image_url: '',
                  is_active: true
                } : { title: '', subtitle: '', image_url: '', button_text: 'Comprar Ahora', button_link: '#productos', order_index: slides.length });
              }}
              className="flex items-center gap-2 rounded-full bg-black px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10"
            >
              <Plus size={16} /> {activeTab === 'products' ? 'Nuevo Producto' : activeTab === 'offers' ? 'Nueva Oferta' : 'Nueva Diapositiva'}
            </button>
          )}
        </div>

        {activeTab === 'products' ? (
          products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map(product => (
                <div key={product.id} className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-xl">
                  <div className="aspect-square overflow-hidden bg-slate-100 relative">
                    <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button 
                        onClick={() => {
                          setIsEditing(product.id);
                          setEditForm(product);
                        }}
                        className="rounded-full bg-white/90 p-2 text-black shadow-lg backdrop-blur-md hover:bg-black hover:text-white transition-all"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="rounded-full bg-white/90 p-2 text-rose-600 shadow-lg backdrop-blur-md hover:bg-rose-600 hover:text-white transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{product.category}</span>
                      <span className="text-sm font-black">S/ {product.price}</span>
                    </div>
                    <h3 className="text-lg font-black tracking-tight mb-2">{product.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{product.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <Package size={48} className="text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold">No hay productos registrados</p>
              <p className="text-slate-300 text-xs mt-1">Haz clic en "Nuevo Producto" para comenzar</p>
            </div>
          )
        ) : activeTab === 'slides' ? (
          slides.length > 0 ? (
            <div className="space-y-4">
              {slides.map(slide => (
                <div key={slide.id} className="flex items-center gap-6 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                  <div className="h-24 w-40 overflow-hidden rounded-2xl bg-slate-100">
                    <img src={slide.image_url} alt={slide.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-black tracking-tight">{slide.title}</h3>
                    <p className="text-xs text-slate-500">{slide.subtitle}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setIsEditing(slide.id);
                        setEditForm(slide);
                      }}
                      className="rounded-full bg-slate-100 p-3 text-black hover:bg-black hover:text-white transition-all"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteSlide(slide.id)}
                      className="rounded-full bg-slate-100 p-3 text-rose-600 hover:bg-rose-600 hover:text-white transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <Layout size={48} className="text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold">No hay diapositivas en el carrusel</p>
              <p className="text-slate-300 text-xs mt-1">Añade imágenes para el banner principal</p>
            </div>
          )
        ) : activeTab === 'offers' ? (
          offers.length > 0 ? (
            <div className="space-y-4">
              {offers.map(offer => (
                <div key={offer.id} className="flex items-center gap-6 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                  <div className="h-24 w-40 overflow-hidden rounded-2xl bg-slate-100">
                    <img src={offer.image_url} alt={offer.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-black tracking-tight">{offer.title}</h3>
                    <p className="text-xs text-slate-500">{products.find(p => p.id === offer.product_id)?.name || 'Producto no encontrado'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setIsEditing(offer.id);
                        setEditForm(offer);
                      }}
                      className="rounded-full bg-slate-100 p-3 text-black hover:bg-black hover:text-white transition-all"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteOffer(offer.id)}
                      className="rounded-full bg-slate-100 p-3 text-rose-600 hover:bg-rose-600 hover:text-white transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <Package size={48} className="text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold">No hay ofertas registradas</p>
              <p className="text-slate-300 text-xs mt-1">Haz clic en "Nueva Oferta" para comenzar</p>
            </div>
          )
        ) : activeTab === 'crm' ? (
          <CRM isEmbedded={true} />
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <PhoneIcon size={16} /> Contacto Directo
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Teléfono</label>
                      <input 
                        type="text" 
                        value={settings?.phone || ''} 
                        onChange={e => setSettings(s => s ? {...s, phone: e.target.value} : null)}
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium focus:border-black focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">WhatsApp (Número sin espacios)</label>
                      <input 
                        type="text" 
                        value={settings?.whatsapp || ''} 
                        onChange={e => setSettings(s => s ? {...s, whatsapp: e.target.value} : null)}
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium focus:border-black focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</label>
                      <input 
                        type="email" 
                        value={settings?.email || ''} 
                        onChange={e => setSettings(s => s ? {...s, email: e.target.value} : null)}
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium focus:border-black focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dirección</label>
                      <input 
                        type="text" 
                        value={settings?.address || ''} 
                        onChange={e => setSettings(s => s ? {...s, address: e.target.value} : null)}
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium focus:border-black focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <Globe size={16} /> Redes Sociales
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Facebook</label>
                        <button 
                          onClick={() => setSettings(s => s ? {...s, show_facebook: !s.show_facebook} : null)}
                          className={`text-[9px] font-black px-3 py-1 rounded-full transition-colors ${settings?.show_facebook ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}
                        >
                          {settings?.show_facebook ? 'VISIBLE' : 'OCULTO'}
                        </button>
                      </div>
                      <input 
                        type="text" 
                        value={settings?.facebook || ''} 
                        onChange={e => setSettings(s => s ? {...s, facebook: e.target.value} : null)}
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium focus:border-black focus:outline-none"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Instagram</label>
                        <button 
                          onClick={() => setSettings(s => s ? {...s, show_instagram: !s.show_instagram} : null)}
                          className={`text-[9px] font-black px-3 py-1 rounded-full transition-colors ${settings?.show_instagram ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}
                        >
                          {settings?.show_instagram ? 'VISIBLE' : 'OCULTO'}
                        </button>
                      </div>
                      <input 
                        type="text" 
                        value={settings?.instagram || ''} 
                        onChange={e => setSettings(s => s ? {...s, instagram: e.target.value} : null)}
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium focus:border-black focus:outline-none"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">TikTok</label>
                        <button 
                          onClick={() => setSettings(s => s ? {...s, show_tiktok: !s.show_tiktok} : null)}
                          className={`text-[9px] font-black px-3 py-1 rounded-full transition-colors ${settings?.show_tiktok ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}
                        >
                          {settings?.show_tiktok ? 'VISIBLE' : 'OCULTO'}
                        </button>
                      </div>
                      <input 
                        type="text" 
                        value={settings?.tiktok || ''} 
                        onChange={e => setSettings(s => s ? {...s, tiktok: e.target.value} : null)}
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium focus:border-black focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <MessageCircle size={20} className="text-black" />
                        <span className="text-xs font-black uppercase tracking-widest">Botón WhatsApp</span>
                      </div>
                      <button 
                        onClick={() => setSettings(s => s ? {...s, show_whatsapp: !s.show_whatsapp} : null)}
                        className={`text-[9px] font-black px-4 py-2 rounded-full transition-colors ${settings?.show_whatsapp ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}
                      >
                        {settings?.show_whatsapp ? 'HABILITADO' : 'DESHABILITADO'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 mb-8">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Barra de Promociones</label>
                  <button 
                    onClick={() => setSettings(s => s ? {...s, promo_enabled: !s.promo_enabled} : null)}
                    className={`text-[9px] font-black px-3 py-1 rounded-full transition-colors ${settings?.promo_enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}
                  >
                    {settings?.promo_enabled ? 'VISIBLE' : 'OCULTO'}
                  </button>
                </div>
                <input 
                  type="text" 
                  value={settings?.promo_title || ''} 
                  onChange={e => setSettings(s => s ? {...s, promo_title: e.target.value} : null)}
                  placeholder="Título de la promoción"
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium focus:border-black focus:outline-none"
                />
              </div>
              <div className="mt-12 pt-8 border-t border-slate-100">
                <button 
                  onClick={() => settings && handleSaveSettings(settings)}
                  className="flex w-full items-center justify-center gap-3 rounded-full bg-black py-6 text-[11px] font-black text-white transition-all hover:bg-slate-800 shadow-xl shadow-black/10"
                >
                  <Save size={18} /> GUARDAR CONFIGURACIÓN DE EMPRESA
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditing(null)} />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-8">
              <h3 className="text-xl font-black tracking-tight uppercase">
                {isEditing === 'new' ? 'Crear Nuevo' : 'Editar'} {activeTab === 'products' ? 'Producto' : activeTab === 'offers' ? 'Oferta' : 'Diapositiva'}
              </h3>
              <button onClick={() => setIsEditing(null)} className="rounded-full bg-slate-100 p-2 text-slate-400 hover:text-black transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="max-h-[70vh] overflow-y-auto p-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {activeTab === 'products' ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nombre</label>
                      <input 
                        type="text" 
                        value={editForm.name} 
                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium focus:border-black focus:outline-none"
                      />
                    </div>
                    <div className="col-span-2 flex items-center gap-4">
                      <input 
                        type="checkbox" 
                        checked={editForm.is_combo || false}
                        onChange={e => setEditForm({...editForm, is_combo: e.target.checked})}
                        className="h-5 w-5 rounded border-slate-300 text-black focus:ring-black"
                      />
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">¿Es un Combo?</label>
                    </div>
                    {editForm.is_combo && (
                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">IDs de productos del combo (separados por coma)</label>
                        <input 
                          type="text" 
                          value={editForm.combo_product_ids?.join(', ') || ''} 
                          onChange={e => setEditForm({...editForm, combo_product_ids: e.target.value.split(',').map(s => s.trim())})}
                          className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium focus:border-black focus:outline-none"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Precio (S/)</label>
                      <input 
                        type="number" 
                        value={editForm.price} 
                        onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium focus:border-black focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Categoría</label>
                      <input 
                        type="text" 
                        value={editForm.category} 
                        onChange={e => setEditForm({...editForm, category: e.target.value})}
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium focus:border-black focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stock</label>
                      <input 
                        type="number" 
                        value={editForm.stock} 
                        onChange={e => setEditForm({...editForm, stock: parseInt(e.target.value)})}
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium focus:border-black focus:outline-none"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Imágenes del Producto</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {(editForm.images || (editForm.image_url ? [editForm.image_url] : [])).map((url: string, index: number) => (
                          <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                            <img src={url} alt="Preview" className="h-full w-full object-cover" />
                            <button 
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        <div className="flex-1">
                          <input 
                            type="file" 
                            accept="image/*"
                            multiple
                            onChange={handleUpload}
                            className="hidden"
                            id="product-image-upload"
                          />
                          <label 
                            htmlFor="product-image-upload"
                            className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all hover:border-black hover:text-black"
                          >
                            {uploading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={20} />}
                            {uploading ? 'Subiendo...' : 'Añadir'}
                          </label>
                        </div>
                      </div>
                      <p className="text-[9px] text-slate-400 font-medium">Puedes subir una o más imágenes. Se guardarán en Supabase Storage.</p>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Descripción</label>
                      <textarea 
                        value={editForm.description} 
                        onChange={e => setEditForm({...editForm, description: e.target.value})}
                        rows={4}
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium focus:border-black focus:outline-none resize-none"
                      />
                    </div>

                    <div className="col-span-2 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Beneficios</label>
                        <button 
                          onClick={() => setEditForm({...editForm, benefits: [...(editForm.benefits || []), '']})}
                          className="text-[9px] font-black text-black hover:underline"
                        >
                          + AÑADIR BENEFICIO
                        </button>
                      </div>
                      <div className="space-y-3">
                        {(editForm.benefits || []).map((benefit: string, idx: number) => (
                          <div key={idx} className="flex gap-2">
                            <input 
                              type="text" 
                              value={benefit} 
                              onChange={e => {
                                const newBenefits = [...editForm.benefits];
                                newBenefits[idx] = e.target.value;
                                setEditForm({...editForm, benefits: newBenefits});
                              }}
                              placeholder="Ej: Mejora la digestión 🍏"
                              className="flex-1 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-medium focus:border-black focus:outline-none"
                            />
                            <button 
                              onClick={() => {
                                const newBenefits = editForm.benefits.filter((_: any, i: number) => i !== idx);
                                setEditForm({...editForm, benefits: newBenefits});
                              }}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">¿Cómo consumirlo?</label>
                      <textarea 
                        value={editForm.usage} 
                        onChange={e => setEditForm({...editForm, usage: e.target.value})}
                        rows={2}
                        placeholder="Ej: 01 cápsula al día en ayunas."
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium focus:border-black focus:outline-none resize-none"
                      />
                    </div>

                    <div className="col-span-2 space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Información Nutricional</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-slate-400">Tamaño de Porción</label>
                          <input 
                            type="text" 
                            value={editForm.nutritional_info?.servingSize || ''} 
                            onChange={e => setEditForm({...editForm, nutritional_info: {...(editForm.nutritional_info || {}), servingSize: e.target.value}})}
                            placeholder="Ej: 5g"
                            className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-medium focus:border-black focus:outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-slate-400">Porciones por envase</label>
                          <input 
                            type="text" 
                            value={editForm.nutritional_info?.servingsPerContainer || ''} 
                            onChange={e => setEditForm({...editForm, nutritional_info: {...(editForm.nutritional_info || {}), servingsPerContainer: e.target.value}})}
                            placeholder="Ej: 80"
                            className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-medium focus:border-black focus:outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-slate-400">Energía / Calorías</label>
                          <input 
                            type="text" 
                            value={editForm.nutritional_info?.energy || ''} 
                            onChange={e => setEditForm({...editForm, nutritional_info: {...(editForm.nutritional_info || {}), energy: e.target.value}})}
                            placeholder="Ej: 0 kcal"
                            className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-medium focus:border-black focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : activeTab === 'offers' ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Título</label>
                      <input 
                        type="text" 
                        value={editForm.title} 
                        onChange={e => setEditForm({...editForm, title: e.target.value})}
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium focus:border-black focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Producto</label>
                      <select 
                        value={editForm.product_id} 
                        onChange={e => setEditForm({...editForm, product_id: e.target.value})}
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium focus:border-black focus:outline-none"
                      >
                        <option value="">Seleccionar producto</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Imagen de la Oferta</label>
                      <div className="flex items-center gap-4">
                        {editForm.image_url && (
                          <div className="relative aspect-video w-40 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                            <img src={editForm.image_url} alt="Preview" className="h-full w-full object-cover" />
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleUpload}
                          className="hidden"
                          id="offer-image-upload"
                        />
                        <label 
                          htmlFor="offer-image-upload"
                          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all hover:border-black hover:text-black"
                        >
                          {uploading ? <Loader2 className="animate-spin" size={16} /> : <ImageIcon size={20} />}
                          {uploading ? 'Subiendo...' : 'Cambiar Imagen'}
                        </label>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Título</label>
                      <input 
                        type="text" 
                        value={editForm.title} 
                        onChange={e => setEditForm({...editForm, title: e.target.value})}
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium focus:border-black focus:outline-none"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subtítulo</label>
                      <textarea 
                        value={editForm.subtitle} 
                        onChange={e => setEditForm({...editForm, subtitle: e.target.value})}
                        rows={2}
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium focus:border-black focus:outline-none resize-none"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Imagen de la Diapositiva</label>
                      <div className="flex items-center gap-4">
                        <div className="h-20 w-32 overflow-hidden rounded-2xl bg-slate-100 border border-slate-100">
                          {editForm.image_url ? (
                            <img src={editForm.image_url} alt="Preview" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-300">
                              <ImageIcon size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleUpload}
                            className="hidden"
                            id="slide-image-upload"
                          />
                          <label 
                            htmlFor="slide-image-upload"
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all hover:border-black hover:text-black"
                          >
                            {uploading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                            {uploading ? 'Subiendo...' : 'Subir Imagen'}
                          </label>
                          <p className="mt-2 text-[9px] text-slate-400">La imagen se guardará en Supabase Storage</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Texto Botón</label>
                      <input 
                        type="text" 
                        value={editForm.button_text} 
                        onChange={e => setEditForm({...editForm, button_text: e.target.value})}
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium focus:border-black focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Orden</label>
                      <input 
                        type="number" 
                        value={editForm.order_index} 
                        onChange={e => setEditForm({...editForm, order_index: parseInt(e.target.value)})}
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium focus:border-black focus:outline-none"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 p-8">
              <button 
                onClick={() => {
                  if (activeTab === 'products') handleSaveProduct(editForm);
                  else if (activeTab === 'offers') handleSaveOffer(editForm);
                  else handleSaveSlide(editForm);
                }}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-black py-5 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-slate-800 shadow-xl shadow-black/10"
              >
                <Save size={18} /> GUARDAR CAMBIOS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
