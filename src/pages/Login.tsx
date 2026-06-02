import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Headers/HeaderHome/Header';
import { ContentLogin } from '../components/info/contentlogin/ContentLogin';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../services/authService';

// Mapa rol → ruta de destino (igual que en FormLogin)
const ROLE_HOME: Record<string, string> = {
  gestante:     '/main',
  admin:        '/admin',
  clinico:      '/clinico',
  investigador: '/investigador',
};

export const Login = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Si ya hay sesión activa, ofrecemos opciones — NO redirigimos automáticamente
  // Así evitamos el problema de "entrar sin pedir credenciales"
  if (user.isAuthenticated && user.role) {
    const home = ROLE_HOME[user.role] ?? '/main';

    const handleContinue = () => navigate(home, { replace: true });

    const handleLogout = async () => {
      await logoutUser();
      logout(); // limpia el contexto
    };

    return (
      <div>
        <Header />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: '16px',
          fontFamily: 'Segoe UI, sans-serif',
          padding: '40px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '3rem' }}>👋</div>
          <h2 style={{ margin: '0', color: '#222' }}>
            Ya tienes una sesión activa
          </h2>
          <p style={{ color: '#666', margin: '0', fontSize: '0.95rem' }}>
            Sesión iniciada como <strong style={{ color: '#CA436E' }}>{user.role}</strong>
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              onClick={handleContinue}
              style={{
                padding: '10px 28px',
                background: '#CA436E',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Continuar como {user.role}
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '10px 28px',
                background: 'transparent',
                color: '#CA436E',
                border: '1.5px solid #CA436E',
                borderRadius: '25px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Cerrar sesión e ingresar con otra cuenta
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <ContentLogin />
    </div>
  );
};
