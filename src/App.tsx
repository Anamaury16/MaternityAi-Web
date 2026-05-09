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
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/nosotros" element={<UsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute requiredRole="gestante" />}>
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/biblioteca" element={<Biliboteca />} />
            <Route path="/actividad" element={<Actividad />} />
            <Route path="/ai" element={<Ai />} />
            <Route path="/main" element={<Main />} />
          </Route>
          
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin" element={<Navigate to="/admin/usuarias" />} />
            <Route path="/admin/usuarias" element={<AdminUsuarias />} />
            <Route path="/admin/oba" element={<AdminOBA />} />
            <Route path="/admin/preguntas" element={<AdminPreguntas />} />
            <Route path="/admin/citas" element={<AdminCitas />} />
            <Route path="/admin/cargas" element={<AdminCargas />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
