import { Link, useNavigate, useLocation } from 'react-router-dom';
import { DegradedText } from '../../gradedcomponents/degradedtext/DegradedText';
import { logoutUser } from '../../../services/authService';
import styles from './HeaderActividad.module.css';
import { MobileBottomNav } from '../MobileBottomNav';

{/* interface para los roles */}
interface HeaderActividadProps {
  rol?: 'paciente' | 'medico' | 'admin' | 'hospital';
  tabActivo?: string; 
}


export const HeaderActividad = ({ rol }: HeaderActividadProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const rawRole = localStorage.getItem('role') || rol;
  const activeRole: 'paciente' | 'medico' | 'admin' | 'hospital' = 
    rawRole === 'admin' ? 'admin' :
    rawRole === 'hospital' ? 'hospital' :
    (rawRole === 'clinico' || rawRole === 'medico') ? 'medico' : 'paciente';

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const getTabClass = (path: string) => {
    return currentPath.includes(path) ? `${styles.tab} ${styles.activeTab}` : styles.tab;
  };

  return (
    <>
    <header className={`${styles.container} ${currentPath === '/main' || currentPath === '/biblioteca' || currentPath === '/userprofile' ? styles.hideOnMobileMain : ''}`}>
      <div className={styles.logo}>
        <DegradedText text="MaternityAi" fontSize="23px" />
      </div>

      <nav>        
        {activeRole === 'paciente' && (
          <>
            <Link to={'/main'} className={getTabClass('/main')}>Principal</Link>
            <Link to={'/biblioteca'} className={getTabClass('/biblioteca')}>Biblioteca</Link>
            <Link to={'/actividad'} className={getTabClass('/actividad')}>Actividad</Link>
            <Link to={'/ai'} className={getTabClass('/ai')}>Chat IA</Link>
          </>
        )}

        {/* Links específicos de Admin */}
        {activeRole === 'admin' && (
          <>
            <Link to={'/admin/usuarias'} className={styles.link}>Usuarias</Link>
            <Link to={'/admin/oba'} className={styles.link}>OBA</Link>
            <Link to={'/admin/preguntas'} className={styles.link}>Preguntas</Link>
            <Link to={'/admin/citas'} className={styles.link}>Citas</Link>
            <Link to={'/admin/cargas'} className={styles.link}>Cargas</Link>
            <Link to={'/admin/checklist'} className={styles.link}>Checklist</Link>
            <Link to={'/admin/ia'} className={styles.link}>IA</Link>
          </>
        )}

        {/* Links específicos de Médico / Clínico */}
        {activeRole === 'medico' && (
          <>
            <Link to={'/clinico/usuarias'} className={styles.link}>Usuarias</Link>
            <Link to={'/clinico/oba'} className={styles.link}>OBA</Link>
            <Link to={'/clinico/preguntas'} className={styles.link}>Preguntas</Link>
            <Link to={'/clinico/citas'} className={styles.link}>Citas</Link>
            <Link to={'/clinico/cargas'} className={styles.link}>Cargas</Link>
            <Link to={'/clinico/checklist'} className={styles.link}>Checklist</Link>
            <Link to={'/clinico/ia'} className={styles.link}>IA</Link>
          </>
        )}

        {activeRole === 'hospital' && (
          <>
            <Link to={'/hospital/dashboard'} className={getTabClass('/hospital/dashboard')}>Monitoreo de Alertas</Link>
          </>
        )}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div onClick={() => navigate('/userprofile')} className={styles.perfil}>
          <div>
            <p className={styles.name}>{localStorage.getItem('user_name') || 'Usuario'}</p>
            <p className={styles.desc}>
              {activeRole === 'medico' ? 'Personal Médico' : 
               activeRole === 'admin' ? 'Administrador' : 
               activeRole === 'hospital' ? 'Personal Hospitalario' : 
               'Gestante'}
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          style={{ 
            background: '#CA436E', 
            color: 'white', 
            border: 'none', 
            padding: '6px 12px', 
            borderRadius: '15px', 
            cursor: 'pointer', 
            height: 'fit-content',
            fontSize: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </header>
    
    <div className={styles.mobileNavWrapper}>
      <MobileBottomNav />
    </div>
    </>
  );
};
