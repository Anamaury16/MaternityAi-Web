import { Link, useNavigate, useLocation } from 'react-router-dom';
import { DegradedText } from '../../gradedcomponents/degradedtext/DegradedText';
import { logoutUser } from '../../../services/authService';
import styles from './HeaderActividad.module.css';

{/* interface para los roles */}
interface HeaderActividadProps {
  rol?: 'paciente' | 'medico' | 'admin';
  tabActivo?: string; 
}


export const HeaderActividad = ({ rol }: HeaderActividadProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const getTabClass = (path: string) => {
    return currentPath.includes(path) ? `${styles.tab} ${styles.activeTab}` : styles.tab;
  };

  return (
    <header className={styles.container}>
      <div className={styles.logo}>
        <DegradedText text="MaternityAi" fontSize="23px" />
      </div>

      <nav>        
        {(rol === 'paciente' || !rol) && (
          <>
            <Link to={'/main'} className={getTabClass('/main')}>Principal</Link>
            <Link to={'/biblioteca'} className={getTabClass('/biblioteca')}>Biblioteca</Link>
            <Link to={'/actividad'} className={getTabClass('/actividad')}>Actividad</Link>
            <Link to={'/ai'} className={getTabClass('/ai')}>Chat IA</Link>
          </>
        )}

        {/* link hacia los roles medico */}
        {rol === 'medico' && (
          <>
            <Link to={'/admin/usuarias'} className={styles.link}>Usuarias</Link>
            <Link to={'/admin/oba'} className={styles.link}>OBA</Link>
            <Link to={'/admin/preguntas'} className={styles.link}>Preguntas</Link>
            <Link to={'/admin/citas'} className={styles.link}>Citas</Link>
            <Link to={'/admin/cargas'} className={styles.link}>Cargas</Link>
          </>
        )}

        {/* link hacia los roles admin */}
        {rol === 'admin' && (
          <>
            <Link to={'/admin/oba'} className={styles.link}>OBA</Link>
            <Link to={'/admin/preguntas'} className={styles.link}>Preguntas</Link>
            <Link to={'/admin/cargas'} className={styles.link}>Cargas</Link>
          </>
        )}
    </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div onClick={() => navigate('/userprofile')} className={styles.perfil}>
          <div>
            <img src="/image/profilepicture.png" className={styles.foto} />
          </div>

          <div>
            <p className={styles.name}>Ana Maury</p>
            <p className={styles.desc}>Paciente</p>
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
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};
