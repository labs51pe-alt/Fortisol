/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
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
  Copy,
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
  Check,
  Bot,
  Send,
  Loader2,
  Sun,
  Sparkles,
  Smartphone
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
import { Product, Testimonial, CartItem, CompanySettings, ProductVariant } from './types';

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
  const [dynamicTestimonials, setDynamicTestimonials] = useState<Testimonial[]>([]);
  const [popupOffers, setPopupOffers] = useState<any[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Cart & Product Detail States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentIntroSlide, setCurrentIntroSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [shareProduct, setShareProduct] = useState<Product | null>(null);
  const [copied, setCopied] = useState(false);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Cart, 2: Shipping Form

  const handleCopyLink = (product: Product) => {
    const url = `${window.location.origin}/#productos`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = (product: Product) => {
    const url = `${window.location.origin}/#productos`;
    const text = `¡Mira este producto en Fortisol Perú! ${product.name}: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareOnFacebook = (product: Product) => {
    const url = `${window.location.origin}/#productos`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };
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

  // Help Chat States
  const [isHelpChatOpen, setIsHelpChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const predefinedQuestions = [
    "¿Cuáles son los beneficios de Fortisol?",
    "¿Cómo es el envío a Lima y Provincias?",
    "¿Tienen stock disponible?",
    "¿Qué productos recomiendan para el dolor articular?"
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isChatLoading) return;

    const userMsg = { role: 'user' as const, text };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
      
      if (!webhookUrl) {
        // Fallback to Gemini if Webhook is not configured
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: text,
          config: {
            systemInstruction: `Eres el asistente virtual de ${BRAND_NAME}. 
            Ayuda a los clientes con dudas sobre nuestros productos naturales (Omega-3, Flexanil, Fortisol Fit, Bio Alcalin, Gast-Tryn, Probióticos, Aceite de Copaiba y Molle).
            Sé amable, profesional y enfocado en el bienestar. 
            Si el cliente quiere comprar, indícale que puede usar el botón "COMPRAR" en el catálogo.
            No inventes información médica, siempre sugiere consultar con un especialista si la duda es muy específica.`
          }
        });

        const botMsg = { role: 'bot' as const, text: response.text || "Lo siento, no pude procesar tu mensaje." };
        setChatMessages(prev => [...prev, botMsg]);
        return;
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text,
          customer: {
            name: formData.name,
            phone: formData.phone
          },
          business_rules: {
            stock: "Siempre hay stock de todos los productos",
            shipping_lima: "Envío directo a domicilio con Fortisol",
            shipping_provincias: "Envío exclusivo por Courier Shalom (recojo en agencia)",
            free_shipping_threshold: 200
          },
          cart: cart.map(i => ({ name: i.product.name, qty: i.quantity })),
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Handle different possible response formats from n8n
        const botText = data.output || data.message || data.text || 'Gracias por tu mensaje. Un asesor te contactará pronto.';
        setChatMessages(prev => [...prev, { role: 'bot', text: botText }]);
      } else {
        throw new Error('Error en el servidor');
      }
    } catch (error) {
      console.error('Chat Error:', error);
      setChatMessages(prev => [...prev, { role: 'bot', text: 'Lo siento, hubo un problema al conectar con el asistente. Por favor, intenta de nuevo o contáctanos por WhatsApp.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  useEffect(() => {
    if (isHelpChatOpen && chatMessages.length === 0) {
      setChatMessages([{ 
        role: 'bot', 
        text: '¡Hola! Soy Sol ☀️, tu asistente de Fortisol. Hacemos envíos directos en Lima y a todo el Perú por Shalom. ¿En qué puedo ayudarte hoy?' 
      }]);
    }
  }, [isHelpChatOpen]);

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
    const { data: tData } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    const { data: settingsData } = await supabase.from('settings').select('*').eq('key', 'company_info').single();
    
    if (pData && pData.length > 0) setDynamicProducts(pData);
    else setDynamicProducts([]); // No fallback to demo data

    if (sData && sData.length > 0) setDynamicSlides(sData);
    else setDynamicSlides([]); // No fallback to demo data

    if (tData && tData.length > 0) setDynamicTestimonials(tData);
    else setDynamicTestimonials([]);

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

  const addToCart = (product: Product, quantity: number = 1, variant?: ProductVariant) => {
    setCart(prev => {
      const variantId = variant?.id || '';
      const existing = prev.find(item => item.product.id === product.id && (item.selectedVariant?.id || '') === variantId);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id && (item.selectedVariant?.id || '') === variantId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedVariant: variant }];
    });
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, variantId: string = '') => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && (item.selectedVariant?.id || '') === variantId)));
  };

  const updateQuantity = (productId: string, delta: number, variantId: string = '') => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId && (item.selectedVariant?.id || '') === variantId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.selectedVariant ? item.selectedVariant.price : item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  const handleWhatsAppOrder = async () => {
    const cartDetails = cart.map(item => {
      const price = item.selectedVariant ? item.selectedVariant.price : item.product.price;
      const variantName = item.selectedVariant ? ` (${item.selectedVariant.name})` : '';
      return `- ${item.product.name}${variantName} (x${item.quantity}): S/ ${price * item.quantity}`;
    }).join('\n');

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
        items: cart.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          variant_id: item.selectedVariant?.id || null,
          variant_name: item.selectedVariant?.name || null,
          quantity: item.quantity,
          price: item.selectedVariant ? item.selectedVariant.price : item.product.price
        })),
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
    return `https://www.tiktok.com/embed/v2/${id}`;
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
    } else if (url.includes('youtube.com/shorts/')) {
      videoId = url.split('shorts/')[1].split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&playsinline=1` : url;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${scrolled ? 'bg-white/95 py-2 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] backdrop-blur-md border-b border-slate-100' : 'bg-transparent py-4'}`}>
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
            {[
              { label: 'Inicio', href: '#inicio' },
              { label: 'Catálogo', href: '#productos' },
              { label: 'Testimonios', href: '#testimonios' }
            ].map((item) => (
              <a 
                key={item.label}
                href={item.href} 
                className={`group relative text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${scrolled ? 'text-black/60 hover:text-black' : 'text-white/70 hover:text-white'}`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full ${scrolled ? 'bg-black' : 'bg-white'}`} />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 transition-all hover:scale-110 ${scrolled ? 'text-black' : 'text-white'}`}
            >
              <ShoppingCart size={18} />
              {cart.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-600 text-[7px] font-bold text-white">
                  {cart.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => handleWhatsAppOrder()}
              className={`hidden items-center gap-2 rounded-full px-6 py-2.5 text-[10px] font-black transition-all uppercase tracking-widest md:flex shadow-lg hover:scale-105 active:scale-95 ${scrolled ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20' : 'bg-white text-black hover:bg-slate-100 shadow-white/20'}`}
            >
              <MessageCircle size={14} />
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
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xl md:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 right-0 top-0 z-[70] flex w-full max-w-xs flex-col bg-white p-10 md:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="text-xl font-black tracking-tighter">FORTISOL</span>
                <button onClick={() => setIsMenuOpen(false)} className="text-slate-400 hover:text-black transition-colors">
                  <X size={24} />
                </button>
              </div>

              <nav className="flex flex-col gap-8">
                {[
                  { label: 'Inicio', href: '#inicio' },
                  { label: 'Catálogo', href: '#productos' },
                  { label: 'Testimonios', href: '#testimonios' }
                ].map((item, i) => (
                  <motion.a
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + (i * 0.1) }}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-2xl font-black uppercase tracking-tight text-black hover:text-slate-500 transition-colors"
                  >
                    {item.label}
                  </motion.a>
                ))}
              </nav>

              <div className="mt-auto space-y-8">
                <button 
                  onClick={() => { handleWhatsAppOrder(); setIsMenuOpen(false); }}
                  className="flex w-full items-center justify-center gap-3 rounded-full bg-emerald-600 py-5 text-xs font-black text-white shadow-xl shadow-emerald-200 uppercase tracking-widest"
                >
                  <MessageCircle size={20} />
                  WHATSAPP DIRECTO
                </button>
                
                <div className="flex justify-center gap-6">
                  {(!settings || settings.show_instagram) && (
                    <a href={settings?.instagram || SOCIAL_INSTAGRAM} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-black hover:bg-black hover:text-white transition-all shadow-sm">
                      <Instagram size={20} />
                    </a>
                  )}
                  {(!settings || settings.show_facebook) && (
                    <a href={settings?.facebook || SOCIAL_FACEBOOK} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-black hover:bg-black hover:text-white transition-all shadow-sm">
                      <Facebook size={20} />
                    </a>
                  )}
                  {(!settings || settings.show_tiktok) && (
                    <a href={settings?.tiktok || SOCIAL_TIKTOK} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-black hover:bg-black hover:text-white transition-all shadow-sm">
                      <MessageCircle size={20} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </>
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
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
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
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white mb-3 drop-shadow-lg">
                      {activeSlides[currentIntroSlide]?.subtitle}
                    </h2>
                    <h1 className="text-5xl font-black tracking-tight text-white md:text-7xl lg:text-[7.5rem] drop-shadow-[0_15px_40px_rgba(0,0,0,0.7)] max-w-6xl leading-[0.9] uppercase text-center">
                      {activeSlides[currentIntroSlide]?.title}
                    </h1>
                  </div>

                  {/* Description */}
                  <p className="mb-10 max-w-2xl text-sm font-bold text-white/90 md:text-lg leading-relaxed drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)] text-center">
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
                    className="flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-[11px] font-black text-black shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:bg-slate-100 hover:scale-105 active:scale-95 uppercase tracking-widest group"
                  >
                    ENTRAR A LA WEB
                    <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

                {/* Progress Dots */}
                <div className="flex gap-2">
                  {activeSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIntroSlide(i)}
                      className={`h-1 rounded-full transition-all duration-500 ${currentIntroSlide === i ? 'w-8 bg-emerald-500' : 'w-2 bg-white/20'}`}
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
          <div className="mx-auto max-w-7xl grid grid-cols-4 gap-6 w-full">
            {[
              { icon: <Truck size={18} />, label: "Envío a todo Perú", sub: "Rápido y seguro" },
              { icon: <ShieldCheck size={18} />, label: "100% Natural", sub: "Sin químicos" },
              { icon: <Star size={18} />, label: "Calidad Premium", sub: "Garantizada" },
              { icon: <CheckCircle2 size={18} />, label: "Soporte 24/7", sub: "Asesoría gratuita" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + (i * 0.1), duration: 0.8 }}
                className="flex items-center gap-4 rounded-3xl bg-white/5 backdrop-blur-2xl p-5 border border-white/10 hover:bg-white/10 transition-colors group cursor-default"
              >
                <div className="rounded-2xl bg-white/10 p-3 text-white group-hover:bg-white group-hover:text-black transition-all duration-500">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white">{item.label}</p>
                  <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest group-hover:text-white/60 transition-colors">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promos Bar (Organa Style) */}
      {settings?.promo_enabled && (
        <div className="bg-black py-6 overflow-hidden border-y border-white/10 relative flex items-center">
          <div className="flex whitespace-nowrap animate-marquee items-center">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-12 mx-12">
                <div className="flex items-center gap-4 text-white">
                  <Zap size={20} className="text-yellow-400 fill-yellow-400 animate-pulse" />
                  <h3 className="text-3xl font-black uppercase tracking-tighter italic">{settings?.promo_title || 'OFERTAS ESPECIALES'}</h3>
                  <div className="h-2 w-2 rounded-full bg-white/20" />
                </div>
                <p className="text-[11px] font-black text-white/60 uppercase tracking-[0.3em]">
                  ¡OFERTAS EXCLUSIVAS POR TIEMPO LIMITADO!
                </p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="h-1 w-1 rounded-full bg-white/20" />
                  ))}
                </div>
              </div>
            ))}
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
      <section id="productos" className="bg-[#FAFAFA] py-20">
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
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative rounded-full px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                    selectedCategory === cat 
                      ? 'bg-emerald-600 text-white shadow-[0_10px_30px_-5px_rgba(16,185,129,0.3)] scale-105' 
                      : 'bg-white text-slate-400 border border-slate-100 hover:border-emerald-600 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  {cat}
                  {selectedCategory === cat && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-full bg-emerald-600 -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <motion.div 
            layout
            className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence mode='popLayout'>
              {activeProducts
                .filter((p) => selectedCategory === 'Todos' || p.category === selectedCategory)
                .map((product) => (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`group relative flex flex-col bg-white rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] ${
                      product.category === 'Combos' ? 'ring-2 ring-amber-400/30' : 'ring-1 ring-slate-100 hover:ring-slate-200'
                    }`}
                  >
                    {/* Badges */}
                    <div className="absolute left-6 top-6 z-20 flex flex-col gap-2">
                      {product.category === 'Combos' && (
                        <div className="rounded-full bg-amber-500 px-4 py-1.5 text-[8px] font-black uppercase tracking-widest text-white shadow-lg shadow-amber-500/20">
                          COMBO ESPECIAL
                        </div>
                      )}
                      {product.tag && product.category !== 'Combos' && (
                        <div className="rounded-full bg-emerald-600 px-4 py-1.5 text-[8px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-600/20">
                          {product.tag}
                        </div>
                      )}
                    </div>

                    {/* Image Section */}
                    <div className="aspect-square overflow-hidden bg-slate-50 relative">
                      <img 
                        src={product.image_url || product.image} 
                        alt={product.name} 
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Quick Add Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-30">
                        <div className="flex flex-col gap-3">
                          <button 
                            onClick={() => setSelectedProduct(product)}
                            className="w-full rounded-2xl bg-white/90 backdrop-blur-xl py-4 text-[10px] font-black uppercase tracking-[0.2em] text-black shadow-2xl hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
                          >
                            DETALLES
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                            className="w-full rounded-2xl bg-emerald-600 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-2xl hover:bg-emerald-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                          >
                            <ShoppingCart size={14} />
                            AÑADIR AL CARRITO
                          </button>
                        </div>
                      </div>

                      {/* Wishlist & Share */}
                      <div className="absolute right-6 top-6 z-20 flex flex-col gap-3 translate-x-12 group-hover:translate-x-0 transition-transform duration-500 ease-out">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          className={`rounded-full p-3 transition-all duration-300 shadow-xl ${
                            wishlist.includes(product.id) 
                              ? 'bg-red-500 text-white' 
                              : 'bg-white/90 backdrop-blur-md text-slate-400 hover:text-red-500'
                          }`}
                        >
                          <Heart size={18} fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShareProduct(product);
                          }}
                          className="rounded-full p-3 bg-white/90 backdrop-blur-md text-slate-400 hover:text-black transition-all duration-300 shadow-xl"
                        >
                          <Share2 size={18} />
                        </button>
                      </div>

                      {/* Gradient Overlay for better readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Info Section */}
                    <div className="flex flex-1 flex-col p-8 text-center bg-white relative z-10">
                      <div className="mb-3 flex items-center justify-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">{product.category}</span>
                        <div className="h-1 w-1 rounded-full bg-slate-200" />
                        <div className="flex text-amber-400">
                          <Star size={10} fill="currentColor" />
                          <span className="ml-1 text-[10px] font-black text-black">{product.rating || 5.0}</span>
                        </div>
                      </div>
                      
                      <h3 className="mb-4 text-xl font-black text-black tracking-tight leading-tight group-hover:text-slate-600 transition-colors uppercase">
                        {product.name}
                      </h3>
                      
                      <div className="mt-auto flex flex-col items-center gap-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-black tracking-tighter">
                            {product.variants && product.variants.length > 0 ? 'Desde ' : ''}S/ {product.price}
                          </span>
                          {product.old_price && (
                            <span className="text-xs font-bold text-slate-300 line-through">S/ {product.old_price}</span>
                          )}
                        </div>
                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Stock Disponible</p>
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
              {(dynamicTestimonials.length > 0 ? dynamicTestimonials : TESTIMONIALS).map((t, i) => (
                <motion.div 
                  key={t.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => {
                    setActiveStory(t);
                    setIsMuted(false);
                  }}
                  className="relative h-[400px] min-w-[250px] cursor-pointer overflow-hidden rounded-[2rem] bg-slate-100 shadow-2xl transition-all hover:scale-[1.02] snap-start group border border-slate-100"
                >
                  <img 
                    src={t.thumbnail || "https://picsum.photos/seed/test1/400/700"} 
                    alt={t.name} 
                    className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  
                  <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
                    <div className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-white drop-shadow-md">VIDEO</span>
                  </div>
                  
                  <div className="absolute top-6 right-6 z-10 rounded-full bg-white/10 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-md border border-white/20 flex items-center gap-1">
                    <ShieldCheck size={10} className="text-emerald-400" />
                    Verificado
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110">
                    <div className="rounded-full bg-white/10 p-6 backdrop-blur-xl border border-white/30 shadow-2xl">
                      <Play className="text-white ml-1" size={32} fill="white" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="mb-4 flex items-center gap-4">
                      <div className="relative">
                        <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full border-2 border-white/50 shadow-2xl object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center">
                          <Check size={8} className="text-white" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-base font-black leading-none tracking-tight drop-shadow-md">{t.name}</h4>
                        <p className="text-[9px] font-black text-white/80 uppercase tracking-[0.2em] mt-1.5 drop-shadow-md">{t.location}</p>
                      </div>
                    </div>
                    <p className="line-clamp-2 text-xs font-bold leading-relaxed text-white/90 italic drop-shadow-md">"{t.text}"</p>
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
              className="absolute right-6 top-6 z-[110] rounded-full bg-white/10 p-4 text-white backdrop-blur-xl hover:bg-white/20 transition-all hover:rotate-90 border border-white/10"
            >
              <X size={24} />
            </button>

            <motion.div 
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative aspect-[9/16] w-full max-w-[420px] overflow-hidden rounded-[3.5rem] bg-black shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10"
            >
              {activeStory.video_url?.includes('tiktok.com') ? (
                <div className="h-full w-full bg-black">
                  <iframe
                    src={getTikTokEmbedUrl(activeStory.video_url)}
                    className="h-full w-full border-none"
                    allow="autoplay; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : activeStory.video_url?.includes('youtube.com') || activeStory.video_url?.includes('youtu.be') ? (
                <div className="h-full w-full bg-black">
                  <iframe
                    src={getYoutubeEmbedUrl(activeStory.video_url)}
                    className="h-full w-full border-none"
                    allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video 
                  src={activeStory.video_url} 
                  autoPlay 
                  loop 
                  muted={isMuted}
                  playsInline
                  className="h-full w-full object-contain bg-black"
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
              <ShieldCheck size={64} className="text-emerald-600" />
            </div>
            <h2 className="mb-6 text-3xl font-black text-black md:text-5xl uppercase tracking-tighter">Garantía de Satisfacción</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-500 font-medium leading-relaxed">
              En Fortisol Perú, nos comprometemos con tu bienestar. Si no estás satisfecho con los resultados, te brindamos asesoría personalizada gratuita para ajustar tu tratamiento.
            </p>
            <div className="mt-10 flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-emerald-600/40">
              <span>Registro Sanitario</span>
              <span className="h-1 w-1 rounded-full bg-emerald-600/20" />
              <span>100% Natural</span>
              <span className="h-1 w-1 rounded-full bg-emerald-600/20" />
              <span>Calidad Premium</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto max-w-6xl px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-emerald-900 via-emerald-950 to-black px-8 py-20 text-center text-white md:px-16"
          >
            <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
            
            <div className="relative z-10 mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 backdrop-blur-md">
              <Sparkles size={14} />
              Tratamiento Natural #1 del Perú
            </div>

            <h2 className="relative z-10 mb-6 text-4xl font-black md:text-7xl uppercase tracking-tighter leading-[0.9]">
              Tu bienestar <br className="hidden md:block" /> no puede esperar
            </h2>
            <p className="relative z-10 mb-12 mx-auto max-w-2xl text-lg text-zinc-400 font-medium leading-relaxed">
              Únete a miles de peruanos que ya recuperaron su movilidad y energía con Fortisol. 
              Resultados garantizados desde las primeras semanas de tratamiento.
            </p>
            
            <button 
              onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative z-10 flex items-center justify-center gap-4 rounded-full bg-white px-12 py-5 text-xl font-black text-black shadow-2xl transition-all hover:scale-105 active:scale-95 mx-auto uppercase tracking-widest"
            >
              VER TRATAMIENTOS AHORA
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-transform group-hover:translate-x-1">
                <Sparkles size={18} />
              </div>
            </button>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-50 grayscale">
              <div className="flex items-center gap-2">
                <Check size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Garantía de Calidad</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Envío a todo el Perú</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Fórmula 100% Natural</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-24 border-t border-slate-100">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-16 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="mb-8 flex flex-col">
                <span className="text-3xl font-black tracking-tighter text-black flex items-center gap-1">
                  FORTISOL<span className="text-[10px] align-top">®</span>
                </span>
                <span className="text-[9px] font-black tracking-[0.4em] text-slate-400 uppercase mt-2">
                  Salud para toda la vida
                </span>
              </div>
              <p className="mb-10 max-w-md text-lg text-slate-500 font-medium leading-relaxed">
                Líderes en fórmulas nutracéuticas y aceites esenciales en Perú. Comprometidos con tu salud y bienestar natural desde hace más de 10 años.
              </p>
              <div className="flex gap-5">
                {(!settings || settings.show_instagram) && (
                  <a href={settings?.instagram || SOCIAL_INSTAGRAM} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-black transition-all hover:bg-black hover:text-white hover:scale-110 hover:-rotate-6 shadow-sm">
                    <Instagram size={20} />
                  </a>
                )}
                {(!settings || settings.show_facebook) && (
                  <a href={settings?.facebook || SOCIAL_FACEBOOK} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-black transition-all hover:bg-black hover:text-white hover:scale-110 hover:rotate-6 shadow-sm">
                    <Facebook size={20} />
                  </a>
                )}
                {(!settings || settings.show_tiktok) && (
                  <a href={settings?.tiktok || SOCIAL_TIKTOK} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-black transition-all hover:bg-black hover:text-white hover:scale-110 hover:-rotate-6 shadow-sm">
                    <MessageCircle size={20} />
                  </a>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="mb-8 text-[10px] font-black uppercase tracking-[0.4em] text-black">Explorar</h4>
              <ul className="space-y-5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                <li><a href="#inicio" className="hover:text-black transition-all hover:translate-x-1 inline-block">Inicio</a></li>
                <li><a href="#productos" className="hover:text-black transition-all hover:translate-x-1 inline-block">Catálogo</a></li>
                <li><a href="#testimonios" className="hover:text-black transition-all hover:translate-x-1 inline-block">Testimonios</a></li>
                <li><a href="#" className="hover:text-black transition-all hover:translate-x-1 inline-block">Términos</a></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="mb-8 text-[10px] font-black uppercase tracking-[0.4em] text-black">Contacto</h4>
              <ul className="space-y-6 text-[11px] font-black uppercase tracking-widest text-slate-400">
                <li className="flex items-center gap-4 group">
                  <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all">
                    <Phone size={14} />
                  </div>
                  {settings?.phone || '+51 976 791 234'}
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all">
                    <MessageCircle size={14} />
                  </div>
                  <a href={`https://wa.me/${settings?.whatsapp || CONTACT_PHONE}`} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">WhatsApp Nacional</a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="mb-8 text-[10px] font-black uppercase tracking-[0.4em] text-black">Newsletter</h4>
              <p className="mb-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Suscríbete para recibir ofertas exclusivas y consejos de salud.</p>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="TU EMAIL" 
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:border-black focus:outline-none transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-emerald-600 p-2.5 text-white hover:bg-emerald-700 transition-all">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-24 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-slate-100 pt-12">
            <div className="flex items-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4 object-contain" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 object-contain" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" alt="Paypal" className="h-4 object-contain" />
            </div>
            <div className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-300">
              © {new Date().getFullYear()} {BRAND_NAME} PERÚ. TODOS LOS DERECHOS RESERVADOS.
            </div>
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

        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsHelpChatOpen(true)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-200 transition-all hover:bg-emerald-500"
        >
          <div className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 border-2 border-white"></span>
          </div>
          <Sun size={28} className="transition-transform group-hover:scale-110" />
          <span className="absolute -left-20 top-1/2 -translate-y-1/2 rounded-lg bg-black px-3 py-1.5 text-[10px] font-black text-white opacity-0 transition-opacity group-hover:opacity-100 uppercase tracking-widest pointer-events-none">
            ¡Hola!
          </span>
        </motion.button>
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
              className="relative w-full max-w-6xl overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-white shadow-2xl my-4 md:my-8"
            >
              <button 
                onClick={() => {
                  setSelectedProduct(null);
                  setSelectedVariant(null);
                  setModalQuantity(1);
                  setActiveImageIndex(0);
                }}
                className="absolute right-4 top-4 md:right-8 md:top-8 z-20 rounded-full bg-slate-100 p-2 md:p-3 text-slate-900 transition-all hover:bg-emerald-600 hover:text-white shadow-lg"
              >
                <X size={20} className="md:w-6 md:h-6" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto no-scrollbar">
                {/* Left Side: Image & Badges */}
                <div className="relative flex items-center justify-center bg-white p-8 md:p-16 border-r border-slate-50 aspect-square md:aspect-auto">
                  {/* Discount Badge */}
                  {selectedProduct.originalPrice && (
                    <div className="absolute left-8 top-8 z-10 bg-red-600 px-4 py-2 text-sm font-black text-white shadow-lg">
                      -{Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}%
                    </div>
                  )}
                  
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img 
                      src={(selectedProduct as any).images?.[activeImageIndex] || (selectedProduct as any).image_url || (selectedProduct as any).image} 
                      alt={selectedProduct.name} 
                      className="max-h-full max-w-full object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Right Side: Product Info */}
                <div className="flex flex-col p-8 md:p-16 bg-white">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-sm font-bold text-emerald-600 uppercase tracking-wider">{selectedProduct.category || 'Herbals & Health'}</span>
                    <span className="text-xs font-medium text-slate-400">sku: {selectedProduct.sku || '32252532265555'}</span>
                  </div>

                  <h2 className="mb-4 text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight uppercase">
                    {selectedProduct.name}
                  </h2>

                  <div className="mb-8 flex items-center gap-4">
                    <div className="flex text-amber-400 gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} size={18} fill={i <= Math.floor(selectedProduct.rating || 5) ? "currentColor" : "none"} />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-slate-400">({selectedProduct.reviewsCount || 0}) reseñas</span>
                  </div>

                  <div className="mb-10 flex items-baseline gap-4">
                    <p className="text-5xl font-black text-slate-900 tracking-tighter">
                      S/ {selectedVariant ? selectedVariant.price : selectedProduct.price}
                    </p>
                    {(selectedVariant?.originalPrice || (!selectedVariant && selectedProduct.originalPrice)) && (
                      <p className="text-2xl font-bold text-slate-300 line-through tracking-tighter">
                        S/ {selectedVariant ? selectedVariant.originalPrice : selectedProduct.originalPrice}
                      </p>
                    )}
                  </div>

                  {/* Variants Selection */}
                  {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                    <div className="mb-10">
                      <h4 className="mb-4 text-sm font-black text-slate-900 uppercase tracking-widest">Opciones disponibles:</h4>
                      <div className="flex flex-wrap gap-3">
                        {selectedProduct.variants.map((variant) => (
                          <button
                            key={variant.id}
                            onClick={() => setSelectedVariant(variant)}
                            className={`rounded-2xl border-2 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                              selectedVariant?.id === variant.id
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-600 shadow-lg shadow-emerald-600/10'
                                : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                            }`}
                          >
                            {variant.name} - S/ {variant.price}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Benefits */}
                  <div className="mb-10">
                    <h4 className="mb-6 text-lg font-black text-slate-900">Beneficios:</h4>
                    <ul className="space-y-4">
                      {(selectedProduct.benefits || [
                        "🧘 Reduce el estrés y la ansiedad, mejorando el bienestar general",
                        "⚡ Aumenta la energía física y mental durante el día",
                        "💪 Mejora la fuerza, resistencia y rendimiento físico",
                        "❤️ Potencia el rendimiento y la vitalidad masculina",
                        "🧬 Apoya el equilibrio hormonal y niveles de testosterona",
                        "🧠 Mejora la concentración, enfoque y estado de ánimo",
                        "😴 Favorece un mejor descanso y recuperación"
                      ]).map((benefit: string, i: number) => (
                        <li key={i} className="text-sm text-slate-600 font-medium leading-relaxed flex items-start gap-3">
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-4 mb-12">
                    {[
                      { icon: <Smartphone className="text-emerald-600" size={32} />, title: "Pagos seguros con Yape" },
                      { icon: <CreditCard className="text-emerald-600" size={32} />, title: "Pago seguro Múltiples" },
                      { icon: <ShieldCheck className="text-emerald-600" size={32} />, title: "Garantía 30 días" }
                    ].map((badge, i) => (
                      <div key={i} className="flex flex-col items-center justify-center rounded-2xl bg-emerald-50/50 p-6 text-center border border-emerald-100 transition-all hover:bg-emerald-50">
                        <div className="mb-4">{badge.icon}</div>
                        <p className="text-[10px] font-bold text-slate-800 leading-tight uppercase tracking-tight">{badge.title}</p>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-6 rounded-xl border border-slate-200 bg-white px-6 py-4">
                      <button 
                        onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                        className="text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="text-xl font-black w-8 text-center">{modalQuantity}</span>
                      <button 
                        onClick={() => setModalQuantity(modalQuantity + 1)}
                        className="text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => {
                        addToCart(selectedProduct, modalQuantity, selectedVariant || undefined);
                        setSelectedProduct(null);
                        setSelectedVariant(null);
                        setModalQuantity(1);
                        setIsCartOpen(true);
                      }}
                      className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-emerald-600 py-4 text-sm font-black text-white transition-all hover:bg-emerald-700 uppercase tracking-widest shadow-xl shadow-emerald-600/20"
                    >
                      <ShoppingCart size={20} />
                      Añadir al carrito
                    </button>

                    <button 
                      onClick={() => toggleWishlist(selectedProduct.id)}
                      className={`rounded-xl border p-4 transition-all flex items-center justify-center ${
                        wishlist.includes(selectedProduct.id) 
                          ? 'border-red-100 text-red-500 bg-red-50' 
                          : 'border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100'
                      }`}
                    >
                      <Heart size={24} fill={wishlist.includes(selectedProduct.id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Chat Drawer */}
      <AnimatePresence>
        {isHelpChatOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHelpChatOpen(false)}
              className="fixed inset-0 z-[110] bg-black/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 right-0 top-0 z-[120] flex h-full w-full max-w-[400px] flex-col bg-white shadow-2xl md:h-[calc(100%-2rem)] md:top-4 md:right-4 md:rounded-[2.5rem] md:bottom-4"
            >
              {/* Chat Header */}
              <div className="relative overflow-hidden rounded-t-[2.5rem] bg-emerald-600 p-6 text-white md:p-8">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-black/10 blur-2xl" />
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner">
                        <Sun size={24} className="text-white" />
                      </div>
                      <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-emerald-600 bg-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black uppercase tracking-[0.2em]">Sol</h2>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-medium text-emerald-100">Asistente Virtual</span>
                        <span className="h-1 w-1 rounded-full bg-emerald-300" />
                        <span className="text-[10px] font-medium text-emerald-100">En línea</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsHelpChatOpen(false)} 
                    className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar space-y-6 bg-slate-50/50">
                {chatMessages.map((msg, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    key={idx} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`relative max-w-[85%] rounded-3xl px-5 py-4 text-xs font-medium shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-emerald-600 text-white rounded-tr-none' 
                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                    }`}>
                      {msg.text}
                      <span className={`absolute top-0 text-[8px] opacity-30 ${msg.role === 'user' ? '-left-8' : '-right-8'}`}>
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
                {isChatLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white text-slate-400 border border-slate-100 rounded-3xl rounded-tl-none px-6 py-4 shadow-sm flex gap-1">
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Chat Input Area */}
              <div className="bg-white p-6 md:p-8 space-y-6 rounded-b-[2.5rem]">
                {chatMessages.length <= 1 && (
                  <div className="flex flex-wrap gap-2">
                    {predefinedQuestions.map((q, idx) => (
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="text-left rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-[9px] font-black uppercase tracking-wider text-slate-500 hover:border-emerald-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                      >
                        {q}
                      </motion.button>
                    ))}
                  </div>
                )}
                
                <div className="relative group">
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(chatInput)}
                    placeholder="Escribe tu duda aquí..."
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 pl-6 pr-14 py-4 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:outline-none transition-all shadow-inner"
                  />
                  <button 
                    onClick={() => handleSendMessage(chatInput)}
                    disabled={!chatInput.trim() || isChatLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-emerald-600 p-2.5 text-white hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-600/20"
                  >
                    <Send size={18} />
                  </button>
                </div>
                <p className="text-center text-[8px] font-black uppercase tracking-widest text-slate-300">
                  Impulsado por Fortisol AI
                </p>
              </div>
            </motion.div>
          </>
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
                {checkoutStep === 1 && cart.length > 0 && (
                  <div className="mb-10 rounded-[2rem] bg-slate-50 p-6 border border-slate-100 shadow-inner">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Truck size={16} className={cartTotal >= 200 ? 'text-emerald-500' : 'text-slate-400'} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-black">
                          {cartTotal >= 200 ? '¡Envío Gratis Activado!' : 'Envío a todo el Perú'}
                        </span>
                      </div>
                      <span className="text-[9px] font-black text-slate-400">
                        {cartTotal >= 200 ? 'S/ 0.00' : `Faltan S/ ${200 - cartTotal}`}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (cartTotal / 200) * 100)}%` }}
                        className={`h-full transition-all duration-1000 ${cartTotal >= 200 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-emerald-600'}`}
                      />
                    </div>
                    {cartTotal < 200 && (
                      <p className="mt-3 text-[8px] font-bold text-slate-400 uppercase tracking-widest text-center">Agrega S/ {200 - cartTotal} más para envío gratuito</p>
                    )}
                  </div>
                )}
                
                {checkoutStep === 1 ? (
                  cart.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="mb-6 rounded-full bg-slate-50 p-10 relative"
                      >
                        <ShoppingCart size={48} className="text-slate-200" />
                        <div className="absolute top-8 right-8 h-4 w-4 bg-white rounded-full border-2 border-slate-100" />
                      </motion.div>
                      <h3 className="text-lg font-black uppercase tracking-tight text-black mb-2">Tu canasta está vacía</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] max-w-[200px] leading-relaxed">Descubre nuestros productos y empieza a cuidarte hoy.</p>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        className="mt-8 rounded-full bg-emerald-600 px-8 py-4 text-[10px] font-black text-white uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl"
                      >
                        EXPLORAR TIENDA
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-10">
                      {cart.map((item) => (
                        <div key={`${item.product.id}-${item.selectedVariant?.id || ''}`} className="flex gap-6 group relative">
                          <div className="h-28 w-24 overflow-hidden rounded-[1.5rem] bg-slate-50 shrink-0 border border-slate-100 shadow-sm">
                            <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex flex-1 flex-col justify-center">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-sm font-black text-black tracking-tight leading-tight uppercase">{item.product.name}</h4>
                                {item.selectedVariant && (
                                  <p className="mt-1 text-[9px] font-bold text-emerald-600 uppercase tracking-widest">{item.selectedVariant.name}</p>
                                )}
                              </div>
                              <button onClick={() => removeFromCart(item.product.id, item.selectedVariant?.id)} className="text-slate-300 hover:text-red-500 transition-all hover:scale-110">
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                              S/ {item.selectedVariant ? item.selectedVariant.price : item.product.price}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-5 rounded-full border border-slate-100 bg-slate-50 px-4 py-1.5 shadow-inner">
                                <button onClick={() => updateQuantity(item.product.id, -1, item.selectedVariant?.id)} className="p-1 text-slate-400 hover:text-black transition-colors"><Minus size={12} /></button>
                                <span className="text-xs font-black w-5 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.product.id, 1, item.selectedVariant?.id)} className="p-1 text-slate-400 hover:text-black transition-colors"><Plus size={12} /></button>
                              </div>
                              <p className="text-sm font-black text-black tracking-tighter">
                                S/ {(item.selectedVariant ? item.selectedVariant.price : item.product.price) * item.quantity}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="space-y-8">
                    {/* Trust Signals Bar */}
                    <div className="grid grid-cols-3 gap-3 rounded-[2rem] bg-slate-50 p-4 border border-slate-100 shadow-inner">
                      <div className="flex flex-col items-center text-center gap-2">
                        <div className="rounded-full bg-white p-2.5 text-black shadow-sm border border-slate-100">
                          <ShieldCheck size={14} />
                        </div>
                        <span className="text-[7px] font-black uppercase tracking-tighter text-slate-500 leading-tight">Garantía Total</span>
                      </div>
                      <div className="flex flex-col items-center text-center gap-2">
                        <div className="rounded-full bg-white p-2.5 text-black shadow-sm border border-slate-100">
                          <Truck size={14} />
                        </div>
                        <span className="text-[7px] font-black uppercase tracking-tighter text-slate-500 leading-tight">Envío Seguro</span>
                      </div>
                      <div className="flex flex-col items-center text-center gap-2">
                        <div className="rounded-full bg-white p-2.5 text-black shadow-sm border border-slate-100">
                          <MessageCircle size={14} />
                        </div>
                        <span className="text-[7px] font-black uppercase tracking-tighter text-slate-500 leading-tight">Soporte 24/7</span>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-4">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Datos de Contacto</label>
                        <div className="grid gap-4">
                          <div className="relative group">
                            <input 
                              type="text" 
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              placeholder="NOMBRE COMPLETO"
                              className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-xs font-black uppercase tracking-widest focus:border-black focus:bg-white focus:outline-none transition-all shadow-sm"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors">
                              <User size={16} />
                            </div>
                          </div>
                          <div className="relative group">
                            <input 
                              type="tel" 
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              placeholder="WHATSAPP / CELULAR"
                              className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-xs font-black uppercase tracking-widest focus:border-black focus:bg-white focus:outline-none transition-all shadow-sm"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors">
                              <Phone size={16} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Ubicación de Entrega</label>
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <select 
                              value={formData.department}
                              onChange={(e) => setFormData({...formData, department: e.target.value, province: '', district: '', address: ''})}
                              className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:border-black focus:bg-white focus:outline-none transition-all appearance-none shadow-sm"
                            >
                              <option value="">DEPARTAMENTO</option>
                              {PERU_LOCATIONS.map(r => (
                                <option key={r.id} value={r.name}>{r.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <select 
                              value={formData.province}
                              onChange={(e) => setFormData({...formData, province: e.target.value, district: '', address: ''})}
                              className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:border-black focus:bg-white focus:outline-none transition-all appearance-none shadow-sm"
                              disabled={!formData.department}
                            >
                              <option value="">PROVINCIA</option>
                              {PERU_LOCATIONS.find(r => r.name === formData.department)?.provinces.map(p => (
                                <option key={p.id} value={p.name}>{p.name}</option>
                              ))}
                            </select>
                            <select 
                              value={formData.district}
                              onChange={(e) => setFormData({...formData, district: e.target.value})}
                              className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:border-black focus:bg-white focus:outline-none transition-all appearance-none shadow-sm"
                              disabled={!formData.province}
                            >
                              <option value="">DISTRITO</option>
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
      {/* Share Modal */}
      <AnimatePresence>
        {shareProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onClick={() => setShareProduct(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShareProduct(null)}
                className="absolute right-6 top-6 z-10 rounded-full bg-slate-100 p-2 text-slate-500 hover:text-black transition-all"
              >
                <X size={18} />
              </button>

              <div className="text-center mb-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-black">
                  <Share2 size={32} />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tighter">Compartir Producto</h2>
                <p className="mt-2 text-xs font-medium text-slate-400 uppercase tracking-widest">{shareProduct.name}</p>
              </div>

              <div className="grid gap-3">
                <button 
                  onClick={() => shareOnWhatsApp(shareProduct)}
                  className="flex w-full items-center justify-between rounded-2xl bg-emerald-50 p-4 text-emerald-600 transition-all hover:bg-emerald-100"
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp</span>
                  </div>
                  <ChevronRight size={16} />
                </button>

                <button 
                  onClick={() => shareOnFacebook(shareProduct)}
                  className="flex w-full items-center justify-between rounded-2xl bg-blue-50 p-4 text-blue-600 transition-all hover:bg-blue-100"
                >
                  <div className="flex items-center gap-3">
                    <Facebook size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Facebook</span>
                  </div>
                  <ChevronRight size={16} />
                </button>

                <button 
                  onClick={() => handleCopyLink(shareProduct)}
                  className="flex w-full items-center justify-between rounded-2xl bg-slate-50 p-4 text-slate-600 transition-all hover:bg-slate-100"
                >
                  <div className="flex items-center gap-3">
                    {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {copied ? '¡Copiado!' : 'Copiar Enlace'}
                    </span>
                  </div>
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
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

