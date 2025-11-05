# Sistema de Reservas de Departamentos

Un sistema completo para gestionar reservas de departamentos con autenticación de usuarios.

## 🏗️ Arquitectura

- **Backend**: NestJS con TypeScript
- **Frontend**: React con TypeScript
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: JWT + Supabase Auth

## 🚀 Características

- ✅ Registro y login de usuarios
- ✅ Listado de departamentos (1 y 2 habitaciones)
- ✅ Sistema de reservas
- ✅ Panel de administración
- ✅ Interfaz responsive

## 📁 Estructura del Proyecto

```
proyecto-departamentos/
├── backend/          # NestJS API
│   ├── src/
│   │   ├── auth/     # Autenticación
│   │   ├── users/    # Gestión usuarios
│   │   ├── apartments/ # Departamentos
│   │   └── bookings/ # Reservas
└── frontend/         # React App
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── hooks/
    └── └── services/
```

## 🛠️ Instalación y Configuración

### Backend (NestJS)

```bash
cd backend
npm install
cp .env.example .env
# Configura las variables de entorno
npm run start:dev
```

### Frontend (React)

```bash
cd frontend
npm install
cp .env.example .env
# Configura las variables de entorno
npm start
```

### Base de Datos (Supabase)

1. Crea una cuenta en [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Ejecuta las migraciones SQL incluidas en `database/`
4. Configura las variables de entorno

## 🔧 Variables de Entorno

### Backend (.env)
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
PORT=3001
```

### Frontend (.env)
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_API_URL=http://localhost:3001
```

## 📊 Esquema de Base de Datos

### Tablas Principales:
- `users` - Usuarios del sistema
- `apartments` - Departamentos disponibles
- `bookings` - Reservas realizadas
- `apartment_images` - Imágenes de departamentos

## 🎯 Funcionalidades

### Para Usuarios:
- Registro e inicio de sesión
- Visualizar departamentos disponibles
- Hacer reservas
- Ver historial de reservas
- Cancelar reservas

### Para Administradores:
- Gestionar departamentos
- Ver todas las reservas
- Gestionar usuarios
- Dashboard con estadísticas

## 🚦 Estados de Reserva
- `pending` - Pendiente de confirmación
- `confirmed` - Confirmada
- `cancelled` - Cancelada
- `completed` - Completada

## 📱 Tecnologías Utilizadas

### Backend:
- NestJS
- TypeScript
- Supabase Client
- JWT
- Class Validator
- Swagger/OpenAPI

### Frontend:
- React 18
- TypeScript
- React Router v6
- Tailwind CSS
- React Hook Form
- React Query
- Zustand (Estado global)
- Lucide React (Iconos)

## 🔐 Autenticación

El sistema utiliza JWT tokens para autenticación:
1. Usuario se registra/logea
2. Supabase genera JWT token
3. Token se incluye en headers de API
4. Backend valida token en cada request

## 🎨 Diseño UI/UX

- Interfaz moderna y responsive
- Diseño mobile-first
- Componentes reutilizables
- Feedback visual para acciones
- Loading states y error handling

## 📈 Próximas Características

- [ ] Notificaciones en tiempo real
- [ ] Sistema de calificaciones
- [ ] Chat integrado
- [ ] Pagos online
- [ ] Dashboard de analytics
- [ ] App móvil