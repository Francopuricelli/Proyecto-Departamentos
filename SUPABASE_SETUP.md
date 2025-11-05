# 🗄️ GUÍA COMPLETA: CONFIGURACIÓN DE SUPABASE

## 📋 RESUMEN RÁPIDO

Tu base de datos tendrá:
- ✅ **4 Tablas**: users, apartments, apartment_images, bookings
- ✅ **12 Índices** para optimización
- ✅ **3 Triggers** automáticos
- ✅ **6 Departamentos** de ejemplo
- ✅ **2 Usuarios** de prueba (admin y user)
- ✅ **8 Imágenes** de ejemplo

---

## 🚀 PASO A PASO

### **PASO 1: Crear Proyecto en Supabase** (3 minutos)

1. Ve a: **https://supabase.com**
2. Clic en **"Start your project"** o **"Sign in"**
3. Crea cuenta (puedes usar GitHub para login rápido)
4. Una vez dentro, clic en **"New Project"** (botón verde)
5. Completa el formulario:
   ```
   Organization: (selecciona o crea una)
   Name: apartamentos-reservas
   Database Password: [GUARDA ESTA CONTRASEÑA - la necesitarás]
   Region: South America (São Paulo) - [elige el más cercano]
   Pricing Plan: Free (es suficiente para desarrollo)
   ```
6. Clic en **"Create new project"**
7. ⏳ **Espera 2-3 minutos** mientras se crea el proyecto

---

### **PASO 2: Obtener Credenciales** (1 minuto)

Una vez creado el proyecto:

1. En el menú lateral izquierdo, clic en **⚙️ Settings**
2. Luego clic en **API**
3. Verás una pantalla con tus credenciales:

```
┌─────────────────────────────────────────────────────┐
│ Project URL                                         │
│ https://xxxxxxxxxxxxx.supabase.co                   │
│                                                     │
│ API Keys                                            │
│                                                     │
│ anon public                                         │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...           │
│                                                     │
│ service_role (⚠️ MANTÉN ESTO SECRETO)              │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...           │
└─────────────────────────────────────────────────────┘
```

4. **COPIA Y GUARDA** estas 3 cosas:
   - ✅ Project URL
   - ✅ anon public key
   - ✅ service_role key

---

### **PASO 3: Crear las Tablas** (2 minutos)

1. En el menú lateral izquierdo, clic en **🛢️ SQL Editor**
2. Clic en **"New Query"** (botón verde arriba a la derecha)
3. Verás un editor de texto vacío
4. **Abre el archivo**: `database/schema.sql` (en tu proyecto)
5. **Copia TODO** el contenido del archivo
6. **Pégalo** en el editor de Supabase
7. Clic en **"Run"** (botón verde) o presiona `Ctrl + Enter`
8. ⏳ Espera unos segundos...
9. ✅ Deberías ver: **"Success. No rows returned"**

---

### **PASO 4: Verificar que Todo Funcionó** (1 minuto)

1. En el menú lateral, clic en **📊 Table Editor**
2. Deberías ver 4 tablas:
   ```
   ✅ users
   ✅ apartments
   ✅ apartment_images
   ✅ bookings
   ```

3. Haz clic en **"users"** - deberías ver:
   - 2 usuarios registrados
   - admin@apartments.com (Admin)
   - usuario@test.com (User)

4. Haz clic en **"apartments"** - deberías ver:
   - 4 departamentos de ejemplo
   - Con diferentes precios y características

5. Haz clic en **"apartment_images"** - deberías ver:
   - 8 imágenes asociadas a los departamentos

---

### **PASO 5: Configurar Variables de Entorno** (2 minutos)

#### **Backend** (`backend/.env`):

1. En tu proyecto, crea el archivo `backend/.env`
2. Copia esto y reemplaza con tus datos:

```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tu_service_key_aqui
JWT_SECRET=cambia_esto_por_un_secreto_super_seguro_en_produccion_12345
PORT=3001
NODE_ENV=development
```

#### **Frontend** (`frontend/.env`):

1. En tu proyecto, crea el archivo `frontend/.env`
2. Copia esto y reemplaza con tus datos:

```env
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tu_anon_key_aqui
```

---

## 📊 ESTRUCTURA DE LA BASE DE DATOS

### **Tabla 1: `users`**
Almacena información de usuarios (clientes y administradores)

```sql
users
├── id (UUID)              → ID único del usuario
├── email (VARCHAR)        → Email único
├── password (VARCHAR)     → Contraseña hasheada (bcrypt)
├── full_name (VARCHAR)    → Nombre completo
├── phone (VARCHAR)        → Teléfono (opcional)
├── role (VARCHAR)         → 'user' o 'admin'
├── created_at (TIMESTAMP) → Fecha de registro
└── updated_at (TIMESTAMP) → Última actualización
```

### **Tabla 2: `apartments`**
Información de los departamentos disponibles

