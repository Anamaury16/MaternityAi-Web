import { useNavigate } from 'react-router-dom';
import { HeaderActividad } from '../../components/Headers/HeaderActividad/HeaderActividad';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../services/authService';
import styles from './InvestigadorHome.module.css';

// Solo módulos que operan con el identificador anónimo (ID-GMI)
// Según el protocolo: investigador NO accede a datos nominales
const QUICK_CARDS = [
  {
    icon: '📊',
    label: 'Indicadores',
    sub: 'Métricas anonimizadas',
    path: '/investigador/oba',
    color: '#7C3AED',
  },
  {
    icon: '📥',
    label: 'Exportación de Datos',
    sub: 'Datos con ID-GMI (anónimos)',
    path: '/investigador/cargas',
    color: '#0891B2',
  },
  {
    icon: '📚',
    label: 'Contenido Educativo',
    sub: 'Biblioteca y preguntas',
    path: '/investigador/preguntas',
    color: '#CA436E',
  },
];

export const InvestigadorHome = () => {
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
            <span className={styles.badge}>Panel Investigador · UNAD</span>
            <h1 className={styles.heroTitle}>
              Bienvenido, <span className={styles.accent}>Investigador</span>
            </h1>
            <p className={styles.heroSub}>
              Accede a indicadores y exportaciones con datos anonimizados
              para tu investigación. Los datos nominales están cifrados
              y no son visibles desde este módulo.
            </p>
          </div>
          <div className={styles.heroAvatar}>🔬</div>
        </section>

        {/* Banner de anonimización */}
        <div className={styles.anonBanner}>
          <span className={styles.anonIcon}>🔒</span>
          <div>
            <p className={styles.anonTitle}>Acceso con datos anonimizados</p>
            <p className={styles.anonDesc}>
              Según el protocolo del sistema, todos los registros se muestran
              únicamente con su código <strong>ID-GMI-[año]-[número]</strong>.
              Los datos nominales están cifrados y son accesibles solo para el
              equipo clínico autorizado (UNILIBRE / Hospital).
            </p>
          </div>
        </div>

        {/* Accesos rápidos */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Módulos de Investigación</h2>
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
            🔑 Rol: <strong>{user.role}</strong> &nbsp;·&nbsp; Solo datos anonimizados
          </span>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </section>
      </main>
    </div>
  );
};
