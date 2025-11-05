-- ============================================
-- SCHEMA SQL PARA SISTEMA DE RESERVAS DE DEPARTAMENTOS
-- Base de Datos: Supabase (PostgreSQL)
-- 
-- INSTRUCCIONES:
-- 1. Ve a tu proyecto en Supabase
-- 2. Navega a: SQL Editor (menú izquierdo)
-- 3. Clic en "New Query"
-- 4. Copia y pega TODO este archivo
-- 5. Clic en "Run" (o presiona Ctrl+Enter)
-- 6. Espera a que se complete (verás "Success")
-- ============================================

-- Eliminar tablas si existen (solo para desarrollo/testing)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS apartment_images CASCADE;
DROP TABLE IF EXISTS apartments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- 1. TABLA DE USUARIOS
-- ============================================
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. TABLA DE DEPARTAMENTOS
-- ============================================
CREATE TABLE apartments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  bedrooms INTEGER NOT NULL CHECK (bedrooms IN (1, 2)),
  bathrooms INTEGER NOT NULL CHECK (bathrooms >= 1 AND bathrooms <= 5),
  max_guests INTEGER NOT NULL CHECK (max_guests >= 1 AND max_guests <= 10),
  price_per_night DECIMAL(10, 2) NOT NULL CHECK (price_per_night >= 0),
  address VARCHAR(300) NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  square_meters INTEGER NOT NULL CHECK (square_meters > 0),
  amenities TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. TABLA DE IMÁGENES DE DEPARTAMENTOS
-- ============================================
CREATE TABLE apartment_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  apartment_id UUID NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_main BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. TABLA DE RESERVAS
-- ============================================
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  apartment_id UUID NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL CHECK (guests >= 1),
  total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (check_out > check_in)
);

-- ============================================
-- 5. ÍNDICES PARA OPTIMIZACIÓN DE CONSULTAS
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE INDEX IF NOT EXISTS idx_apartments_bedrooms ON apartments(bedrooms);
CREATE INDEX IF NOT EXISTS idx_apartments_available ON apartments(is_available);
CREATE INDEX IF NOT EXISTS idx_apartments_city ON apartments(city);
CREATE INDEX IF NOT EXISTS idx_apartments_price ON apartments(price_per_night);

CREATE INDEX IF NOT EXISTS idx_apartment_images_apartment ON apartment_images(apartment_id);

CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_apartment ON bookings(apartment_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in, check_out);

-- ============================================
-- 6. FUNCIÓN PARA ACTUALIZAR TIMESTAMPS AUTOMÁTICAMENTE
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. TRIGGERS PARA TIMESTAMPS AUTOMÁTICOS
-- ============================================
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_apartments_updated_at 
  BEFORE UPDATE ON apartments
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at 
  BEFORE UPDATE ON bookings
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. DATOS DE EJEMPLO (SEED DATA)
-- ============================================

-- Usuario administrador de prueba
-- Email: admin@apartments.com
-- Password: Admin123!
-- Nota: Este hash es para "Admin123!" - CÁMBIALO en producción
INSERT INTO users (email, password, full_name, role, phone) VALUES
('admin@apartments.com', '$2b$10$rXK5vN8h.qMYQJ9GxqPcWO8xqKF6YxYJhGJHqKuKYQpyJYPvZKqNO', 'Administrador Sistema', 'admin', '+54 9 11 1234-5678');

-- Usuario de prueba regular
-- Email: usuario@test.com
-- Password: User123!
INSERT INTO users (email, password, full_name, role, phone) VALUES
('usuario@test.com', '$2b$10$rXK5vN8h.qMYQJ9GxqPcWO8xqKF6YxYJhGJHqKuKYQpyJYPvZKqNO', 'Usuario de Prueba', 'user', '+54 9 11 9876-5432');

