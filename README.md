<![CDATA[# 🤰 MaternityAI — Frontend

**Plataforma de salud materna inteligente** construida con React + TypeScript + Vite.

> [!IMPORTANT]
> Este proyecto usa **pnpm** como gestor de paquetes. **No uses npm ni yarn.**

---

## 📋 Requisitos previos

| Herramienta | Versión mínima | Cómo verificar        |
| ----------- | -------------- | --------------------- |
| **Node.js** | `>= 20.x`     | `node --version`      |
| **pnpm**    | `>= 10.x`     | `pnpm --version`      |

### Instalar pnpm (si no lo tienes)

```bash
# Opción 1 — Vía npm (una sola vez)
npm install -g pnpm

# Opción 2 — Vía Corepack (recomendado, viene con Node.js >= 16.13)
corepack enable
corepack prepare pnpm@latest --activate
```

> [!NOTE]
> El proyecto tiene un script `preinstall` que **bloquea** el uso de npm/yarn.  
> Si ejecutas `npm install` por error, verás un mensaje de error indicándote que uses `pnpm`.

---

## 🚀 Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/Anamaury16/MaternityAi-Web.git
cd MaternityAi-Web

# 2. Instalar dependencias
pnpm install

# 3. Iniciar el servidor de desarrollo
pnpm dev
```

La aplicación estará disponible en **http://localhost:5173**

---

## 📦 Scripts disponibles

| Comando          | Descripción                                         |
| ---------------- | --------------------------------------------------- |
| `pnpm dev`       | Inicia el servidor de desarrollo con HMR            |
| `pnpm build`     | Compila TypeScript y genera el bundle de producción  |
| `pnpm preview`   | Previsualiza el build de producción localmente       |
| `pnpm lint`      | Ejecuta ESLint para analizar el código               |

---

## 🏗️ Estructura del proyecto

```
MaternityAi-Web/
├── public/                  # Assets estáticos (imágenes, favicon, etc.)
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Headers/         #   → Headers de navegación
│   │   ├── Icons/           #   → Componentes de íconos
│   │   ├── Modal.tsx        #   → Modal genérico
│   │   ├── ProtectedRoute.tsx #  → Guard de rutas por rol
│   │   ├── admin/           #   → Componentes del panel admin
│   │   ├── buttons/         #   → Botones reutilizables
│   │   ├── gradedbutton/    #   → Botones con estilos graduados
│   │   ├── gradedcomponents/#   → Componentes con estilos graduados
│   │   ├── info/            #   → Componentes informativos
│   │   └── profile/         #   → Componentes de perfil de usuario
│   │
│   ├── context/
│   │   └── AuthContext.tsx   # Contexto global de autenticación
│   │
│   ├── pages/               # Páginas / Vistas
│   │   ├── HomePage.tsx      #   → Página de inicio (pública)
│   │   ├── Login.tsx         #   → Inicio de sesión
│   │   ├── Register.tsx      #   → Registro
│   │   ├── UsPage.tsx        #   → Página "Nosotros"
│   │   ├── Main.tsx          #   → Dashboard principal (gestante)
│   │   ├── Ai.tsx            #   → Chat con IA (gestante)
│   │   ├── Biblioteca.tsx    #   → Biblioteca de recursos (gestante)
│   │   ├── Actividad.tsx     #   → Actividades (gestante)
│   │   ├── UserProfile.tsx   #   → Perfil de usuario (gestante)
│   │   ├── adminPages/       #   → Vistas del panel administrativo
│   │   │   ├── AdminUsuarias.tsx    # Gestión de usuarias
│   │   │   ├── AdminCitas.tsx       # Gestión de citas
│   │   │   ├── AdminOBA.tsx         # Gestión OBA
│   │   │   ├── AdminPreguntas.tsx   # Gestión de preguntas
│   │   │   └── AdminCargas.tsx      # Gestión de cargas
│   │   └── clinicoPages/    #   → Vistas del panel clínico
│   │
│   ├── services/            # Servicios y llamadas API
│   │   ├── api.ts            #   → Configuración base de Axios
│   │   ├── authService.ts    #   → Autenticación (login, registro, tokens)
│   │   ├── adminService.ts   #   → Endpoints del admin
│   │   └── m0Service.ts      #   → Servicio M0
│   │
│   ├── App.tsx              # Enrutamiento principal
│   ├── main.tsx             # Punto de entrada de React
│   └── index.css            # Estilos globales
│
├── index.html               # HTML principal
├── vite.config.ts           # Configuración de Vite + PWA
├── tsconfig.json            # Configuración TypeScript (raíz)
├── tsconfig.app.json        # Config TS para la aplicación
├── tsconfig.node.json       # Config TS para scripts Node
├── eslint.config.js         # Configuración de ESLint
├── .prettierrc              # Configuración de Prettier
├── pnpm-lock.yaml           # Lockfile de pnpm (⚠️ NO eliminar)
├── pnpm-workspace.yaml      # Configuración del workspace pnpm
└── package.json             # Dependencias y scripts
```

---

## 🔐 Roles y rutas

La aplicación maneja tres roles con rutas protegidas:

| Rol          | Rutas disponibles                                                    |
| ------------ | -------------------------------------------------------------------- |
| **Pública**  | `/`, `/nosotros`, `/login`, `/register`                              |
| **Gestante** | `/main`, `/ai`, `/biblioteca`, `/actividad`, `/userprofile`          |
| **Admin**    | `/admin/usuarias`, `/admin/citas`, `/admin/oba`, `/admin/preguntas`, `/admin/cargas` |
| **Clínico**  | `/clinico/usuarias`, `/clinico/citas`, `/clinico/oba`, `/clinico/preguntas` |

---

## 🛠️ Stack tecnológico

| Tecnología                | Propósito                    |
| ------------------------- | ---------------------------- |
| **React 19**              | Librería de UI               |
| **TypeScript 5.8**        | Tipado estático              |
| **Vite 7**                | Bundler y dev server         |
| **React Router DOM 7**    | Enrutamiento SPA             |
| **Axios**                 | Cliente HTTP                 |
| **Vite PWA Plugin**       | Progressive Web App          |
| **ESLint + Prettier**     | Linting y formateo           |
| **SWC**                   | Compilador rápido para React |

---

## ⚠️ Reglas del equipo

1. **Solo pnpm** — Nunca ejecutes `npm install` ni `yarn install`.
2. **Agregar dependencias**: `pnpm add <paquete>` (producción) o `pnpm add -D <paquete>` (dev).
3. **No edites `pnpm-lock.yaml`** manualmente — se genera automáticamente.
4. **Formatea antes de commitear**: `pnpm lint` para verificar errores de estilo.

---

## 🐛 Solución de problemas

### "ERR_PNPM_BAD_PM_VERSION" o error al instalar
```bash
# Actualiza pnpm a la versión requerida
corepack prepare pnpm@latest --activate
```

### "Cannot find module" después de pull
```bash
# Reinstala dependencias (es rápido con pnpm)
pnpm install
```

### La PWA no se actualiza en desarrollo
```bash
# Limpia la caché del Service Worker en el navegador:
# DevTools → Application → Service Workers → Unregister
```

### Error "only-allow: npm is not allowed"
Esto significa que intentaste usar npm. Usa `pnpm` en su lugar.

---

## 📄 Licencia

Proyecto privado — Todos los derechos reservados.
]]>
