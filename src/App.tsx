import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { UsPage } from './pages/UsPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { UserProfile } from './pages/UserProfile';
import { Biliboteca } from './pages/Biblioteca';
import { Actividad } from './pages/Actividad';
import { Ai } from './pages/Ai';
import { Main } from './pages/Main';
import { AdminUsuarias } from './pages/adminPages/AdminUsuarias';
import { AdminOBA } from './pages/adminPages/AdminOBA';
import { AdminPreguntas } from './pages/adminPages/AdminPreguntas';
import { AdminCitas } from './pages/adminPages/AdminCitas';
import { AdminCargas } from './pages/adminPages/AdminCargas';
import { ClinicoHome } from './pages/clinicoPages/ClinicoHome';
import { InvestigadorHome } from './pages/investigadorPages/InvestigadorHome';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* ── Rutas públicas ── */}
          <Route path="/" element={<HomePage />} />
          <Route path="/nosotros" element={<UsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── Rutas exclusivas de gestante ── */}
          <Route element={<ProtectedRoute requiredRoles="gestante" />}>
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/biblioteca" element={<Biliboteca />} />
            <Route path="/actividad" element={<Actividad />} />
            <Route path="/ai" element={<Ai />} />
            <Route path="/main" element={<Main />} />
          </Route>

          {/* ── Rutas exclusivas de admin ── */}
          <Route element={<ProtectedRoute requiredRoles="admin" />}>
            <Route path="/admin" element={<Navigate to="/admin/usuarias" />} />
            <Route path="/admin/usuarias" element={<AdminUsuarias />} />
            <Route path="/admin/oba" element={<AdminOBA />} />
            <Route path="/admin/preguntas" element={<AdminPreguntas />} />
            <Route path="/admin/citas" element={<AdminCitas />} />
            <Route path="/admin/cargas" element={<AdminCargas />} />
          </Route>

          {/* ── Rutas para clínico (también puede acceder a vistas admin) ── */}
          <Route element={<ProtectedRoute requiredRoles="clinico" />}>
            <Route path="/clinico" element={<ClinicoHome />} />
            {/* El clínico reutiliza las vistas admin para gestionar pacientes */}
            <Route path="/clinico/usuarias" element={<AdminUsuarias />} />
            <Route path="/clinico/citas" element={<AdminCitas />} />
            <Route path="/clinico/oba" element={<AdminOBA />} />
            <Route path="/clinico/preguntas" element={<AdminPreguntas />} />
          </Route>

          {/* ── Rutas para investigador ── */}
          <Route element={<ProtectedRoute requiredRoles="investigador" />}>
            <Route path="/investigador" element={<InvestigadorHome />} />
            <Route path="/investigador/oba" element={<AdminOBA />} />
            <Route path="/investigador/cargas" element={<AdminCargas />} />
            <Route path="/investigador/preguntas" element={<AdminPreguntas />} />
          </Route>

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
