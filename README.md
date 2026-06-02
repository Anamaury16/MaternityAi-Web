<div align="center">

# MaternityAI 🤰

**Plataforma de salud materna inteligente con IA**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)

</div>

---

## Requisitos

| Herramienta | Versión | Verificar |
|:-----------:|:-------:|:---------:|
| **Node.js** | >= 20   | `node -v` |
| **pnpm**    | >= 10   | `pnpm -v` |

> **⚠️ Este proyecto usa pnpm exclusivamente. No uses npm ni yarn.**

<details>
<summary>📥 ¿No tienes pnpm? Click aquí para instalarlo</summary>

```bash
# Opción A — Una sola vez con npm
npm install -g pnpm

# Opción B — Con Corepack (recomendado, viene con Node.js >= 16)
corepack enable
corepack prepare pnpm@latest --activate
```

</details>

---

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Anamaury16/MaternityAi-Web.git
cd MaternityAi-Web

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

> La app estará en **http://localhost:5173**

---

## Scripts

| Comando | Qué hace |
|---------|----------|
| `pnpm dev` | Servidor de desarrollo con HMR |
| `pnpm build` | Build de producción |
| `pnpm preview` | Preview del build |
| `pnpm lint` | Análisis con ESLint |

---

## Estructura

```
src/
├── components/           ← Componentes reutilizables
│   ├── Headers/          Navegación por sección
│   ├── Icons/            Íconos SVG
│   ├── Modal.tsx         Modal genérico
│   ├── ProtectedRoute.tsx Guard de rutas por rol
│   ├── admin/            Panel administrativo
│   ├── buttons/          Botones
│   ├── info/             Secciones informativas
│   └── profile/          Perfil de usuario
│
├── context/
│   └── AuthContext.tsx    ← Autenticación global
│
├── pages/                ← Vistas
│   ├── HomePage.tsx      Inicio (pública)
│   ├── Login.tsx         Inicio de sesión
│   ├── Register.tsx      Registro
│   ├── Main.tsx          Dashboard gestante
│   ├── Ai.tsx            Chat con IA
│   ├── Biblioteca.tsx    Recursos educativos
│   ├── Actividad.tsx     Actividades
│   ├── adminPages/       Panel admin
│   └── clinicoPages/     Panel clínico
│
├── services/             ← Llamadas API
│   ├── api.ts            Config base Axios
│   ├── authService.ts    Auth (login, registro)
│   ├── adminService.ts   Endpoints admin
│   └── m0Service.ts      Servicio M0
│
├── App.tsx               ← Enrutamiento
├── main.tsx              ← Entry point
└── index.css             ← Estilos globales
```

---

## Roles y rutas

| Rol | Rutas |
|-----|-------|
| 🌐 **Pública** | `/` · `/nosotros` · `/login` · `/register` |
| 🤰 **Gestante** | `/main` · `/ai` · `/biblioteca` · `/actividad` · `/userprofile` |
| 🔧 **Admin** | `/admin/usuarias` · `/admin/citas` · `/admin/oba` · `/admin/preguntas` · `/admin/cargas` |
| 🩺 **Clínico** | `/clinico/usuarias` · `/clinico/citas` · `/clinico/oba` · `/clinico/preguntas` |

---

## Stack

| | Tecnología | Uso |
|---|-----------|-----|
| ⚛️ | React 19 | UI |
| 🔷 | TypeScript 5.8 | Tipado |
| ⚡ | Vite 7 + SWC | Bundler |
| 🧭 | React Router 7 | Rutas SPA |
| 📡 | Axios | HTTP Client |
| 📱 | Vite PWA | App instalable |
| 🧹 | ESLint + Prettier | Calidad de código |

---

## Reglas del equipo

| ✅ Hacer | ❌ No hacer |
|----------|-------------|
| `pnpm install` | `npm install` |
| `pnpm add axios` | `npm i axios` |
| `pnpm dev` | `npm run dev` |
| Commitear `pnpm-lock.yaml` | Editar el lockfile manualmente |

---

## Troubleshooting

<details>
<summary>💥 "only-allow: npm is not allowed"</summary>

Intentaste usar npm. Usa `pnpm` en su lugar.
</details>

<details>
<summary>💥 "Cannot find module" después de pull</summary>

```bash
pnpm install
```
</details>

<details>
<summary>💥 La PWA no se actualiza</summary>

DevTools → Application → Service Workers → **Unregister**
</details>

<details>
<summary>💥 Error de versión de pnpm</summary>

```bash
corepack prepare pnpm@latest --activate
```
</details>

---

<div align="center">

**MaternityAI** · Proyecto privado · Todos los derechos reservados

</div>
