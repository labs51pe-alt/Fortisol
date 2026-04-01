import { Product, Testimonial } from './types';

export const CONTACT_PHONE = "51976791234";
export const BRAND_NAME = "Fortisol Perú";
export const SOCIAL_INSTAGRAM = "https://www.instagram.com/fortisolperu";
export const SOCIAL_FACEBOOK = "https://www.facebook.com/fortisolperu";
export const SOCIAL_TIKTOK = "https://www.tiktok.com/@fortisolperu";
export const COMPANY_EMAIL = "contacto@fortisolperu.com";
export const COMPANY_ADDRESS = "";

export const PRODUCTS: Product[] = [
  {
    id: "omega-3-premium",
    name: "Omega-3 Premium",
    description: "Grasas esenciales de alta pureza. Ayuda a reducir la inflamación, bajar los triglicéridos y fortalecer las membranas celulares.",
    price: 192,
    originalPrice: 240,
    image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80&w=600",
    category: "Nutracéuticos",
    brand: "Fortisol",
    sku: "7759283000216",
    rating: 4.9,
    reviewsCount: 124,
    tag: "Nuevo",
    benefits: [
      "Salud cardiovascular ❤️",
      "Función cerebral óptima 🧠",
      "Reduce inflamación articular 🦴",
      "Fortalece el sistema inmune 🛡️"
    ],
    usage: "01 cápsula blanda con el desayuno y 01 con la cena.",
    ingredients: ["Aceite de Pescado", "EPA", "DHA", "Vitamina E"]
  },
  {
    id: "flexanil-ultra-forte",
    name: "Flexanil Ultra Forte",
    description: "Fórmula nutracéutica eficaz contra dolores, molestias articulares y óseas causadas por enfermedades degenerativas.",
    price: 85,
    originalPrice: 110,
    image: "https://picsum.photos/seed/flexanil/600/600",
    category: "Nutracéuticos",
    brand: "Fortisol",
    sku: "7759283000217",
    rating: 4.8,
    reviewsCount: 89,
    tag: "Más Vendido",
    benefits: [
      "Trata artrosis, artritis y reuma 🦴",
      "Fortalece articulaciones y huesos 💪",
      "Reduce la inflamación y el dolor 🔥",
      "Restaura la movilidad articular 🏃‍♂️"
    ],
    usage: "01 a 02 sachets al día, la primera 30 minutos después del desayuno, la segunda 30 minutos antes de la cena.",
    ingredients: ["Graviola", "Colágeno Hidrolizado", "Vitaminas", "Minerales"]
  },
  {
    id: "fortisol-fit",
    name: "Fortisol Fit",
    description: "Suplemento termogénico diseñado para apoyar la quema de grasa y mejorar el rendimiento físico.",
    price: 80,
    originalPrice: 100,
    image: "https://picsum.photos/seed/fit/600/600",
    category: "Nutracéuticos",
    brand: "Fortisol",
    sku: "7759283000218",
    rating: 4.7,
    reviewsCount: 56,
    benefits: [
      "Estimula y regula el apetito 🍽️",
      "Favorece la pérdida de peso 🔥",
      "Mejora el tránsito intestinal 🍏",
      "Aumenta los niveles de energía ⚡"
    ],
    usage: "01 a 02 sachets al día, la primera 30 minutos después del desayuno, la segunda 30 minutos antes de la cena.",
    ingredients: ["Moringa", "Espirulina", "Té Verde", "Chía", "Ciruela", "Piña"]
  },
  {
    id: "bio-alcalin",
    name: "Bio Alcalin",
    description: "Formulación esencial para el cuerpo involucrado en más de 300 reacciones bioquímicas. Mejora el sueño y reduce el estrés.",
    price: 75,
    originalPrice: 95,
    image: "https://picsum.photos/seed/alcalin/600/600",
    category: "Nutracéuticos",
    brand: "Fortisol",
    sku: "7759283000219",
    rating: 4.9,
    reviewsCount: 210,
    benefits: [
      "Regula el tránsito intestinal 🍏",
      "Desintoxica el organismo 🌿",
      "Reduce el estrés y mejora el sueño 😴",
      "Protege la salud cardiovascular ❤️"
    ],
    usage: "Disolver el contenido del sachet en un vaso con agua o en jugos y zumos de frutas.",
    ingredients: ["Camu Camu", "Magnesio", "Vitamina C"]
  },
  {
    id: "gast-tryn-herbal",
    name: "Gast-Tryn Herbal Maxxx",
    description: "Fórmula nutracéutica que contribuye al bienestar general de los problemas gástricos y eliminación de bacterias.",
    price: 80,
    originalPrice: 105,
    image: "https://picsum.photos/seed/gasttryn/600/600",
    category: "Nutracéuticos",
    brand: "Fortisol",
    sku: "7759283000220",
    rating: 4.8,
    reviewsCount: 74,
    benefits: [
      "Fortalece las paredes del estómago 🛡️",
      "Ideal para gastritis estomacal 🍏",
      "Reduce el malestar y la acidez 🔥",
      "Elimina bacterias digestivas 🦠"
    ],
    usage: "Disolver el contenido del sachet en un vaso con agua 10 minutos antes del desayuno.",
    ingredients: ["Tocosh", "Sábila", "Probióticos"]
  },
  {
    id: "probioticos-50-billones",
    name: "Súper Probióticos",
    description: "Fórmula avanzada con 50 billones de cultivos vivos para una digestión perfecta y sistema inmune fuerte.",
    price: 85,
    originalPrice: 110,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600",
    category: "Nutracéuticos",
    brand: "Fortisol",
    sku: "7759283000221",
    rating: 4.9,
    reviewsCount: 156,
    tag: "Oferta",
    benefits: [
      "Mejora la digestión 🍏",
      "Fortalece el sistema inmune 🛡️",
      "Equilibra la flora intestinal 🌿",
      "Reduce la hinchazón 🎈"
    ],
    usage: "01 cápsula al día en ayunas.",
    ingredients: ["Lactobacillus", "Bifidobacterium", "Prebióticos"]
  },
  {
    id: "aceite-copaiba",
    name: "Aceite de Copaiba",
    description: "Aceite natural para todo tipo de dolor y desorden inflamatorio, problemas de piel y picaduras.",
    price: 40,
    originalPrice: 55,
    image: "https://picsum.photos/seed/copaiba/600/600",
    category: "Aceites",
    brand: "Fortisol",
    sku: "7759283000222",
    rating: 4.9,
    reviewsCount: 320,
    benefits: [
      "Alivia dolores de espalda y ciática 🦴",
      "Reduce inflamación del cuerpo 🔥",
      "Trata acné, cicatrices y estrías ✨",
      "Uso vía oral y cutánea 💧"
    ],
    usage: "Vía oral: 2-3 gotas con miel. Vía cutánea: aplicar directamente o con toalla tibia en zonas inflamadas.",
    ingredients: ["Copaiffera Officinalis 100% puro"]
  },
  {
    id: "aceite-molle",
    name: "Aceite Esencial de Molle",
    description: "Bálsamo medicinal con diversas propiedades curativas para dolores musculares, articulares e inflamación.",
    price: 50,
    originalPrice: 65,
    image: "https://picsum.photos/seed/molle/600/600",
    category: "Aceites",
    brand: "Fortisol",
    sku: "7759283000223",
    rating: 4.8,
    reviewsCount: 142,
    benefits: [
      "Alivia dolores musculares 💪",
      "Relajante muscular y calambres 🧘",
      "Trata golpes y torceduras 🩹",
      "Ideal para lesiones deportivas 🏃‍♂️"
    ],
    usage: "Aplicar en la parte afectada hasta que se absorba completamente, repetir cuando sea necesario hasta 3 veces al día.",
    ingredients: ["Schinus Molle 100% puro"]
  },
  {
    id: "combo-familiar",
    name: "Combo Familiar Salud",
    description: "Lleva 3 productos esenciales (Flexanil + Bio Alcalin + Aceite Molle) a un precio especial.",
    price: 190,
    originalPrice: 210,
    image: "https://picsum.photos/seed/combo/600/600",
    category: "Ofertas",
    brand: "Fortisol",
    sku: "7759283000224",
    rating: 5.0,
    reviewsCount: 45,
    tag: "Mejor Valor",
    benefits: [
      "Tratamiento integral 🔄",
      "Ahorro significativo 💰",
      "Salud para toda la familia 👨‍👩‍👧‍👦",
      "Envío prioritario 🚚"
    ],
    usage: "Consultar el modo de uso de cada producto individualmente.",
    ingredients: ["Variado según selección"]
  }
];

