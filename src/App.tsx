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
  Package,
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

  const introSlides = [
    {
      id: 1,
      title_left: "Glicinato de MAGNESIO",
      title_right: "RELAJACIÓN Y CALIDAD DEL SUEÑO",
      description: "Es un suplemento altamente absorbible que combina magnesio con el aminoácido glicina",
      price: 139.90,
      old_price: 159.90,
      image_url: "https://picsum.photos/seed/magnesio/800/800",
      bg_color: "bg-emerald-600"
    },
    {
      id: 2,
      title_left: "Omega-3 Premium",
      title_right: "SALUD CARDIOVASCULAR",
      description: "Grasas esenciales de alta pureza para fortalecer tu corazón y cerebro.",
      price: 192.00,
      old_price: 240.00,
      image_url: "https://picsum.photos/seed/omega/800/800",
      bg_color: "bg-emerald-800"
    }
  ];

  const categoriesGrid = [
    { name: "TODOS", image: "https://picsum.photos/seed/todos/600/800" },
    { name: "NUTRACÉUTICOS", image: "https://picsum.photos/seed/nutra/600/800" },
    { name: "ACEITES", image: "https://picsum.photos/seed/aceites/600/800" },
    { name: "OFERTAS", image: "https://picsum.photos/seed/ofertas/600/800" }
  ];

  async function fetchDynamicData() {
    setIsLoadingData(true);
    const { data: pData } = await supabase.from('products').select('*');
    const { data: sData } = await supabase.from('slides').select('*').order('order_index', { ascending: true });
    const { data: oData } = await supabase.from('offers').select('*').eq('is_active', true).eq('show_in_popup', true).limit(2);
    const { data: tData } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    const { data: settingsData } = await supabase.from('settings').select('*').eq('key', 'company_info').single();
    
    if (pData && pData.length > 0) setDynamicProducts(pData);
    else setDynamicProducts(PRODUCTS); 

    if (sData && sData.length > 0) setDynamicSlides(sData);
    else setDynamicSlides([]); 

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
  
  const categories = ['Todos', 'Nutracéuticos', 'Aceites', 'Ofertas'];

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
    const timer = setTimeout(() => {
      if (popupOffers.length > 0 || settings?.promo_enabled) {
        setIsPromoOpen(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [popupOffers, settings]);

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
      <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white py-4 border-b border-slate-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex flex-col leading-none">
              <span className="text-xl font-display font-black tracking-tighter flex items-center gap-1 text-black">
                FORTISOL<span className="text-[9px] align-top">®</span>
              </span>
              <span className="text-[7px] font-display font-bold tracking-[0.2em] uppercase text-slate-400">
                Salud para toda la vida
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            {[
              { label: 'INICIO', href: '#inicio' },
              { label: 'PRODUCTOS', href: '#productos' },
              { label: 'TESTIMONIOS', href: '#testimonios' }
            ].map((item) => (
              <a 
                key={item.label}
                href={item.href} 
                className="group relative text-[10px] font-display font-bold uppercase tracking-[0.2em] text-black/60 hover:text-black transition-colors"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 transition-all hover:scale-110 text-black"
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
              className="hidden items-center gap-2 rounded-full px-6 py-2.5 text-[10px] font-black transition-all uppercase tracking-widest md:flex bg-black text-white hover:bg-slate-900 shadow-sm hover:scale-105 active:scale-95"
            >
              <MessageCircle size={14} />
              CONTACTAR
            </button>
            {/* Mobile Menu Toggle */}
            <button className="md:hidden text-black" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
                <span className="text-xl font-display font-black tracking-tighter uppercase">FORTISOL</span>
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
                    className="text-2xl font-display font-black uppercase tracking-tight text-black hover:text-slate-500 transition-colors"
                  >
                    {item.label}
                  </motion.a>
                ))}
              </nav>

              <div className="mt-auto space-y-8">
                <button 
                  onClick={() => { handleWhatsAppOrder(); setIsMenuOpen(false); }}
                  className="flex w-full items-center justify-center gap-3 rounded-full bg-emerald-600 py-5 text-xs font-display font-black text-white shadow-xl shadow-emerald-200 uppercase tracking-widest"
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
      <div className="pt-24 bg-white relative overflow-hidden">
        <div className="relative h-[500px] md:h-[600px] w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIntroSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center overflow-hidden"
            >
              {/* Full Background Image */}
              <img
                src={activeSlides[currentIntroSlide]?.image_url || "https://picsum.photos/seed/magnesio/800/800"}
                alt="Product Slide"
                className="absolute inset-0 h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Dark Overlay for Premium Look */}
              <div className="absolute inset-0 bg-black/40" />

              {/* Navigation Arrows */}
              <button 
                onClick={() => setCurrentIntroSlide(prev => (prev - 1 + activeSlides.length) % activeSlides.length)}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-20"
              >
                <ChevronLeft size={48} strokeWidth={1} />
              </button>
              <button 
                onClick={() => setCurrentIntroSlide(prev => (prev + 1) % activeSlides.length)}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-20"
              >
                <ChevronRight size={48} strokeWidth={1} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {activeSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIntroSlide(i)}
                    className={`h-2 w-2 rounded-full transition-all ${currentIntroSlide === i ? 'bg-white w-8' : 'bg-white/30'}`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Promos Bar (Organa Style) */}
      {settings?.promo_enabled && (
        <div className="bg-black py-6 overflow-hidden border-y border-white/10 relative flex items-center">
          <div className="flex whitespace-nowrap animate-marquee items-center">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-12 mx-12">
                <div className="flex items-center gap-4 text-white">
                  <Zap size={20} className="text-yellow-400 fill-yellow-400 animate-pulse" />
                  <h3 className="text-3xl font-display font-black uppercase tracking-tighter italic">{settings?.promo_title || 'OFERTAS ESPECIALES'}</h3>
                  <div className="h-2 w-2 rounded-full bg-white/20" />
                </div>
                <p className="text-[11px] font-display font-black text-white/60 uppercase tracking-[0.3em]">
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

      {/* Features Section (Flora y Fauna Style) */}
      <section className="bg-slate-50 py-16 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: 'Envíos a Todo el Perú', desc: 'Rápido y seguro a tu puerta.' },
              { icon: ShieldCheck, title: 'Calidad Garantizada', desc: 'Productos 100% naturales.' },
              { icon: CheckCircle2, title: 'Pago Seguro', desc: 'Múltiples métodos de pago.' }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black shadow-sm transition-all group-hover:bg-black group-hover:text-white">
                  <feature.icon size={20} />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-black">{feature.title}</h3>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid (Organa Style) */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoriesGrid.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative aspect-[3/4] rounded-[2rem] overflow-hidden group cursor-pointer"
                onClick={() => {
                  setSelectedCategory(cat.name === "TODOS" ? "Todos" : cat.name.charAt(0).toUpperCase() + cat.name.slice(1).toLowerCase());
                  document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[80%]">
                  <button className="w-full bg-white/90 backdrop-blur-md text-black py-4 rounded-full text-xs font-black uppercase tracking-widest shadow-xl hover:bg-white transition-colors">
                    {cat.name}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content (Flora y Fauna Style) */}
      <section id="productos" className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar Filters (Desktop) - Hidden as requested */}
            <aside className="hidden">
              <div className="sticky top-32">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-black mb-8 border-b border-slate-100 pb-4">
                  Categorías
                </h3>
                <div className="flex flex-col gap-4">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`text-left text-xs font-bold uppercase tracking-widest transition-all hover:translate-x-2 ${
                        selectedCategory === category ? 'text-emerald-600' : 'text-slate-400 hover:text-black'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="mt-16 p-8 rounded-3xl bg-slate-50 border border-slate-100">
                  <Leaf className="text-emerald-600 mb-4" size={24} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-black mb-2">100% Natural</h4>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                    Todos nuestros productos son seleccionados cuidadosamente para garantizar la máxima pureza.
                  </p>
                </div>
              </div>
            </aside>

            {/* Product Grid & Sorting */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex flex-col">
                    <h2 className="text-2xl font-display font-black text-black uppercase tracking-tighter">
                      {selectedCategory === 'Todos' ? 'Nuestros Productos' : selectedCategory}
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {isLoadingData ? 'Cargando...' : `Mostrando ${filteredProducts.length} resultados`}
                    </p>
                  </div>

                  {/* Mobile Category Toggle */}
                  <div className="lg:hidden">
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-widest focus:outline-none"
                    >
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {isLoadingData ? (
                  <div className="flex flex-col items-center justify-center py-32 text-slate-300">
                    <Loader2 className="animate-spin mb-4" size={48} />
                    <p className="text-[10px] font-black uppercase tracking-widest">Cargando productos...</p>
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                    {filteredProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="group flex flex-col"
                      >
                        {/* Image Container */}
                        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-slate-100 mb-4">
                          <img
                            src={product.image_url || product.image}
                            alt={product.name}
                            className="h-full w-full object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                          
                          {/* Floating Actions */}
                          <div className="absolute right-4 top-4 flex flex-col gap-2 translate-x-12 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(product.id);
                              }}
                              className={`flex h-10 w-10 items-center justify-center rounded-full shadow-xl transition-all hover:scale-110 ${wishlist.includes(product.id) ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                            >
                              <Heart size={18} fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setShareProduct(product);
                              }}
                              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-xl transition-all hover:scale-110"
                            >
                              <Share2 size={18} />
                            </button>
                          </div>

                          {/* Quick View Button */}
                          <button 
                            onClick={() => setSelectedProduct(product)}
                            className="absolute bottom-4 left-4 right-4 translate-y-12 rounded-2xl bg-black/80 py-4 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md transition-all duration-300 group-hover:translate-y-0"
                          >
                            Vista Rápida
                          </button>

                          {/* Tag */}
                          {product.tag && (
                            <div className="absolute left-6 top-6 bg-black px-4 py-1.5 text-[8px] font-black uppercase tracking-[0.2em] text-white rounded-full">
                              {product.tag}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Fortisol Perú</span>
                          <h3 className="text-sm font-display font-black text-black uppercase tracking-tight mb-2 group-hover:text-emerald-600 transition-colors">
                            {product.name}
                          </h3>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex flex-col">
                              <span className="text-lg font-display font-black text-black">
                                S/ {product.price.toFixed(2)}
                              </span>
                              {product.old_price && (
                                <span className="text-xs text-slate-300 line-through font-bold">
                                  S/ {product.old_price.toFixed(2)}
                                </span>
                              )}
                            </div>
                            
                            <button 
                              onClick={() => addToCart(product)}
                              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-black transition-all hover:bg-emerald-600 hover:text-white hover:scale-110 active:scale-95"
                            >
                              <Plus size={20} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-32 text-slate-300 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                    <Package size={48} strokeWidth={1} className="mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No se encontraron productos</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-2">Intenta con otra categoría o vuelve más tarde.</p>
                  </div>
                )}
              </div>
          </div>
        </div>
      </section>

      {/* Testimonials (TikTok Style) */}
      <section id="testimonios" className="bg-white py-20 overflow-hidden">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="text-center md:text-left">
              <h2 className="mb-2 text-3xl font-display font-black text-black uppercase tracking-tighter">Testimonios Reales</h2>
              <p className="text-base text-slate-500 font-display font-medium">Mira cómo Fortisol está cambiando vidas en todo el Perú.</p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <div className="flex text-black">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <span className="text-xs font-display font-black text-black uppercase tracking-widest">4.9/5 Calificación</span>
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
                        <h4 className="text-base font-display font-black leading-none tracking-tight drop-shadow-md">{t.name}</h4>
                        <p className="text-[9px] font-display font-black text-white/80 uppercase tracking-[0.2em] mt-1.5 drop-shadow-md">{t.location}</p>
                      </div>
                    </div>
                    <p className="line-clamp-2 text-xs font-display font-bold leading-relaxed text-white/90 italic drop-shadow-md">"{t.text}"</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="bg-slate-50 py-12">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 rounded-full bg-white p-6 shadow-lg">
              <ShieldCheck size={48} className="text-black" />
            </div>
            <h2 className="mb-3 text-2xl font-display font-black text-black md:text-4xl uppercase tracking-tighter">Garantía de Satisfacción</h2>
            <p className="mx-auto max-w-2xl text-base text-slate-500 font-medium leading-relaxed">
              En Fortisol Perú, nos comprometemos con tu bienestar. Si no estás satisfecho con los resultados, te brindamos asesoría personalizada gratuita para ajustar tu tratamiento.
            </p>
            <div className="mt-4 flex items-center justify-center gap-4 text-[10px] font-display font-black uppercase tracking-[0.3em] text-slate-400">
              <span>100% Natural</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>Calidad Premium</span>
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


      {/* CTA Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto max-w-6xl px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[2rem] bg-black px-6 py-12 text-center text-white md:px-12"
          >
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            
            <div className="relative z-10 mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-display font-black uppercase tracking-[0.2em] text-white backdrop-blur-md">
              <Sparkles size={12} />
              Tratamiento Natural #1 del Perú
            </div>

            <h2 className="relative z-10 mb-4 text-3xl font-display font-black md:text-5xl uppercase tracking-tighter leading-[0.9] text-white">
              Tu bienestar <br className="hidden md:block" /> no puede esperar
            </h2>
            <p className="relative z-10 mb-8 mx-auto max-w-xl text-base text-white/70 font-medium leading-relaxed">
              Únete a miles de peruanos que ya recuperaron su movilidad y energía con Fortisol. 
              Resultados garantizados desde las primeras semanas de tratamiento.
            </p>
            
            <button 
              onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative z-10 flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-display font-black text-black shadow-xl transition-all hover:scale-105 active:scale-95 mx-auto uppercase tracking-widest"
            >
              VER TRATAMIENTOS AHORA
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white transition-transform group-hover:translate-x-1">
                <Sparkles size={14} />
              </div>
            </button>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-50 grayscale">
              <div className="flex items-center gap-2">
                <Check size={16} />
                <span className="text-[10px] font-display font-black uppercase tracking-widest">Garantía de Calidad</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} />
                <span className="text-[10px] font-display font-black uppercase tracking-widest">Envío a todo el Perú</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} />
                <span className="text-[10px] font-display font-black uppercase tracking-widest">Fórmula 100% Natural</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer (Flora y Fauna Style) */}
      <footer className="bg-black py-8 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Logo & Description */}
            <div className="flex flex-col">
              <div className="flex flex-col mb-6">
                <span className="text-2xl font-display font-black tracking-tighter flex items-center gap-1">
                  FORTISOL<span className="text-[8px] align-top">®</span>
                </span>
                <span className="text-[7px] font-display font-bold tracking-[0.3em] text-white/40 uppercase mt-1">
                  Salud para toda la vida
                </span>
              </div>
              <p className="text-xs text-white/60 font-medium leading-relaxed max-w-sm mb-6">
                Líderes en fórmulas nutracéuticas y aceites esenciales en Perú. Comprometidos con tu salud y bienestar natural desde hace más de 10 años.
              </p>
              <div className="flex gap-4">
                {(!settings || settings.show_instagram) && (
                  <a href={settings?.instagram || SOCIAL_INSTAGRAM} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                    <Instagram size={18} />
                  </a>
                )}
                {(!settings || settings.show_facebook) && (
                  <a href={settings?.facebook || SOCIAL_FACEBOOK} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                    <Facebook size={18} />
                  </a>
                )}
                {(!settings || settings.show_tiktok) && (
                  <a href={settings?.tiktok || SOCIAL_TIKTOK} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                    <MessageCircle size={18} />
                  </a>
                )}
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-col justify-start">
              <ul className="space-y-3 text-[11px] font-bold uppercase tracking-widest text-white/60">
                <li><a href="#inicio" className="hover:text-white transition-colors">Inicio</a></li>
                <li><a href="#productos" className="hover:text-white transition-colors">Productos</a></li>
                <li><a href="#testimonios" className="hover:text-white transition-colors">Testimonios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="flex flex-col justify-start">
              <ul className="space-y-3 text-[11px] font-bold uppercase tracking-widest text-white/60">
                <li className="flex items-center gap-2">
                  <Phone size={14} />
                  <span>{settings?.phone || '+51 976 791 234'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle size={14} />
                  <a href={`https://wa.me/${settings?.whatsapp || CONTACT_PHONE}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
                </li>
              </ul>
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
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-orange-500 rounded-[2rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)] z-10"
            >
              <button 
                onClick={() => setIsPromoOpen(false)}
                className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-xl hover:scale-110 transition-transform"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col md:flex-row h-full">
                {/* Left Content */}
                <div className="flex-1 p-8 md:p-10 flex flex-col justify-center text-white">
                  <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter leading-[0.8] mb-6">
                    COLÁGENO + <br /> MAGNESIO
                  </h2>
                  
                  <div className="border-2 border-white/30 rounded-2xl p-4 mb-6">
                    <h3 className="text-xl font-display font-black uppercase tracking-tight mb-2">Ana Maria LaJusticia</h3>
                    <p className="text-white/80 font-medium">Colágeno con Magnesio x180comp</p>
                  </div>

                  <div className="bg-white rounded-3xl p-6 text-emerald-600 inline-flex flex-col items-start shadow-xl relative overflow-hidden group">
                    <span className="text-[10px] font-black uppercase tracking-widest mb-1 text-emerald-600/60">PRECIO</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black">S/.</span>
                      <span className="text-5xl font-black">78</span>
                      <span className="text-xl font-black">.30</span>
                    </div>
                    <p className="text-[10px] font-bold text-emerald-600/40 mt-2 line-through">Precio regular: S/ 87.00</p>
                  </div>
                </div>

                {/* Right Image */}
                <div className="flex-1 bg-emerald-700 relative flex items-center justify-center p-12">
                  <div className="absolute top-12 right-12 bg-red-600 text-white h-24 w-24 rounded-full flex flex-col items-center justify-center shadow-2xl animate-bounce">
                    <span className="text-3xl font-black">10%</span>
                    <span className="text-[10px] font-black uppercase tracking-tighter">dsct.</span>
                  </div>
                  <img 
                    src="https://picsum.photos/seed/colageno/600/800" 
                    alt="Promo Product" 
                    className="h-full w-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="bg-emerald-900/50 py-3 px-8 text-center">
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                  Promoción válida hasta el 30 de Abril y/o hasta agotar stock.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal (Flora y Fauna Style) */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl my-auto"
            >
              <button 
                onClick={() => {
                  setSelectedProduct(null);
                  setSelectedVariant(null);
                  setModalQuantity(1);
                  setActiveImageIndex(0);
                }}
                className="absolute right-6 top-6 z-20 rounded-full bg-slate-100 p-2 text-black transition-all hover:bg-black hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto no-scrollbar">
                {/* Left: Image */}
                <div className="bg-slate-50 p-8 md:p-12 flex items-center justify-center min-h-[300px] md:min-h-0">
                  <img 
                    src={(selectedProduct as any).images?.[activeImageIndex] || (selectedProduct as any).image_url || (selectedProduct as any).image} 
                    alt={selectedProduct.name} 
                    className="max-h-full max-w-full object-contain drop-shadow-xl"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Right: Info */}
                <div className="p-8 md:p-12 flex flex-col">
                  <div className="mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2 block">
                      {selectedProduct.category || 'Fortisol Natural'}
                    </span>
                    <h2 className="text-2xl md:text-4xl font-black text-black tracking-tighter uppercase leading-tight">
                      {selectedProduct.name}
                    </h2>
                  </div>

                  <div className="mb-6 flex items-baseline gap-3">
                    <p className="text-3xl font-black text-black tracking-tighter">
                      S/ {selectedVariant ? selectedVariant.price : selectedProduct.price}
                    </p>
                    {(selectedVariant?.originalPrice || (!selectedVariant && selectedProduct.originalPrice)) && (
                      <p className="text-xl font-bold text-slate-300 line-through tracking-tighter">
                        S/ {selectedVariant ? selectedVariant.originalPrice : selectedProduct.originalPrice}
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 whitespace-pre-line">
                    {selectedProduct.description || "Fórmula natural premium diseñada para mejorar tu calidad de vida y bienestar general."}
                  </p>

                  {/* Variants */}
                  {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 text-black">Presentación:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.variants.map((variant) => (
                          <button
                            key={variant.id}
                            onClick={() => setSelectedVariant(variant)}
                            className={`rounded-xl border-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                              selectedVariant?.id === variant.id
                                ? 'border-black bg-black text-white'
                                : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                            }`}
                          >
                            {variant.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity & Add to Cart */}
                  <div className="mt-auto pt-8 border-t border-slate-100 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center rounded-xl border-2 border-slate-100 p-1">
                        <button 
                          onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                          className="p-2 text-slate-400 hover:text-black transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center text-sm font-black text-black">{modalQuantity}</span>
                        <button 
                          onClick={() => setModalQuantity(modalQuantity + 1)}
                          className="p-2 text-slate-400 hover:text-black transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button 
                        onClick={() => {
                          const productToAdd = selectedVariant 
                            ? { ...selectedProduct, id: `${selectedProduct.id}-${selectedVariant.id}`, name: `${selectedProduct.name} (${selectedVariant.name})`, price: selectedVariant.price }
                            : selectedProduct;
                          
                          for(let i = 0; i < modalQuantity; i++) {
                            addToCart(productToAdd);
                          }
                          setSelectedProduct(null);
                        }}
                        className="flex-1 rounded-xl bg-black py-4 text-[11px] font-black text-white uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-slate-800 transition-all"
                      >
                        Añadir al carrito
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Chat Drawer (Flora y Fauna Style) */}
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
              className="fixed bottom-0 right-0 top-0 z-[120] flex h-full w-full max-w-[400px] flex-col bg-white shadow-2xl md:h-[calc(100%-2rem)] md:top-4 md:right-4 md:rounded-3xl md:bottom-4"
            >
              {/* Chat Header */}
              <div className="relative overflow-hidden rounded-t-3xl bg-black p-6 text-white md:p-8">
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                        <Sun size={24} className="text-white" />
                      </div>
                      <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-black bg-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black uppercase tracking-widest">Sol</h2>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-medium text-white/60">Asistente Virtual</span>
                        <span className="h-1 w-1 rounded-full bg-emerald-400" />
                        <span className="text-[10px] font-medium text-white/60">En línea</span>
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
                    <div className={`relative max-w-[85%] rounded-2xl px-5 py-3 text-xs font-medium shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-black text-white rounded-tr-none' 
                        : 'bg-white text-black border border-slate-100 rounded-tl-none'
                    }`}>
                      {msg.text}
                      <span className={`absolute top-0 text-[8px] font-black opacity-30 ${msg.role === 'user' ? '-left-8' : '-right-8'}`}>
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
                    <div className="bg-white text-slate-400 border border-slate-100 rounded-2xl rounded-tl-none px-6 py-4 shadow-sm flex gap-1">
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="h-1.5 w-1.5 rounded-full bg-black" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="h-1.5 w-1.5 rounded-full bg-black" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="h-1.5 w-1.5 rounded-full bg-black" />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Chat Input Area */}
              <div className="bg-white p-6 md:p-8 space-y-6 rounded-b-3xl">
                {chatMessages.length <= 1 && (
                  <div className="flex flex-wrap gap-2">
                    {predefinedQuestions.map((q, idx) => (
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="text-left rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 text-[9px] font-black uppercase tracking-wider text-slate-500 hover:border-black hover:text-black hover:bg-slate-50 transition-all"
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
                    className="w-full rounded-xl border border-slate-100 bg-slate-50 pl-6 pr-14 py-4 text-xs font-medium focus:border-black focus:bg-white focus:outline-none transition-all"
                  />
                  <button 
                    onClick={() => handleSendMessage(chatInput)}
                    disabled={!chatInput.trim() || isChatLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-black p-2.5 text-white hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg"
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
              className="fixed bottom-0 right-0 top-0 z-[120] flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 p-6">
                <div className="flex items-center gap-4">
                  {checkoutStep === 2 && (
                    <button onClick={() => setCheckoutStep(1)} className="text-slate-400 hover:text-black transition-colors">
                      <ArrowLeft size={18} />
                    </button>
                  )}
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-black">
                    {checkoutStep === 1 ? 'Tu Carrito' : 'Finalizar Pedido'}
                  </h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-black transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
                {checkoutStep === 1 && cart.length > 0 && (
                  <div className="mb-8 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Truck size={14} className={cartTotal >= 200 ? 'text-emerald-600' : 'text-slate-400'} />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-black">
                          {cartTotal >= 200 ? '¡Envío Gratis!' : 'Envío a todo el Perú'}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (cartTotal / 200) * 100)}%` }}
                        className={`h-full transition-all duration-1000 ${cartTotal >= 200 ? 'bg-emerald-500' : 'bg-black'}`}
                      />
                    </div>
                    {cartTotal < 200 && (
                      <p className="mt-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest text-center">Faltan S/ {200 - cartTotal} para envío gratis</p>
                    )}
                  </div>
                )}
                
                {checkoutStep === 1 ? (
                  cart.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <ShoppingCart size={48} className="text-slate-100 mb-4" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-black mb-2">Tu carrito está vacío</h3>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        className="mt-6 rounded-full border-2 border-black px-8 py-3 text-[10px] font-black text-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                      >
                        Seguir comprando
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {cart.map((item) => (
                        <div key={`${item.product.id}-${item.selectedVariant?.id || ''}`} className="flex gap-4 group">
                          <div className="h-20 w-20 overflow-hidden rounded-xl bg-slate-50 shrink-0 border border-slate-100">
                            <img src={item.product.image} alt={item.product.name} className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex flex-1 flex-col justify-center">
                            <div className="flex items-start justify-between mb-1">
                              <div>
                                <h4 className="text-[11px] font-black text-black uppercase tracking-tighter leading-tight">{item.product.name}</h4>
                                {item.selectedVariant && (
                                  <p className="mt-0.5 text-[8px] font-bold text-slate-400 uppercase tracking-widest">{item.selectedVariant.name}</p>
                                )}
                              </div>
                              <button onClick={() => removeFromCart(item.product.id, item.selectedVariant?.id)} className="text-slate-300 hover:text-black transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-4 rounded-lg border border-slate-100 px-3 py-1">
                                <button onClick={() => updateQuantity(item.product.id, -1, item.selectedVariant?.id)} className="text-slate-400 hover:text-black transition-colors"><Minus size={10} /></button>
                                <span className="text-[10px] font-black w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.product.id, 1, item.selectedVariant?.id)} className="text-slate-400 hover:text-black transition-colors"><Plus size={10} /></button>
                              </div>
                              <p className="text-[11px] font-black text-black tracking-tighter">
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
                    {/* Checkout Form */}
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-black border-b border-slate-100 pb-2">Datos de Envío</h3>
                        <div className="grid grid-cols-1 gap-4">
                          <input 
                            type="text" 
                            placeholder="NOMBRE COMPLETO" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full rounded-xl border-2 border-slate-50 bg-slate-50 px-4 py-3 text-[10px] font-bold uppercase tracking-widest focus:border-black focus:bg-white focus:outline-none transition-all"
                          />
                          <input 
                            type="tel" 
                            placeholder="TELÉFONO / WHATSAPP" 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full rounded-xl border-2 border-slate-50 bg-slate-50 px-4 py-3 text-[10px] font-bold uppercase tracking-widest focus:border-black focus:bg-white focus:outline-none transition-all"
                          />
                          <input 
                            type="text" 
                            placeholder="DIRECCIÓN DE ENTREGA" 
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            className="w-full rounded-xl border-2 border-slate-50 bg-slate-50 px-4 py-3 text-[10px] font-bold uppercase tracking-widest focus:border-black focus:bg-white focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-black border-b border-slate-100 pb-2">Ubicación</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <select 
                            value={formData.department}
                            onChange={(e) => setFormData({...formData, department: e.target.value, province: '', district: '', address: ''})}
                            className="w-full rounded-xl border-2 border-slate-50 bg-slate-50 px-4 py-3 text-[10px] font-bold uppercase tracking-widest focus:border-black focus:bg-white focus:outline-none transition-all"
                          >
                            <option value="">DEPARTAMENTO</option>
                            {PERU_LOCATIONS.map(r => (
                              <option key={r.id} value={r.name}>{r.name}</option>
                            ))}
                          </select>
                          <select 
                            value={formData.province}
                            onChange={(e) => setFormData({...formData, province: e.target.value, district: '', address: ''})}
                            className="w-full rounded-xl border-2 border-slate-50 bg-slate-50 px-4 py-3 text-[10px] font-bold uppercase tracking-widest focus:border-black focus:bg-white focus:outline-none transition-all"
                            disabled={!formData.department}
                          >
                            <option value="">PROVINCIA</option>
                            {PERU_LOCATIONS.find(r => r.name === formData.department)?.provinces.map(p => (
                              <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span>Subtotal</span>
                    <span>S/ {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span>Envío</span>
                    <span>{cartTotal >= 200 ? 'GRATIS' : 'S/ 10.00'}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black uppercase tracking-widest text-black pt-2">
                    <span>Total</span>
                    <span>S/ {(cartTotal + (cartTotal >= 200 ? 0 : 10)).toFixed(2)}</span>
                  </div>
                </div>

                {checkoutStep === 1 ? (
                  <button 
                    disabled={cart.length === 0}
                    onClick={() => setCheckoutStep(2)}
                    className="w-full rounded-xl bg-black py-4 text-[11px] font-black text-white uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-slate-800 transition-all disabled:opacity-30"
                  >
                    Continuar Pedido
                  </button>
                ) : (
                  <button 
                    onClick={handleWhatsAppOrder}
                    className="w-full rounded-xl bg-emerald-600 py-4 text-[11px] font-black text-white uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} />
                    Pedir por WhatsApp
                  </button>
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
          null
        )}
      </AnimatePresence>
    </div>
  );
}