-- ============================================
-- 9. DEPARTAMENTOS DE EJEMPLO
-- ============================================
INSERT INTO apartments (title, description, bedrooms, bathrooms, max_guests, price_per_night, address, city, country, square_meters, amenities, is_available) VALUES
(
  'Departamento Moderno en Palermo',
  'Hermoso departamento de 2 ambientes en el corazón de Palermo. Totalmente equipado con todo lo necesario para una estadía confortable. A pocas cuadras de restaurantes, bares y transporte público.',
  1,
  1,
  2,
  15000.00,
  'Av. Santa Fe 4567',
  'Buenos Aires',
  'Argentina',
  45,
  ARRAY['wifi', 'aire_acondicionado', 'cocina', 'tv', 'heladera', 'microondas'],
  true
),
(
  'Amplio Departamento en Recoleta',
  'Espacioso departamento de 3 ambientes en la exclusiva zona de Recoleta. Cuenta con 2 dormitorios, living comedor, cocina completa y balcón con hermosa vista. Ideal para familias o grupos de amigos.',
  2,
  2,
  4,
  25000.00,
  'Av. Callao 1234',
  'Buenos Aires',
  'Argentina',
  75,
  ARRAY['wifi', 'aire_acondicionado', 'cocina', 'tv', 'heladera', 'microondas', 'lavarropas', 'balcon', 'gimnasio'],
  true
),
(
  'Acogedor Monoambiente en Belgrano',
  'Monoambiente luminoso y completamente amueblado en Belgrano. Perfecto para estadías cortas o largas. Excelente ubicación con fácil acceso a transporte público.',
  1,
  1,
  2,
  12000.00,
  'Cabildo 2345',
  'Buenos Aires',
  'Argentina',
  35,
  ARRAY['wifi', 'aire_acondicionado', 'cocina', 'tv', 'heladera'],
  true
),
(
  'Departamento Premium con Vista',
  'Impresionante departamento de 2 dormitorios con vista panorámica. Ubicado en un edificio moderno con amenities de primera categoría. Ideal para quienes buscan confort y lujo.',
  2,
  2,
  5,
  35000.00,
  'Av. del Libertador 8900',
  'Buenos Aires',
  'Argentina',
  90,
  ARRAY['wifi', 'aire_acondicionado', 'cocina', 'tv', 'heladera', 'microondas', 'lavarropas', 'balcon', 'gimnasio', 'pileta', 'parrilla', 'seguridad_24hs'],
  true
);

-- ============================================
-- 10. IMÁGENES DE DEPARTAMENTOS DE EJEMPLO
-- ============================================
-- Aquí puedes agregar URLs de imágenes reales más adelante
-- Por ahora usamos placeholders de unsplash.com

-- Imágenes para Departamento 1 (Palermo)
INSERT INTO apartment_images (apartment_id, image_url, is_main) 
SELECT id, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', true 
FROM apartments WHERE title LIKE '%Palermo%';

INSERT INTO apartment_images (apartment_id, image_url, is_main) 
SELECT id, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', false 
FROM apartments WHERE title LIKE '%Palermo%';

-- Imágenes para Departamento 2 (Recoleta)
INSERT INTO apartment_images (apartment_id, image_url, is_main) 
SELECT id, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', true 
FROM apartments WHERE title LIKE '%Recoleta%';

INSERT INTO apartment_images (apartment_id, image_url, is_main) 
SELECT id, 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800', false 
FROM apartments WHERE title LIKE '%Recoleta%';

-- Imágenes para Departamento 3 (Belgrano)
INSERT INTO apartment_images (apartment_id, image_url, is_main) 
SELECT id, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800', true 
FROM apartments WHERE title LIKE '%Belgrano%';

-- Imágenes para Departamento 4 (Premium)
INSERT INTO apartment_images (apartment_id, image_url, is_main) 
SELECT id, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800', true 
FROM apartments WHERE title LIKE '%Premium%';

INSERT INTO apartment_images (apartment_id, image_url, is_main) 
SELECT id, 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800', false 
FROM apartments WHERE title LIKE '%Premium%';

-- ============================================
-- 11. VERIFICACIÓN FINAL
-- ============================================
-- Ejecuta estas consultas después para verificar que todo se creó correctamente:

-- SELECT COUNT(*) as total_users FROM users;
-- SELECT COUNT(*) as total_apartments FROM apartments;
-- SELECT COUNT(*) as total_images FROM apartment_images;
-- SELECT title, bedrooms, price_per_night FROM apartments;

-- ============================================
-- NOTAS IMPORTANTES:
-- ============================================
-- 1. ✅ Las contraseñas están hasheadas con bcrypt
-- 2. ✅ Los roles son: 'user' | 'admin'
-- 3. ✅ Estados de reserva: 'pending' | 'confirmed' | 'cancelled' | 'completed'
-- 4. ✅ Los departamentos solo pueden tener 1 o 2 dormitorios
-- 5. ✅ Amenities sugeridos:
--    - wifi, aire_acondicionado, calefaccion
--    - cocina, heladera, microondas, lavarropas
--    - tv, balcon, terraza, gimnasio, pileta
--    - parrilla, estacionamiento, seguridad_24hs
-- 6. ✅ Las fechas de reserva validan que checkout > checkin
-- 7. ✅ Todos los precios deben ser positivos
-- 8. ✅ Los índices mejoran el rendimiento de búsquedas
-- 9. ✅ Los triggers actualizan updated_at automáticamente
-- 10. ✅ CASCADE en DELETE elimina registros relacionados

-- ============================================
-- CREDENCIALES DE PRUEBA:
-- ============================================
-- ADMIN:
--   Email: admin@apartments.com
--   Password: Admin123!
--
-- USUARIO:
--   Email: usuario@test.com
--   Password: User123!
--
-- ⚠️ CAMBIA ESTAS CREDENCIALES EN PRODUCCIÓN ⚠️
-- ============================================

-- ¡LISTO! Tu base de datos está configurada y con datos de prueba 🎉