// Peru Locations Data (Simplified for the example)
export const DEPARTMENTS = [
  "Amazonas", "Áncash", "Apurímac", "Arequipa", "Ayacucho", "Cajamarca", "Callao", "Cusco", "Huancavelica", "Huánuco", "Ica", "Junín", "La Libertad", "Lambayeque", "Lima", "Loreto", "Madre de Dios", "Moquegua", "Pasco", "Piura", "Puno", "San Martín", "Tacna", "Tumbes", "Ucayali"
];

export const PROVINCES: Record<string, string[]> = {
  "Lima": ["Lima", "Barranca", "Cajatambo", "Canta", "Cañete", "Huaral", "Huarochirí", "Huaura", "Oyón", "Yauyos"],
  "Arequipa": ["Arequipa", "Camaná", "Caravelí", "Castilla", "Caylloma", "Condesuyos", "Islay", "La Unión"],
  // ... more provinces could be added here
};

export const DISTRICTS: Record<string, string[]> = {
  "Lima": ["Miraflores", "San Isidro", "Santiago de Surco", "La Molina", "San Borja", "Jesús María", "Lince", "Magdalena del Mar", "Pueblo Libre", "San Miguel", "Barranco", "Chorrillos", "San Juan de Miraflores", "Villa María del Triunfo", "Villa El Salvador", "Ate", "Santa Anita", "San Juan de Lurigancho", "El Agustino", "La Victoria", "Breña", "Cercado de Lima", "Rímac", "Comas", "Los Olivos", "Independencia", "San Martín de Porres", "Carabayllo", "Puente Piedra", "Ancón", "Santa Rosa", "Lurín", "Pachacamac", "Punta Hermosa", "Punta Negra", "San Bartolo", "Santa María del Mar", "Pucusana"],
  "Arequipa": ["Arequipa", "Alto Selva Alegre", "Cayma", "Cerro Colorado", "Jacobo Hunter", "José Luis Bustamante y Rivero", "Mariano Melgar", "Miraflores", "Paucarpata", "Sabandía", "Sachaca", "Socabaya", "Tiabaya", "Yanahuara"],
  "Cusco": ["Cusco", "San Jerónimo", "San Sebastián", "Santiago", "Wanchaq", "Saylla"],
  "La Libertad": ["Trujillo", "Huanchaco", "El Porvenir", "La Esperanza", "Laredo", "Moche", "Salaverry", "Victor Larco Herrera"],
  "Lambayeque": ["Chiclayo", "José Leonardo Ortiz", "La Victoria", "Pimentel", "Reque", "Santa Rosa"],
  "Piura": ["Piura", "Castilla", "Catacaos", "Veintiséis de Octubre"],
  "Ica": ["Ica", "Chincha Alta", "Pisco", "Nazca", "Palpa"],
  "Junín": ["Huancayo", "El Tambo", "Chilca"],
  "Ancash": ["Chimbote", "Huaraz", "Nuevo Chimbote"],
  "Puno": ["Puno", "Juliaca"],
  "Tacna": ["Tacna", "Alto de la Alianza", "Ciudad Nueva", "Gregorio Albarracín Lanchipa"],
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "María R.",
    location: "Arequipa",
    text: "Desde que uso Fortisol Ultra, mis dolores de rodilla han desaparecido. ¡Totalmente recomendado!",
    avatar: "https://i.pravatar.cc/150?u=maria",
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-stretches-on-a-mat-41190-large.mp4",
    thumbnail: "https://picsum.photos/seed/test1/400/700"
  },
  {
    id: "2",
    name: "Juan P.",
    location: "Ica",
    text: "El bálsamo es increíble, lo uso después de entrenar y el alivio es instantáneo.",
    avatar: "https://i.pravatar.cc/150?u=juan",
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-man-doing-push-ups-in-a-gym-41189-large.mp4",
    thumbnail: "https://picsum.photos/seed/test2/400/700"
  },
  {
    id: "3",
    name: "Elena G.",
    location: "Lima",
    text: "Excelente atención y los productos llegaron muy rápido a mi casa.",
    avatar: "https://i.pravatar.cc/150?u=elena",
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-woman-running-on-the-beach-at-sunset-41188-large.mp4",
    thumbnail: "https://picsum.photos/seed/test3/400/700"
  },
  {
    id: "5",
    name: "Fortisol Oficial",
    location: "TikTok",
    text: "Mira cómo aplicamos nuestros aceites esenciales para un alivio inmediato.",
    avatar: "https://i.pravatar.cc/150?u=fortisol",
    video_url: "https://www.tiktok.com/@fortisolperu/video/7621346529080511745?_r=1&_t=ZS-957pkn4w2JM",
    thumbnail: "https://picsum.photos/seed/fortisol-tk/400/700"
  }
];
