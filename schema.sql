-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT,
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  usage TEXT,
  nutritional_info JSONB DEFAULT '{}'::jsonb,
  details JSONB DEFAULT '{}'::jsonb,
  stock INTEGER DEFAULT 0,
  is_combo BOOLEAN DEFAULT false,
  combo_product_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Slides Table (Home Carousel)
CREATE TABLE IF NOT EXISTS slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  button_text TEXT DEFAULT 'Comprar Ahora',
  button_link TEXT DEFAULT '#productos',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table (CRM)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  department TEXT,
  province TEXT,
  district TEXT,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  items JSONB NOT NULL,
  payment_method TEXT,
  payment_proof_url TEXT,
  shipping_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings Table (Company Info & Social Media)
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Offers Table
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  product_id UUID REFERENCES products(id),
  combo_product_ids UUID[] DEFAULT '{}',
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  show_in_popup BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT,
  text TEXT NOT NULL,
  avatar TEXT,
  video_url TEXT,
  thumbnail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable Row Level Security (RLS) for tables that use custom frontend authentication
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE slides DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE offers DISABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;

-- 7. Configurar Almacenamiento (Storage)
-- Crear bucket 'fortisol-assets' manualmente en el panel de Supabase o vía SQL:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('fortisol-assets', 'fortisol-assets', true);

-- Políticas de Storage: Lectura pública, Subida para autenticados
-- Nota: Estas políticas deben ejecutarse en el esquema 'storage'
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'fortisol-assets');
-- CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'fortisol-assets' AND auth.role() = 'authenticated');
-- CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING (bucket_id = 'fortisol-assets' AND auth.role() = 'authenticated');
-- CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'fortisol-assets' AND auth.role() = 'authenticated');