```sql
apartments
├── id (UUID)                → ID único del departamento
├── title (VARCHAR)          → Título/Nombre
├── description (TEXT)       → Descripción detallada
├── bedrooms (INTEGER)       → Dormitorios (1 o 2)
├── bathrooms (INTEGER)      → Baños (1-5)
├── max_guests (INTEGER)     → Capacidad máxima
├── price_per_night (DECIMAL)→ Precio por noche
├── address (VARCHAR)        → Dirección completa
├── city (VARCHAR)           → Ciudad
├── country (VARCHAR)        → País
├── square_meters (INTEGER)  → Metros cuadrados
├── amenities (TEXT[])       → Array de comodidades
├── is_available (BOOLEAN)   → Disponible para reservar
├── created_at (TIMESTAMP)   → Fecha de creación
└── updated_at (TIMESTAMP)   → Última actualización
```

### **Tabla 3: `apartment_images`**
Imágenes de los departamentos

```sql
apartment_images
├── id (UUID)              → ID único de la imagen
├── apartment_id (UUID)    → ID del departamento (FK)
├── image_url (TEXT)       → URL de la imagen
├── is_main (BOOLEAN)      → Si es imagen principal
└── created_at (TIMESTAMP) → Fecha de carga
```

### **Tabla 4: `bookings`**
Reservas realizadas por los usuarios

```sql
bookings
├── id (UUID)              → ID único de la reserva
├── user_id (UUID)         → ID del usuario (FK)
├── apartment_id (UUID)    → ID del departamento (FK)
├── check_in (DATE)        → Fecha de entrada
├── check_out (DATE)       → Fecha de salida
├── guests (INTEGER)       → Número de huéspedes
├── total_price (DECIMAL)  → Precio total calculado
├── status (VARCHAR)       → Estado: pending/confirmed/cancelled/completed
├── notes (TEXT)           → Notas adicionales
├── created_at (TIMESTAMP) → Fecha de reserva
└── updated_at (TIMESTAMP) → Última actualización
```

---

## 🔐 CREDENCIALES DE PRUEBA

Una vez configurado, puedes usar estas credenciales para probar:

### **Cuenta Administrador:**
```
Email: admin@apartments.com
Password: Admin123!
Rol: admin
```

### **Cuenta Usuario:**
```
Email: usuario@test.com
Password: User123!
Rol: user
```

⚠️ **IMPORTANTE**: Cambia estas credenciales antes de publicar en producción.

---

## 📈 DATOS DE EJEMPLO INCLUIDOS

Tu base de datos vendrá con:

### **4 Departamentos:**
1. **Departamento Moderno en Palermo** (1 dormitorio) - $15,000/noche
2. **Amplio Departamento en Recoleta** (2 dormitorios) - $25,000/noche
3. **Acogedor Monoambiente en Belgrano** (1 dormitorio) - $12,000/noche
4. **Departamento Premium con Vista** (2 dormitorios) - $35,000/noche

Cada uno con:
- Descripción completa
- Amenities (wifi, aire acondicionado, cocina, etc.)
- Imágenes de ejemplo (desde Unsplash)
- Diferentes características

---

## ✅ VERIFICACIÓN FINAL

Ejecuta estas consultas en el SQL Editor para verificar:

```sql
-- Ver usuarios
SELECT email, full_name, role FROM users;

-- Ver departamentos
SELECT title, bedrooms, price_per_night, city FROM apartments;

-- Ver imágenes
SELECT a.title, COUNT(ai.id) as total_images 
FROM apartments a 
LEFT JOIN apartment_images ai ON a.id = ai.apartment_id 
GROUP BY a.title;

-- Ver que no hay reservas aún
SELECT COUNT(*) as total_bookings FROM bookings;
```

---

## 🚨 TROUBLESHOOTING

### Error: "relation already exists"
- **Solución**: Esto significa que ya ejecutaste el script antes. Está bien, significa que tus tablas ya existen.

### Error: "permission denied"
- **Solución**: Asegúrate de estar en el SQL Editor de tu proyecto correcto.

### No veo las tablas
- **Solución**: Refresca la página de Supabase (F5) y vuelve al Table Editor.

### Las credenciales no funcionan
- **Solución**: Verifica que copiaste correctamente:
  - Project URL (sin / al final)
  - Las keys completas (son muy largas)

---

## 🎯 PRÓXIMO PASO

Una vez configurado Supabase:

1. ✅ Configura los archivos `.env` (Backend y Frontend)
2. ✅ Inicia el backend: `cd backend && npm run start:dev`
3. ✅ Prueba la API en: http://localhost:3001/api/docs
4. ✅ Inicia el frontend: `cd frontend && npm run dev`

---

## 📝 NOTAS IMPORTANTES

- 🔒 El `service_role` key tiene permisos completos. **NO LO COMPARTAS** ni lo subas a GitHub.
- 🔐 Las contraseñas están hasheadas con bcrypt en la base de datos.
- 📸 Las imágenes de ejemplo son de Unsplash (puedes reemplazarlas después).
- 🆓 El plan Free de Supabase incluye:
  - 500 MB de base de datos
  - 1 GB de almacenamiento de archivos
  - 2 GB de transferencia
  - (Suficiente para desarrollo y pequeña escala)

---

¿Listo para configurar? ¡Sigue los pasos y tu base de datos estará lista en menos de 10 minutos! 🚀