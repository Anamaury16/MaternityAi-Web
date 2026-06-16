import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const UsPage = lazy(() => import('./pages/UsPage').then(module => ({ default: module.UsPage })));
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Register = lazy(() => import('./pages/Register').then(module => ({ default: module.Register })));
const UserProfile = lazy(() => import('./pages/UserProfile').then(module => ({ default: module.UserProfile })));
const Biliboteca = lazy(() => import('./pages/Biblioteca').then(module => ({ default: module.Biliboteca })));
const Actividad = lazy(() => import('./pages/Actividad').then(module => ({ default: module.Actividad })));
const Ai = lazy(() => import('./pages/Ai').then(module => ({ default: module.Ai })));
const Main = lazy(() => import('./pages/Main').then(module => ({ default: module.Main })));

const AdminUsuarias = lazy(() => import('./pages/adminPages/AdminUsuarias').then(module => ({ default: module.AdminUsuarias })));
const AdminOBA = lazy(() => import('./pages/adminPages/AdminOBA').then(module => ({ default: module.AdminOBA })));
const AdminPreguntas = lazy(() => import('./pages/adminPages/AdminPreguntas').then(module => ({ default: module.AdminPreguntas })));
const AdminCitas = lazy(() => import('./pages/adminPages/AdminCitas').then(module => ({ default: module.AdminCitas })));
const AdminCargas = lazy(() => import('./pages/adminPages/AdminCargas').then(module => ({ default: module.AdminCargas })));
const AdminChecklist = lazy(() => import('./pages/adminPages/AdminChecklist').then(module => ({ default: module.AdminChecklist })));
const AdminIA = lazy(() => import('./pages/adminPages/AdminIA').then(module => ({ default: module.AdminIA })));

function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#CA436E', fontSize: '24px' }}>Cargando...</div>}>
          <Routes>
            {/* ── Rutas públicas ── */}
            <Route path="/" element={<HomePage />} />
            <Route path="/nosotros" element={<UsPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ── Rutas exclusivas de gestante ── */}
            {/* <Route element={<ProtectedRoute requiredRoles="gestante" />}> */}
              <Route path="/userprofile" element={<UserProfile />} />
              <Route path="/biblioteca" element={<Biliboteca />} />
              <Route path="/actividad" element={<Actividad />} />
              <Route path="/ai" element={<Ai />} />
              <Route path="/main" element={<Main />} />
            {/* </Route> */}

            {/* ── Rutas exclusivas de admin ── */}
            <Route element={<ProtectedRoute requiredRoles="admin" />}>
              <Route path="/admin" element={<Navigate to="/admin/usuarias" />} />
              <Route path="/admin/usuarias" element={<AdminUsuarias />} />
              <Route path="/admin/oba" element={<AdminOBA />} />
              <Route path="/admin/preguntas" element={<AdminPreguntas />} />
              <Route path="/admin/citas" element={<AdminCitas />} />
              <Route path="/admin/cargas" element={<AdminCargas />} />
              <Route path="/admin/checklist" element={<AdminChecklist />} />
              <Route path="/admin/ia" element={<AdminIA />} />
            </Route>

            {/* ── Rutas para clínico (también puede acceder a vistas admin) ── */}
            <Route element={<ProtectedRoute requiredRoles="clinico" />}>
              <Route path="/clinico" element={<Navigate to="/clinico/usuarias" replace />} />
              {/* El clínico reutiliza las vistas admin para gestionar pacientes */}
              <Route path="/clinico/usuarias" element={<AdminUsuarias />} />
              <Route path="/clinico/citas" element={<AdminCitas />} />
              <Route path="/clinico/oba" element={<AdminOBA />} />
              <Route path="/clinico/preguntas" element={<AdminPreguntas />} />
              <Route path="/clinico/checklist" element={<AdminChecklist />} />
            </Route>


            {/* ── Fallback ── */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
