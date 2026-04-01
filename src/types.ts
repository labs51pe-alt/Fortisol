export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  brand?: string;
  sku?: string;
  rating?: number;
  reviewsCount?: number;
  tag?: string;
  benefits?: string[];
  usage?: string;
  ingredients?: string[];
  nutritional_info?: {
    servingSize: string;
    servingsPerContainer: string;
    energy: string;
  };
  is_combo?: boolean;
  combo_product_ids?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  avatar: string;
  videoUrl?: string;
  thumbnail?: string;
}

export interface Slide {
  id: string;
  image_url: string;
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
  order_index: number;
}

export interface CompanySettings {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  show_facebook: boolean;
  show_instagram: boolean;
  show_tiktok: boolean;
  show_whatsapp: boolean;
}
