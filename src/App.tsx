/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './lib/supabase';
import AdminPanel from './components/AdminPanel';
import CRM from './components/CRM';
import { 
  ShoppingCart, 
  MessageCircle, 
  ChevronRight, 
  Star, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Menu, 
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  MapPin,
  User,
  CreditCard,
  RotateCcw,
  Heart,
  Share2,
  X,
  Phone,
  Instagram,
  Facebook,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  Download,
  Leaf,
  Zap,
  Check
} from 'lucide-react';
import { 
  PRODUCTS, 
  TESTIMONIALS, 
  CONTACT_PHONE, 
  BRAND_NAME,
  SOCIAL_INSTAGRAM,
  SOCIAL_FACEBOOK,
  SOCIAL_TIKTOK,
  COMPANY_EMAIL,
  COMPANY_ADDRESS
} from './constants';
import { PERU_LOCATIONS } from './peru-data';
import { Product, Testimonial, CartItem, CompanySettings } from './types';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StoreFront />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

function StoreFront() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [scrolled, setScrolled] = useState(false);
  const [activeStory, setActiveStory] = useState<Testimonial | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  
  // Dynamic Data States
  const [dynamicProducts, setDynamicProducts] = useState<Product[]>([]);
  const [dynamicSlides, setDynamicSlides] = useState<any[]>([]);
  const [popupOffers, setPopupOffers] = useState<any[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Cart & Product Detail States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentIntroSlide, setCurrentIntroSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Cart, 2: Shipping Form
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 12, minutes: 45, seconds: 30 });
  
  // Form States
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    department: '',
    province: '',
    district: ''
  });

  useEffect(() => {
    fetchDynamicData();
  }, []);

  // Fallback slides removed as requested by user to avoid showing demo data
  const introSlides: any[] = [];

  async function fetchDynamicData() {
    setIsLoadingData(true);
    const { data: pData } = await supabase.from('products').select('*');
    const { data: sData } = await supabase.from('slides').select('*').order('order_index', { ascending: true });
    const { data: oData } = await supabase.from('offers').select('*').eq('is_active', true).eq('show_in_popup', true).limit(2);
    const { data: settingsData } = await supabase.from('settings').select('*').eq('key', 'company_info').single();
    
    if (pData && pData.length > 0) setDynamicProducts(pData);
    else setDynamicProducts([]); // No fallback to demo data

    if (sData && sData.length > 0) setDynamicSlides(sData);
    else setDynamicSlides([]); // No fallback to demo data

    if (oData && oData.length > 0) {
      setPopupOffers(oData);
      setIsPopupOpen(true);
    }

    if (settingsData) setSettings(settingsData.value);
    
    setIsLoadingData(false);
  }

  const activeProducts = dynamicProducts;
  const activeSlides = dynamicSlides.length > 0 ? dynamicSlides : introSlides;
  
  const categories = ['Todos', 'Bienestar', 'Energía', 'Digestión', 'Piel', 'Combos'];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Automatic promo popup disabled as it contained demo data
    /*
    const timer = setTimeout(() => {
      setIsPromoOpen(true);
    }, 4000);
    return () => clearTimeout(timer);
    */
  }, []);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIntroSlide(prev => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProducts = selectedCategory === 'Todos' 
    ? activeProducts 
    : activeProducts.filter(p => p.category === selectedCategory);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleWhatsAppOrder = async () => {
    const cartDetails = cart.map(item => 
      `- ${item.product.name} (x${item.quantity}): S/ ${item.product.price * item.quantity}`
    ).join('\n');

    const isLimaMetropolitana = formData.department === 'Lima' && formData.province === 'Lima';

    const shippingMethod = isLimaMetropolitana 
      ? `*Dirección:* ${formData.address}` 
      : `*Envío:* Courier Shalom (Recojo en Agencia)`;

    const message = `*NUEVO PEDIDO - FORTISOL PERÚ*\n\n` +
      `*Cliente:* ${formData.name}\n` +
      `*Teléfono:* ${formData.phone}\n` +
      `${shippingMethod}\n` +
      `*Ubicación:* ${formData.district}, ${formData.province}, ${formData.department}\n\n` +
      `*Productos:*\n${cartDetails}\n\n` +
      `*TOTAL:* S/ ${cartTotal}\n\n` +
      `_Por favor, confírmenme el pedido para proceder con el pago._`;

    // Save to Supabase (CRM)
    try {
      await supabase.from('orders').insert([{
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_address: formData.address,
        department: formData.department,
        province: formData.province,
        district: formData.district,
        total: cartTotal,
        items: cart,
        shipping_method: isLimaMetropolitana ? 'Domicilio' : 'Shalom',
        status: 'pending'
      }]);
    } catch (err) {
      console.error("Error saving order to CRM:", err);
    }

    const whatsappNumber = settings?.whatsapp || CONTACT_PHONE;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const getTikTokEmbedUrl = (url: string) => {
    if (!url) return '';
    const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    const parts = cleanUrl.split('/');
    let id = parts.pop() || '';
    if (id.includes('?')) {
      id = id.split('?')[0];
    }
    return `https://www.tiktok.com/embed/${id}`;
  };

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1].split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}` : url;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${scrolled ? 'bg-white/95 py-2 shadow-sm backdrop-blur-md border-b border-slate-100' : 'bg-transparent py-4'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex flex-col leading-none">
              <span className={`text-xl font-black tracking-tighter flex items-center gap-1 transition-colors duration-500 ${scrolled ? 'text-black' : 'text-white'}`}>
                FORTISOL<span className="text-[9px] align-top">®</span>
              </span>
              <span className={`text-[7px] font-bold tracking-[0.2em] uppercase transition-colors duration-500 ${scrolled ? 'text-slate-400' : 'text-white/60'}`}>
                Salud para toda la vida
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            <a href="#inicio" className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${scrolled ? 'text-black/60 hover:text-black' : 'text-white/70 hover:text-white'}`}>Inicio</a>
            <a href="#productos" className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${scrolled ? 'text-black/60 hover:text-black' : 'text-white/70 hover:text-white'}`}>Catálogo</a>
            <a href="#testimonios" className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${scrolled ? 'text-black/60 hover:text-black' : 'text-white/70 hover:text-white'}`}>Testimonios</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 transition-all hover:scale-110 ${scrolled ? 'text-black' : 'text-white'}`}
            >
              <ShoppingCart size={18} />
              {cart.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-black text-[7px] font-bold text-white">
                  {cart.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => handleWhatsAppOrder()}
              className={`hidden items-center gap-2 rounded-full px-5 py-2 text-[9px] font-black transition-all uppercase tracking-widest md:flex ${scrolled ? 'bg-black text-white hover:bg-slate-800' : 'bg-white text-black hover:bg-slate-100'}`}
            >
              CONTACTAR
            </button>
            {/* Mobile Menu Toggle */}
            <button className={`md:hidden ${scrolled ? 'text-black' : 'text-white'}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 flex flex-col bg-white px-6 pt-24 md:hidden"
          >
            <div className="flex flex-col gap-6 text-center">
              <a href="#inicio" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold">Inicio</a>
              <a href="#productos" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold">Catálogo</a>
              <a href="#testimonios" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold">Testimonios</a>
              <button 
                onClick={() => { handleWhatsAppOrder(); setIsMenuOpen(false); }}
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-black py-4 text-lg font-bold text-white shadow-xl"
              >
                <MessageCircle size={24} />
                PEDIR POR WHATSAPP
              </button>
              
              <div className="mt-8 flex justify-center gap-6">
                {(!settings || settings.show_instagram) && (
                  <a href={settings?.instagram || SOCIAL_INSTAGRAM} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-black">
                    <Instagram size={24} />
                  </a>
                )}
                {(!settings || settings.show_facebook) && (
                  <a href={settings?.facebook || SOCIAL_FACEBOOK} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-black">
                    <Facebook size={24} />
                  </a>
                )}
                {(!settings || settings.show_tiktok) && (
                  <a href={settings?.tiktok || SOCIAL_TIKTOK} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-black">
                    <MessageCircle size={24} />
                  </a>
                )}
              </div>
              
              <div className="mt-auto pb-12 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Contáctanos</p>
                <p className="text-sm font-black text-black">{settings?.phone || '+51 976 791 234'}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Slider (Organa Style) */}
      <section id="inicio" className="relative h-[70vh] min-h-[500px] w-full overflow-hidden bg-black pt-16">
        {/* Background Slider */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIntroSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <img 
              src={activeSlides[currentIntroSlide]?.image_url || activeSlides[currentIntroSlide]?.image} 
              alt="Background" 
              className="h-full w-full object-cover opacity-100"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>
        </AnimatePresence>

        <div className="container relative z-10 mx-auto max-w-7xl px-6 h-full flex flex-col items-center justify-center">
          {activeSlides.length > 0 ? (
            <div className="flex flex-col items-center justify-center text-center w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIntroSlide}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex flex-col items-center"
                >
                  {/* Badge */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-white border border-white/30 shadow-lg"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    {activeSlides[currentIntroSlide]?.badge || 'FORTISOL PERÚ'}
                  </motion.div>

                  {/* Title & Subtitle */}
                  <div className="mb-4 flex flex-col items-center">
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white mb-2 drop-shadow-lg">
                      {activeSlides[currentIntroSlide]?.subtitle}
                    </h2>
                    <h1 className="text-4xl font-black tracking-tighter text-white md:text-7xl lg:text-[8rem] drop-shadow-[0_15px_40px_rgba(0,0,0,0.7)] max-w-6xl leading-[0.8] uppercase">
                      {activeSlides[currentIntroSlide]?.title}
                    </h1>
                  </div>

                  {/* Description */}
                  <p className="mb-8 max-w-2xl text-sm font-bold text-white md:text-lg leading-relaxed drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)]">
                    {activeSlides[currentIntroSlide]?.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Controls & CTAs */}
              <div className="flex flex-col items-center gap-6 w-full">
                {/* Buttons */}
                <div className="flex flex-col gap-4 sm:flex-row">
                  <button 
                    onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
                    className="flex items-center justify-center gap-3 rounded-full bg-white px-8 py-3 text-[10px] font-black text-black shadow-2xl transition-all hover:bg-slate-100 hover:scale-105 active:scale-95 uppercase tracking-widest group"
                  >
                    ENTRAR A LA WEB
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Progress Dots */}
                <div className="flex gap-2">
                  {activeSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIntroSlide(i)}
                      className={`h-1 rounded-full transition-all duration-500 ${currentIntroSlide === i ? 'w-8 bg-white' : 'w-2 bg-white/20'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center w-full">
              <h1 className="text-4xl font-black tracking-tight text-white md:text-7xl uppercase">
                FORTISOL PERÚ
              </h1>
              <p className="mt-4 text-white/70 text-lg uppercase tracking-widest">Salud para toda la vida</p>
              <button 
                onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-8 flex items-center justify-center gap-3 rounded-full bg-white px-10 py-4 text-xs font-black text-black shadow-2xl transition-all hover:bg-slate-100 uppercase tracking-widest"
              >
                VER PRODUCTOS
              </button>
            </div>
          )}
        </div>

        {/* Bottom Feature Cards */}
        <div className="absolute bottom-12 left-0 right-0 px-6 hidden md:block">
          <div className="mx-auto max-w-7xl grid grid-cols-2 gap-4 md:grid-cols-4 w-full">
            {[
              { icon: <Truck size={20} />, label: "Envío a todo Perú", sub: "Rápido y seguro" },
              { icon: <ShieldCheck size={20} />, label: "100% Natural", sub: "Sin químicos" },
              { icon: <Star size={20} />, label: "Calidad Premium", sub: "Garantizada" },
              { icon: <CheckCircle2 size={20} />, label: "Soporte 24/7", sub: "Asesoría gratuita" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + (i * 0.1) }}
                className="flex flex-col items-center rounded-2xl bg-white/5 backdrop-blur-lg p-4 border border-white/10"
              >
                <div className="mb-2 text-white">{item.icon}</div>
                <p className="text-[8px] font-black uppercase tracking-widest text-white">{item.label}</p>
                <p className="text-[6px] font-bold text-white/40 uppercase tracking-widest">{item.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promos Bar (Organa Style) */}
      {settings?.promo_enabled && (
        <div className="bg-black py-4 overflow-hidden border-y border-white/10">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 text-white">
                  <span className="text-2xl animate-pulse">⚡</span>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">{settings?.promo_title || 'OFERTAS ESPECIALES'}</h3>
                  <span className="text-2xl">🖤</span>
                </div>
                <div className="hidden lg:block h-8 w-px bg-white/20 mx-2" />
                <p className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em] hidden lg:block">
                  ¡OFERTAS EXCLUSIVAS POR TIEMPO LIMITADO!
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex gap-3">
                  {[
                    { label: 'Días', value: timeLeft.days },
                    { label: 'Horas', value: timeLeft.hours },
                    { label: 'Minutos', value: timeLeft.minutes },
                    { label: 'Segundos', value: timeLeft.seconds }
                  ].map((unit, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xl font-black text-white shadow-inner">
                        {unit.value.toString().padStart(2, '0')}
                      </div>
                      <span className="mt-2 text-[8px] font-black uppercase tracking-widest text-white/50">{unit.label}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
                  className="rounded-full bg-white px-6 py-3 text-[10px] font-black text-black uppercase tracking-widest hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-xl"
                >
                  VER MÁS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      <section className="bg-white py-16 border-y border-slate-100">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-3">
            {[
              { icon: <Truck className="text-black" size={24} />, title: "Envíos a Todo el Perú", desc: "Llegamos a cada rincón del país con rapidez y seguridad." },
              { icon: <ShieldCheck className="text-black" size={24} />, title: "Calidad Garantizada", desc: "Productos con registros sanitarios y fórmulas naturales." },
              { icon: <CheckCircle2 className="text-black" size={24} />, title: "Pago Contra Entrega", desc: "Paga al recibir tu pedido en las principales ciudades." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="mb-5 rounded-full bg-slate-50 p-5 transition-all group-hover:bg-black group-hover:text-white">{feature.icon}</div>
                <h3 className="mb-2 text-base font-black uppercase tracking-wider">{feature.title}</h3>
                <p className="text-xs leading-relaxed text-slate-500 font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="productos" className="bg-white py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
              NUESTRA COLECCIÓN
            </div>
            <h2 className="mb-6 text-4xl font-black text-black md:text-6xl uppercase tracking-tighter">Catálogo de Productos</h2>
            <p className="mx-auto max-w-2xl text-base text-slate-500 font-medium leading-relaxed">
              Descubre nuestra selección premium de productos naturales. Calidad garantizada para tu bienestar diario.
            </p>
            
            {/* Category Filter */}
            <div className="mt-12 flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-6 py-2 text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${selectedCategory === cat ? 'bg-black text-white border-black shadow-xl shadow-black/10' : 'bg-white text-slate-400 border-slate-100 hover:border-black hover:text-black'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <motion.div 
            layout
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence mode='popLayout'>
              {activeProducts
                .filter((p) => selectedCategory === 'Todos' || p.category === selectedCategory)
                .map((product) => (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className={`group relative flex flex-col bg-white border ${product.category === 'Combos' ? 'border-amber-400 border-2' : 'border-slate-50'} transition-all hover:border-slate-200`}
                  >
                    {product.category === 'Combos' && (
                      <div className="absolute left-4 top-4 z-10 rounded-full bg-amber-500 px-3 py-1 text-[7px] font-black uppercase tracking-[0.2em] text-white">
                        COMBO
                      </div>
                    )}
                    {product.tag && product.category !== 'Combos' && (
                      <div className="absolute left-4 top-4 z-10 rounded-full bg-black px-3 py-1 text-[7px] font-black uppercase tracking-[0.2em] text-white">
                        {product.tag}
                      </div>
                    )}
                    <div className="aspect-[1/1] overflow-hidden bg-slate-50 relative">
                      <img 
                        src={product.image_url || product.image} 
                        alt={product.name} 
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    {/* Quick Add Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => setSelectedProduct(product)}
                          className="w-full bg-white/95 backdrop-blur-md py-2 text-[8px] font-black uppercase tracking-widest text-black shadow-xl hover:bg-black hover:text-white transition-all"
                        >
                          VER MÁS
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className="w-full bg-black py-2 text-[8px] font-black uppercase tracking-widest text-white shadow-xl hover:bg-slate-800 transition-all"
                        >
                          COMPRAR
                        </button>
                      </div>
                    </div>

                    {/* Wishlist Button on Card */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className={`absolute right-4 top-4 z-20 rounded-full p-2 transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                        wishlist.includes(product.id) 
                          ? 'bg-red-50 text-red-500' 
                          : 'bg-white/80 backdrop-blur-md text-slate-300 hover:text-red-500'
                      }`}
                    >
                      <Heart size={16} fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <div className="flex flex-col p-4 text-center">
                    <span className="mb-2 text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">{product.category}</span>
                    <h3 className="mb-2 text-base font-black text-black tracking-tight group-hover:text-slate-600 transition-colors">{product.name}</h3>
                    
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="flex text-black">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} size={10} fill={i <= Math.floor(product.rating || 5) ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <span className="text-[8px] font-bold text-slate-300">({product.reviewsCount || 0})</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Testimonials (TikTok Style) */}
      <section id="testimonios" className="bg-white py-20 overflow-hidden">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="text-center md:text-left">
              <h2 className="mb-2 text-3xl font-black text-black uppercase tracking-tighter">Testimonios Reales</h2>
              <p className="text-base text-slate-500 font-medium">Mira cómo Fortisol está cambiando vidas en todo el Perú.</p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <div className="flex text-black">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <span className="text-xs font-black text-black uppercase tracking-widest">4.9/5 Calificación</span>
            </div>
          </div>

          <div className="relative">
            <div className="flex gap-8 overflow-x-auto pb-12 no-scrollbar snap-x snap-mandatory">
              {TESTIMONIALS.map((t, i) => (
                <motion.div 
                  key={t.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setActiveStory(t)}
                  className="relative h-[400px] min-w-[250px] cursor-pointer overflow-hidden rounded-[2rem] bg-slate-100 shadow-2xl transition-all hover:scale-[1.02] snap-start group border border-slate-100"
                >
                  <img 
                    src={t.thumbnail} 
                    alt={t.name} 
                    className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  
                  <div className="absolute top-6 right-6 z-10 rounded-full bg-black/20 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-md border border-white/30 flex items-center gap-1">
                    <ShieldCheck size={10} />
                    Verificado
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="rounded-full bg-white/20 p-5 backdrop-blur-md border border-white/30">
                      <Play className="text-white" size={32} fill="white" />
                    </div>
                  </div>

                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <div className="mb-4 flex items-center gap-4">
                      <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full border-2 border-white shadow-lg" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className="text-base font-black leading-none tracking-tight">{t.name}</h4>
                        <p className="text-[8px] font-black text-white/70 uppercase tracking-[0.2em] mt-1">{t.location}</p>
                      </div>
                    </div>
                    <p className="line-clamp-2 text-xs font-medium leading-relaxed text-white/90 italic">"{t.text}"</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Story Modal */}
      <AnimatePresence>
        {activeStory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl"
          >
            <button 
              onClick={() => setActiveStory(null)}
              className="absolute right-6 top-6 z-[110] rounded-full bg-white/10 p-3 text-white backdrop-blur-md hover:bg-white/20"
            >
              <X size={32} />
            </button>

            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative aspect-[9/16] w-full max-w-[450px] overflow-hidden rounded-[3rem] bg-black shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
            >
              {activeStory.videoUrl?.includes('tiktok.com') ? (
                <div className="h-full w-full bg-black">
                  <iframe
                    src={getTikTokEmbedUrl(activeStory.videoUrl)}
                    className="h-full w-full border-none"
                    allow="autoplay; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : activeStory.videoUrl?.includes('youtube.com') || activeStory.videoUrl?.includes('youtu.be') ? (
                <div className="h-full w-full bg-black">
                  <iframe
                    src={getYoutubeEmbedUrl(activeStory.videoUrl)}
                    className="h-full w-full border-none"
                    allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video 
                  src={activeStory.videoUrl} 
                  autoPlay 
                  loop 
                  muted={isMuted}
                  playsInline
                  className="h-full w-full object-cover"
                />
              )}
              
              {/* Top Header Overlay */}
              <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/60 to-transparent flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <img src={activeStory.avatar} alt={activeStory.name} className="h-10 w-10 rounded-full border-2 border-white shadow-md" referrerPolicy="no-referrer" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white leading-tight">{activeStory.name.toLowerCase().replace(/\s/g, '')}</span>
                    <span className="text-[10px] font-medium text-white/70 uppercase tracking-widest">{BRAND_NAME.toUpperCase()}</span>
                  </div>
                </div>
                <button 
                  onClick={() => window.open('https://www.tiktok.com/@fortisolperu', '_blank')}
                  className="rounded-full bg-white px-4 py-1.5 text-[10px] font-black text-black uppercase tracking-wider shadow-lg hover:scale-105 transition-transform"
                >
                  Ver perfil
                </button>
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 pt-24">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={activeStory.avatar} alt={activeStory.name} className="h-16 w-16 rounded-full border-2 border-white shadow-2xl" referrerPolicy="no-referrer" />
                      <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-1 border-2 border-black">
                        <Star size={10} fill="black" className="text-black" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xl font-black text-white tracking-tight">{activeStory.name}</h4>
                        <div className="flex items-center gap-1 rounded-full bg-black px-2 py-0.5 text-[8px] font-black text-white uppercase tracking-widest">
                          <ShieldCheck size={10} />
                          Verificado
                        </div>
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">TIKTOK TESTIMONIO</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="rounded-full bg-white/10 p-3 text-white backdrop-blur-md hover:bg-white/20 border border-white/20"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                </div>
                
                <p className="mb-8 text-lg italic leading-snug text-white/95 font-medium">
                  "{activeStory.text}"
                </p>
                
                <button 
                  onClick={() => handleWhatsAppOrder()}
                  className="flex w-full items-center justify-center gap-3 rounded-[2rem] bg-white py-5 text-lg font-black text-black shadow-[0_10px_30px_rgba(255,255,255,0.1)] transition-all hover:scale-[1.03] active:scale-[0.97] group"
                >
                  <MessageCircle size={24} className="group-hover:animate-pulse" />
                  QUIERO ESTE PRODUCTO
                </button>
              </div>

              {/* Progress Bar */}
              <div className="absolute top-2 left-2 right-2 flex gap-1 z-20">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="h-full w-full bg-white"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guarantee Section */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-8 rounded-full bg-white p-8 shadow-xl">
              <ShieldCheck size={64} className="text-black" />
            </div>
            <h2 className="mb-6 text-3xl font-black text-black md:text-5xl uppercase tracking-tighter">Garantía de Satisfacción</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-500 font-medium leading-relaxed">
              En Fortisol Perú, nos comprometemos con tu bienestar. Si no estás satisfecho con los resultados, te brindamos asesoría personalizada gratuita para ajustar tu tratamiento.
            </p>
            <div className="mt-10 flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-black/40">
              <span>Registro Sanitario</span>
              <span className="h-1 w-1 rounded-full bg-black/20" />
              <span>100% Natural</span>
              <span className="h-1 w-1 rounded-full bg-black/20" />
              <span>Calidad Premium</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[3rem] bg-black px-8 py-16 text-center text-white md:px-16"
          >
            <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
            
            <h2 className="relative z-10 mb-6 text-3xl font-black md:text-6xl uppercase tracking-tighter">¿Listo para sentirte mejor?</h2>
            <p className="relative z-10 mb-10 mx-auto max-w-2xl text-lg text-slate-400 font-medium leading-relaxed">
              No dejes que el dolor te detenga. Empieza hoy tu tratamiento con Fortisol y recupera tu vitalidad.
            </p>
            <button 
              onClick={() => handleWhatsAppOrder()}
              className="relative z-10 flex items-center justify-center gap-4 rounded-full bg-white px-10 py-4 text-lg font-black text-black shadow-2xl transition-all hover:scale-105 active:scale-95 mx-auto uppercase tracking-widest"
            >
              <MessageCircle size={28} />
              PEDIR POR WHATSAPP AHORA
            </button>
            <p className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Atención inmediata a nivel nacional en Perú</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-20 border-t border-slate-50">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="mb-6 flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-black flex items-center gap-1">
                  FORTISOL<span className="text-[9px] align-top">®</span>
                </span>
                <span className="text-[8px] font-black tracking-[0.3em] text-slate-400 uppercase mt-1">
                  Salud para toda la vida
                </span>
              </div>
              <p className="mb-6 max-w-sm text-base text-slate-500 font-medium leading-relaxed">
                Líderes en fórmulas nutracéuticas y aceites esenciales en Perú. Comprometidos con tu salud y bienestar natural desde hace más de 10 años.
              </p>
              <div className="flex gap-4">
                {(!settings || settings.show_instagram) && (
                  <a href={settings?.instagram || SOCIAL_INSTAGRAM} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 text-black transition-all hover:bg-black hover:text-white hover:scale-110">
                    <Instagram size={18} />
                  </a>
                )}
                {(!settings || settings.show_facebook) && (
                  <a href={settings?.facebook || SOCIAL_FACEBOOK} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 text-black transition-all hover:bg-black hover:text-white hover:scale-110">
                    <Facebook size={18} />
                  </a>
                )}
                {(!settings || settings.show_tiktok) && (
                  <a href={settings?.tiktok || SOCIAL_TIKTOK} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 text-black transition-all hover:bg-black hover:text-white hover:scale-110">
                    <MessageCircle size={18} />
                  </a>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="mb-6 text-[9px] font-black uppercase tracking-[0.3em] text-black">Explorar</h4>
              <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <li><a href="#inicio" className="hover:text-black transition-colors">Inicio</a></li>
                <li><a href="#productos" className="hover:text-black transition-colors">Catálogo</a></li>
                <li><a href="#testimonios" className="hover:text-black transition-colors">Testimonios</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Términos</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 text-[9px] font-black uppercase tracking-[0.3em] text-black">Contacto</h4>
              <ul className="space-y-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <li className="flex items-center gap-4">
                  <Phone size={14} className="text-black" />
                  {settings?.phone || '+51 976 791 234'}
                </li>
                <li className="flex items-center gap-4">
                  <MessageCircle size={14} className="text-black" />
                  <a href={`https://wa.me/${settings?.whatsapp || CONTACT_PHONE}`} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">WhatsApp Nacional</a>
                </li>
                <li className="flex items-center gap-4">
                  <MapPin size={14} className="text-black" />
                  {settings?.address || COMPANY_ADDRESS}
                </li>
                <li className="flex items-center gap-4 text-black">
                  <Truck size={14} />
                  Envíos a todo el Perú
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-20 border-t border-slate-50 pt-10 text-center text-[8px] font-black uppercase tracking-[0.4em] text-slate-300">
            <p>© {new Date().getFullYear()} {BRAND_NAME} PERÚ. TODOS LOS DERECHOS RESERVADOS.</p>
          </div>
        </div>
      </footer>

      {/* Floating Buttons */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCartOpen(true)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-2xl shadow-black/40"
        >
          <ShoppingCart size={28} />
          {cart.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[9px] font-black">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </motion.button>
        
        {(!settings || settings.show_whatsapp) && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.open(`https://wa.me/${settings?.whatsapp || CONTACT_PHONE}`, '_blank')}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-2xl shadow-black/40"
          >
            <MessageCircle size={28} />
          </motion.button>
        )}
      </div>

      {/* Promo Popup (Organa Style) */}
      <AnimatePresence>
        {isPromoOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPromoOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-white shadow-2xl my-auto"
            >
              <button 
                onClick={() => setIsPromoOpen(false)}
                className="absolute right-4 top-4 md:right-6 md:top-6 z-20 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-slate-100 text-black shadow-lg transition-transform hover:scale-110 active:scale-90"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col md:flex-row max-h-[90vh] md:max-h-none overflow-y-auto no-scrollbar">
                {/* Content */}
                <div className="flex flex-1 flex-col justify-center p-6 md:p-14 text-black">
                  <div className="mb-3 md:mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-black w-fit">
                    OFERTA EXCLUSIVA
                  </div>
                  <h2 className="text-2xl md:text-5xl font-black leading-tight tracking-tighter uppercase mb-3 md:mb-6">
                    SÚPER <br className="hidden md:block" /> PROBIÓTICOS
                  </h2>
                  
                  <p className="text-[11px] md:text-sm text-slate-500 font-medium leading-relaxed mb-4 md:mb-8">
                    Fórmula avanzada con 50 billones de cultivos vivos para una digestión perfecta y sistema inmune fuerte.
                  </p>

                  <div className="flex flex-col gap-2 md:gap-4">
                    <button 
                      onClick={() => {
                        const probioticos = PRODUCTS.find(p => p.name.toLowerCase().includes('probióticos'));
                        if (probioticos) setSelectedProduct(probioticos);
                        setIsPromoOpen(false);
                      }}
                      className="w-full rounded-full border-2 border-black py-2.5 md:py-4 text-[9px] md:text-[11px] font-black text-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                    >
                      VER MÁS
                    </button>
                    <button 
                      onClick={() => {
                        const probioticos = PRODUCTS.find(p => p.name.toLowerCase().includes('probióticos'));
                        if (probioticos) addToCart(probioticos);
                        setIsPromoOpen(false);
                      }}
                      className="w-full rounded-full bg-black py-3.5 md:py-5 text-[9px] md:text-[11px] font-black text-white uppercase tracking-widest shadow-xl shadow-black/20 hover:bg-slate-800 transition-all"
                    >
                      COMPRAR AHORA
                    </button>
                  </div>
                </div>

                {/* Image & Badge */}
                <div className="relative flex flex-1 items-center justify-center bg-slate-50 p-6 md:p-10 min-h-[200px] md:min-h-0">
                  <img 
                    src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800" 
                    alt="Promo Product" 
                    className="relative z-10 w-32 md:w-full drop-shadow-2xl transition-transform duration-700 hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute right-4 top-4 md:right-10 md:top-10 z-20 flex h-14 w-14 md:h-24 md:w-24 flex-col items-center justify-center rounded-full bg-red-500 text-white shadow-2xl ring-4 ring-white animate-bounce">
                    <p className="text-base md:text-2xl font-black">-25%</p>
                    <p className="text-[7px] md:text-[10px] font-black uppercase tracking-widest">OFF</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-6xl overflow-hidden rounded-2xl md:rounded-[3rem] bg-white shadow-2xl my-4 md:my-8"
            >
              <button 
                onClick={() => {
                  setSelectedProduct(null);
                  setModalQuantity(1);
                  setActiveImageIndex(0);
                }}
                className="absolute right-4 top-4 md:right-8 md:top-8 z-10 rounded-full bg-white/80 md:bg-slate-50 p-2 md:p-3 text-slate-900 transition-all hover:bg-black hover:text-white shadow-lg backdrop-blur-sm"
              >
                <X size={20} className="md:w-6 md:h-6" />
              </button>

              <div className="flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar">
                {/* Header: Name & Price (First on Mobile) */}
                <div className="p-6 md:p-12 pb-0 md:pb-0">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">{selectedProduct.brand || BRAND_NAME}</span>
                        {selectedProduct.originalPrice && (
                          <div className="rounded-full bg-red-500 px-3 py-1 text-[9px] font-black text-white uppercase tracking-widest shadow-lg shadow-red-500/20">
                            -{Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}%
                          </div>
                        )}
                      </div>
                      <h2 className="text-3xl md:text-6xl font-black text-black tracking-tighter leading-[0.85] uppercase">{selectedProduct.name}</h2>
                      <div className="flex items-center gap-4">
                        <div className="flex text-black gap-0.5">
                          {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} size={12} fill={i <= Math.floor(selectedProduct.rating || 4) ? "currentColor" : "none"} />
                          ))}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">({selectedProduct.reviewsCount || 156}) reseñas</span>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-4">
                      <p className="text-4xl md:text-6xl font-black text-black tracking-tighter">S/ {selectedProduct.price}</p>
                      {selectedProduct.originalPrice && (
                        <p className="text-xl md:text-2xl font-bold text-slate-300 line-through tracking-tighter">S/ {selectedProduct.originalPrice}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Left Side: Image & Gallery */}
                  <div className="flex flex-col p-6 md:p-12">
                    <div className="aspect-square w-full max-w-[400px] mx-auto overflow-hidden mb-8">
                      <img 
                        src={(selectedProduct as any).images?.[activeImageIndex] || (selectedProduct as any).image_url || (selectedProduct as any).image} 
                        alt={selectedProduct.name} 
                        className="h-full w-full object-contain drop-shadow-2xl"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    
                    {/* Thumbnail Gallery */}
                    {(selectedProduct as any).images && (selectedProduct as any).images.length > 1 && (
                      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar justify-center">
                        {(selectedProduct as any).images.map((img: string, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImageIndex(idx)}
                            className={`h-16 w-16 shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-black scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                          >
                            <img src={img} alt={`Thumbnail ${idx}`} className="h-full w-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Side: Benefits & Usage */}
                  <div className="flex flex-col p-6 md:p-12 pt-0 md:pt-12">
                    <div className="mb-10 p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
                      <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-black flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-black" /> Beneficios Destacados
                      </h4>
                      <ul className="grid grid-cols-1 gap-4">
                        {selectedProduct.benefits?.map((b, i) => (
                          <li key={i} className="flex items-start gap-4 text-xs text-slate-600 font-bold leading-tight">
                            <Check size={16} className="text-black shrink-0 mt-0.5" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-10">
                      <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-black">¿Cómo consumirlo?</h4>
                      <div className="flex items-start gap-5 p-6 rounded-[2rem] border border-black/5 bg-white shadow-sm">
                        <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-black text-white text-xs font-black shadow-lg shadow-black/20">
                          <Zap size={16} />
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium italic">"{selectedProduct.usage || 'Consultar empaque para instrucciones detalladas.'}"</p>
                      </div>
                    </div>

                    {/* Trust Badges Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-10">
                      <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-4 text-center border border-slate-100">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#742284] text-white shadow-lg">
                          <span className="text-lg font-black tracking-tighter">Y</span>
                        </div>
                        <p className="text-[7px] font-black uppercase tracking-widest text-black leading-tight">Pagos con Yape</p>
                      </div>
                      <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-4 text-center border border-slate-100">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1F71] text-white shadow-lg">
                          <span className="text-[10px] font-black italic tracking-tighter text-[#F7B600]">VISA</span>
                        </div>
                        <p className="text-[7px] font-black uppercase tracking-widest text-black leading-tight">Pago Seguro</p>
                      </div>
                      <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-4 text-center border border-slate-100">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-black text-white shadow-lg">
                          <ShieldCheck size={20} />
                        </div>
                        <p className="text-[7px] font-black uppercase tracking-widest text-black leading-tight">Garantía</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer: Nutritional Info & Actions */}
                <div className="p-6 md:p-12 bg-slate-50 border-t border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                    <div>
                      <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-black">Contenido y Detalles</h4>
                      <div className="space-y-3 text-xs text-slate-500 bg-white p-6 rounded-[2rem] border border-slate-100">
                        {selectedProduct.nutritional_info?.servingSize && (
                          <div className="flex justify-between border-b border-slate-50 pb-2">
                            <span className="font-medium">Contenido / Tamaño</span>
                            <span className="font-black text-black">{selectedProduct.nutritional_info.servingSize}</span>
                          </div>
                        )}
                        {selectedProduct.nutritional_info?.servingsPerContainer && (
                          <div className="flex justify-between border-b border-slate-50 pb-2">
                            <span className="font-medium">Porciones</span>
                            <span className="font-black text-black">{selectedProduct.nutritional_info.servingsPerContainer}</span>
                          </div>
                        )}
                        {selectedProduct.nutritional_info?.energy && (
                          <div className="flex justify-between border-b border-slate-50 pb-2">
                            <span className="font-medium">Energía / Calorías</span>
                            <span className="font-black text-black">{selectedProduct.nutritional_info.energy}</span>
                          </div>
                        )}
                        {!selectedProduct.nutritional_info?.servingSize && !selectedProduct.nutritional_info?.servingsPerContainer && !selectedProduct.nutritional_info?.energy && (
                          <p className="text-[10px] italic">Información disponible en el empaque físico.</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        <div className="flex items-center justify-between sm:justify-start gap-8 rounded-2xl border border-slate-200 bg-white px-8 py-4">
                          <button 
                            onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                            className="text-slate-400 hover:text-black transition-colors"
                          >
                            <Minus size={20} />
                          </button>
                          <span className="text-lg font-black w-8 text-center">{modalQuantity}</span>
                          <button 
                            onClick={() => setModalQuantity(modalQuantity + 1)}
                            className="text-slate-400 hover:text-black transition-colors"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => {
                            addToCart(selectedProduct, modalQuantity);
                            setSelectedProduct(null);
                            setModalQuantity(1);
                            setIsCartOpen(true);
                          }}
                          className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-black py-4 text-[10px] font-black text-white transition-all hover:bg-slate-800 uppercase tracking-widest shadow-xl shadow-black/20"
                        >
                          <ShoppingCart size={18} />
                          Añadir al Carrito
                        </button>

                        <div className="flex gap-4">
                          <button 
                            onClick={() => toggleWishlist(selectedProduct.id)}
                            className={`flex-1 sm:flex-none rounded-2xl border p-4 transition-all flex items-center justify-center ${
                              wishlist.includes(selectedProduct.id) 
                                ? 'border-red-100 text-red-500 bg-red-50' 
                                : 'border-slate-100 text-slate-300 hover:text-red-500 hover:border-red-100'
                            }`}
                          >
                            <Heart size={20} fill={wishlist.includes(selectedProduct.id) ? "currentColor" : "none"} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 right-0 top-0 z-[120] flex w-full max-w-md flex-col bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-50 p-6">
                <div className="flex items-center gap-4">
                  {checkoutStep === 2 && (
                    <button onClick={() => setCheckoutStep(1)} className="text-slate-400 hover:text-black transition-colors">
                      <ArrowLeft size={18} />
                    </button>
                  )}
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-black">
                    {checkoutStep === 1 ? 'Tu Selección' : 'Finalizar Pedido'}
                  </h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-black transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
                {checkoutStep === 1 ? (
                  cart.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <div className="mb-6 rounded-full bg-slate-50 p-10">
                        <ShoppingCart size={48} className="text-slate-200" />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Tu canasta está vacía</p>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        className="mt-8 text-[10px] font-black text-black underline underline-offset-8 uppercase tracking-widest"
                      >
                        VOLVER A LA TIENDA
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex gap-6 group">
                          <div className="h-24 w-20 overflow-hidden rounded-2xl bg-slate-50 shrink-0">
                            <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex flex-1 flex-col justify-center">
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="text-xs font-black text-black tracking-tight">{item.product.name}</h4>
                              <button onClick={() => removeFromCart(item.product.id)} className="text-slate-300 hover:text-black transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">S/ {item.product.price}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 rounded-full border border-slate-100 px-3 py-1">
                                <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 text-slate-400 hover:text-black"><Minus size={10} /></button>
                                <span className="text-[10px] font-black w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 text-slate-400 hover:text-black"><Plus size={10} /></button>
                              </div>
                              <p className="text-xs font-black text-black">S/ {item.product.price * item.quantity}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="space-y-8">
                    {/* Trust Signals Bar */}
                    <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 p-3 border border-slate-100">
                      <div className="flex flex-col items-center text-center gap-1">
                        <div className="rounded-full bg-white p-2 text-black shadow-sm">
                          <ShieldCheck size={12} />
                        </div>
                        <span className="text-[7px] font-black uppercase tracking-tighter text-slate-500">Garantía Total</span>
                      </div>
                      <div className="flex flex-col items-center text-center gap-1">
                        <div className="rounded-full bg-white p-2 text-black shadow-sm">
                          <Truck size={12} />
                        </div>
                        <span className="text-[7px] font-black uppercase tracking-tighter text-slate-500">Envío Seguro</span>
                      </div>
                      <div className="flex flex-col items-center text-center gap-1">
                        <div className="rounded-full bg-white p-2 text-black shadow-sm">
                          <Leaf size={12} />
                        </div>
                        <span className="text-[7px] font-black uppercase tracking-tighter text-slate-500">100% Natural</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                        <User size={10} /> Nombre Completo
                      </label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-3 text-xs font-medium focus:border-black focus:outline-none transition-colors"
                        placeholder="Ej. Juan Pérez"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                        <Phone size={10} /> Teléfono
                      </label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-3 text-xs font-medium focus:border-black focus:outline-none transition-colors"
                        placeholder="Ej. 987654321"
                      />
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">Departamento</label>
                        <select 
                          value={formData.department}
                          onChange={(e) => setFormData({...formData, department: e.target.value, province: '', district: '', address: ''})}
                          className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-3 text-xs font-medium focus:border-black focus:outline-none transition-colors appearance-none"
                        >
                          <option value="">Seleccionar</option>
                          {PERU_LOCATIONS.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <label className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">Provincia</label>
                          <select 
                            value={formData.province}
                            onChange={(e) => setFormData({...formData, province: e.target.value, district: '', address: ''})}
                            className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-3 text-xs font-medium focus:border-black focus:outline-none transition-colors appearance-none"
                            disabled={!formData.department}
                          >
                            <option value="">Seleccionar</option>
                            {PERU_LOCATIONS.find(r => r.name === formData.department)?.provinces.map(p => (
                              <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">Distrito</label>
                          <select 
                            value={formData.district}
                            onChange={(e) => setFormData({...formData, district: e.target.value})}
                            className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium focus:border-black focus:outline-none transition-colors appearance-none"
                            disabled={!formData.province}
                          >
                            <option value="">Seleccionar</option>
                            {PERU_LOCATIONS.find(r => r.name === formData.department)
                              ?.provinces.find(p => p.name === formData.province)
                              ?.districts.map(d => (
                                <option key={d} value={d}>{d}</option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {formData.department === 'Lima' && formData.province === 'Lima' ? (
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                          <MapPin size={12} /> Dirección de Domicilio
                        </label>
                        <textarea 
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium focus:border-black focus:outline-none transition-colors resize-none"
                          placeholder="Ej. Av. Larco 123, Dpto 402"
                          rows={3}
                        />
                        <p className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 size={10} /> ¡Genial! Tenemos cobertura directa en tu zona.
                        </p>
                      </div>
                    ) : formData.province && (
                      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 space-y-2">
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-emerald-600">
                          <Truck size={12} /> Envío Prioritario
                        </div>
                        <p className="text-sm font-black text-black">Envío por Courier Shalom</p>
                        <p className="text-[10px] font-medium text-slate-600 leading-relaxed">
                          Llegamos a todo el Perú. Tu pedido será enviado con prioridad para recojo en la agencia Shalom más cercana a tu ubicación.
                        </p>
                      </div>
                    )}

                    {/* Motivational Quote */}
                    <div className="rounded-2xl bg-black p-6 text-white overflow-hidden relative">
                      <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-2">Tu Bienestar Primero</p>
                        <p className="text-sm font-medium leading-relaxed">
                          "Estás a un paso de transformar tu salud con lo mejor de la naturaleza."
                        </p>
                      </div>
                      <div className="absolute -right-4 -bottom-4 opacity-10">
                        <Leaf size={80} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-50 p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Total Estimado</span>
                  <span className="text-xl font-black text-black tracking-tight">S/ {cartTotal}</span>
                </div>
                
                {checkoutStep === 1 ? (
                  <button 
                    disabled={cart.length === 0}
                    onClick={() => setCheckoutStep(2)}
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-black py-4 text-[10px] font-black text-white transition-all hover:bg-slate-800 disabled:opacity-50 uppercase tracking-widest shadow-xl shadow-black/10"
                  >
                    CONTINUAR PEDIDO
                  </button>
                ) : (
                  <div className="space-y-4">
                    <button 
                      disabled={
                        !formData.name || 
                        !formData.phone || 
                        !formData.department ||
                        !formData.province || 
                        !formData.district || 
                        (formData.department === 'Lima' && formData.province === 'Lima' && !formData.address)
                      }
                      onClick={handleWhatsAppOrder}
                      className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-emerald-600 py-5 text-[11px] font-black text-white transition-all hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 uppercase tracking-[0.2em] shadow-2xl shadow-emerald-200"
                    >
                      <MessageCircle size={18} className="relative z-10" />
                      <span className="relative z-10">¡SÍ, QUIERO MI PEDIDO!</span>
                      <Zap size={14} className="relative z-10 text-yellow-300 fill-yellow-300 animate-pulse" />
                    </button>
                    <div className="flex items-center justify-center gap-4 opacity-40 grayscale">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-3 object-contain" referrerPolicy="no-referrer" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-4 object-contain" referrerPolicy="no-referrer" />
                      <img src="https://logodownload.org/wp-content/uploads/2021/03/yape-logo.png" alt="Yape" className="h-4 object-contain" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Popup Modal */}
      <AnimatePresence>
        {isPopupOpen && popupOffers.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] bg-white p-5 md:p-8 shadow-2xl my-auto"
            >
              <button 
                onClick={() => setIsPopupOpen(false)}
                className="absolute right-4 top-4 md:right-6 md:top-6 z-10 rounded-full bg-slate-100 p-2 text-slate-500 hover:text-black transition-all hover:rotate-90"
              >
                <X size={18} />
              </button>
              <div className="text-center mb-4 md:mb-6">
                <span className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Exclusivo para ti</span>
                <h2 className="text-base md:text-2xl font-black uppercase tracking-tighter mt-1 md:mt-2">Ofertas de Hoy</h2>
              </div>
              <div className="space-y-3 md:space-y-4 max-h-[55vh] md:max-h-[65vh] overflow-y-auto no-scrollbar pr-1">
                {popupOffers.map(offer => (
                  <div key={offer.id} className="group relative rounded-xl md:rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 p-2 md:p-3 transition-all hover:border-black">
                    <div className="aspect-[16/9] w-full overflow-hidden rounded-lg md:rounded-2xl mb-2 md:mb-4">
                      <img src={offer.image_url} alt={offer.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <div className="flex flex-col gap-2 md:gap-4">
                      <h3 className="text-[9px] md:text-xs font-black uppercase tracking-tight leading-tight">{offer.title}</h3>
                      <button 
                        onClick={() => {
                          setIsPopupOpen(false);
                          document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full rounded-full bg-black py-2 md:py-3 text-[7px] md:text-[9px] font-black uppercase tracking-widest text-white hover:bg-slate-800 transition-all shadow-lg shadow-black/10"
                      >
                        Aprovechar Oferta
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

