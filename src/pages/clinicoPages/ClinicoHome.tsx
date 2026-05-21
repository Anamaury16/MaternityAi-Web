import { useNavigate } from 'react-router-dom';
import { HeaderActividad } from '../../components/Headers/HeaderActividad/HeaderActividad';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../services/authService';
import styles from './ClinicoHome.module.css';

const QUICK_CARDS = [
  { icon: '🤰', label: 'Mis Pacientes', sub: 'Ver historial clínico', path: '/admin/usuarias', color: '#CA436E' },
  { icon: '📅', label: 'Citas del día', sub: 'Agenda y consultas', path: '/admin/citas', color: '#7C3AED' },
  { icon: '📋', label: 'OBA', sub: 'Objetivos y alertas', path: '/admin/oba', color: '#0891B2' },
  { icon: '❓', label: 'Seguimiento', sub: 'Preguntas de control', path: '/admin/preguntas', color: '#059669' },
];

export const ClinicoHome = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.root}>
      <HeaderActividad rol="medico" />

      <main className={styles.main}>
        {/* Bienvenida */}
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <span className={styles.badge}>Panel Clínico</span>
            <h1 className={styles.heroTitle}>
              Bienvenido, <span className={styles.accent}>Clínico</span>
            </h1>
            <p className={styles.heroSub}>
              Gestiona tus pacientes, citas y seguimiento clínico desde un solo lugar.
            </p>
          </div>
          <div className={styles.heroAvatar}>🩺</div>
        </section>

        {/* Accesos rápidos */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Accesos Rápidos</h2>
          <div className={styles.cardGrid}>
            {QUICK_CARDS.map((card) => (
              <button
                key={card.path}
                className={styles.card}
                onClick={() => navigate(card.path)}
                style={{ '--accent': card.color } as React.CSSProperties}
              >
                <span className={styles.cardIcon}>{card.icon}</span>
                <span className={styles.cardLabel}>{card.label}</span>
                <span className={styles.cardSub}>{card.sub}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Info del usuario */}
        <section className={styles.infoBar}>
          <span className={styles.infoChip}>
            🔑 Rol: <strong>{user.role}</strong>
          </span>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </section>
      </main>
    </div>
  );
};
